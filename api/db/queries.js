import "dotenv/config";
import pg from "pg";
import { logger } from "../utils/logger.js";

import {
	productCountQueryBuilder,
	productSearchQueryBuilder,
} from "./queryHelpers/products.js";

import {
	userReturnObjMaker,
	getUser,
	getUserPets,
	getUserSearches,
	getPetById,
} from "../helpers/getUser/getUser.js";

const pool = new pg.Pool({
	user: "postgres",
	password: "password",
	host: "0.0.0.0",
	port: 5432,
	database: "catFeeder",
});

await pool.connect();

export const getStatus = async (req, res) => {
	const response = await pool.query(`SELECT NOW();`);
	return res.json(response.rows);
};

export const getProductCount = async (req, res) => {
	const includeIngredients = req.query.include
		? req.query.include.split(",")
		: [];
	const excludeIngredients = req.query.exclude
		? req.query.exclude.split(",")
		: [];

	const { query, params } = productCountQueryBuilder({
		includeIngredients,
		excludeIngredients,
	});

	const response = await pool.query(query, params);
	const count = response.rows[0].count || 0;
	return res.status(200).json(count);
};

export const getProducts = async (req, res) => {
	const includeIngredients = req.query.include
		? req.query.include.split(",")
		: [];
	const excludeIngredients = req.query.exclude
		? req.query.exclude.split(",")
		: [];

	const page = req.query.page || 0;

	const limit = req.query.limit || 10;

	const { productCountQuery, productCountParams } = productCountQueryBuilder({
		includeIngredients,
		excludeIngredients,
	});

	const productCountResponse = await pool.query(
		productCountQuery,
		productCountParams
	);

	const productCount = productCountResponse.rows[0].count || 0;

	const { ingredientsQuery, ingredientsArray } = productSearchQueryBuilder({
		includeIngredients,
		excludeIngredients,
		page,
		limit,
	});

	const response = await pool.query(ingredientsQuery, ingredientsArray);

	return res.json({ count: productCount, results: response.rows });
};

// saves a search to the database
export const postSearch = async (req, res) => {
	const { include, exclude, userId } = req.body;
	console.log({ include, exclude, userId });

	if (!userId || (!include && !exclude)) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	const user_id = userId;
	const include_terms = JSON.stringify(include);
	const exclude_terms = JSON.stringify(exclude);

	pool.query(
		`INSERT INTO searches (user_id, include_terms, exclude_terms) VALUES ($1, $2, $3)`,
		[user_id, include_terms, exclude_terms],
		async (err, result) => {
			if (err) {
				logger.error(err);
				return res.status(500).json({ error: "Error saving search" });
			} else {
				const user = await getUser(userId);

				if (!user) {
					return res.status(400).json({ error: "User not found" });
				}

				const searches = await getUserSearches(userId);

				const returnUserObj = userReturnObjMaker({ user, searches });

				return res.status(200).json({ user: returnUserObj });
			}
		}
	);
};

// soft deletes a search from the database
export const postCancelSearch = async (req, res) => {
	const { userId, searchIds } = req.body;

	if (!userId || !searchIds || !searchIds.length) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	const searchIdInts = searchIds.map((id) => parseInt(id, 10));

	pool.query(
		`UPDATE searches SET deleted_at = CURRENT_TIMESTAMP WHERE id = ANY($1::int[])`,
		[searchIdInts],
		async (err, result) => {
			if (err) {
				logger.error(err);
				return res.status(500).json({ error: "Error deleting search" });
			}
			const user = await getUser(userId);
			if (!user) {
				return res.status(400).json({ error: "User not found" });
			}
			const searches = await getUserSearches(userId);
			const returnUserObj = userReturnObjMaker({ user, searches });
			return res.status(200).json({ user: returnUserObj });
		}
	);
};

export const getPets = async (req, res) => {
	const userId = req.query.userId;

	if (!userId) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	const user = await getUser(userId);

	if (!user) {
		return res.status(400).json({ error: "User not found" });
	}

	const pets = await getUserPets(userId);

	return res.status(200).json({ pets });
};

export const postPet = async (req, res) => {
	const { id, userId, petName, action } = req.body;

	if (!id || !userId || !petName || !action) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	const pets = await getUserPets(userId);

	if (!pets || pets.length === 0) {
		return res.status(400).json({ error: "Pet not found" });
	}

	const pet = pets.filter((pet) => pet.pet_name === petName)[0] || undefined;

	if (action === "CREATE") {
		if (pet.id) {
			return res
				.status(400)
				.json({ error: "Pet already exists - cannot create new pet" });
		}

		pool.query(
			`INSERT INTO pets (pet_name, user_id) VALUES ($1, $2)`,
			[petName, userId],
			async (err, result) => {
				if (err) {
					logger.error(err);
					return res.status(500).json({ error: "Error updating pet" });
				}
				const user = await getUser(userId);
				if (!user) {
					return res.status(400).json({ error: "User not found" });
				}
				const pets = await getUserPets(userId);

				return res.status(200).json({ pets });
			}
		);
	}

	if (action === "DELETE") {
		if (!pet) {
			return res.status(400).json({ error: "Pet not found - action delete" });
		}

		const petId = pet.id.toString();

		await pool.query(
			`UPDATE pets SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1;`,
			[petId]
		);

		const pets = await getUserPets(userId);

		return res.status(200).json({ message: "Pet deleted", pets });
	}

	if (action === "UPDATE") {
		if (!pet) {
			return res.status(400).json({ error: "Pet not found - action update" });
		}

		const petId = pet.id.toString();
		const dbPetName = pet.pet_name;

		if (dbPetName === petName) {
			return res.status(400).json({ error: "Pet name already exists" });
		}

		pool.query(
			`UPDATE pets SET pet_name = $1, include_ WHERE id = $2`,
			[petName, petId],
			async (err, result) => {
				if (err) {
					logger.error(err);
					return res.status(500).json({ error: "Error updating pet" });
				}
				const user = await getUser(userId);
				if (!user) {
					return res.status(400).json({ error: "User not found" });
				}
				const pets = await getUserPets(userId);

				return res.status(200).json({ pets });
			}
		);
	}
};
