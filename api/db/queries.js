import "dotenv/config";
import pg from "pg";
import { ingredientsQueryBuilder } from "./queryHelpers/ingredients.js";
import { productsQueryBuilder } from "./queryHelpers/products.js";
// const pgCredentials = process.env.DB_CREDENTIALS;

import {
	userReturnObjMaker,
	getUser,
	getUserSearches,
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

export const getProducts = async (req, res) => {
	const includeIngredients = req.query.include
		? req.query.include.split(",")
		: [];
	const excludeIngredients = req.query.exclude
		? req.query.exclude.split(",")
		: [];

	const page = req.query.page || 1;

	const limit = req.query.limit || 10;

	const { ingredientsQuery, ingredientsArray } = productsQueryBuilder({
		includeIngredients,
		excludeIngredients,
		page,
		limit,
	});

	console.log("*** INPUTS ***", {
		ingredientsQuery,
		ingredientsArray,
		page,
		limit,
	});

	const response = await pool.query(ingredientsQuery, ingredientsArray);

	console.log("PRODUCT RESULTS", {
		includeIngredients,
		excludeIngredients,
		rowLength: response.rows.length,
	});

	return res.json(response.rows);
};

export const getProductsByIngredients = async (req, res) => {
	const includeIngredients = req.query.include
		? req.query.include.split(",")
		: [];
	const excludeIngredients = req.query.exclude
		? req.query.exclude.split(",")
		: [];

	const page = req.query.page || 1;

	const limit = req.query.limit || 10;

	const { ingredientsQuery, ingredientsArray } = ingredientsQueryBuilder({
		includeIngredients,
		excludeIngredients,
	});

	console.log({ ingredientsQuery, ingredientsArray });

	const response = await pool.query(ingredientsQuery, ingredientsArray);

	console.log({
		includeIngredients,
		excludeIngredients,
		rowLength: response.rows.length,
	});

	return res.json(response.rows);
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
