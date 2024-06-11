import "dotenv/config";
import pg from "pg";
import { logger } from "../../utils/logger.js";

const connectionString = encodeURI(process.env.PG_CREDENTIALS);

const SSL_CERT = process.env.SSL_CERT;

console.log({ connectionString, SSL_CERT });

const pool = new pg.Pool({
	connectionString,
	ssl: false,
	// ssl: false,
});

await pool.connect();

export const GET_USER_BY_EMAIL = `
	SELECT
		id, first_name, last_name, email, password, is_admin 
		FROM users 
		WHERE email = $1;`;

export const GET_USER_BY_ID = `
	SELECT
		id, first_name, last_name, email, password, is_admin 
		FROM users 
		WHERE id = $1;`;

export const GET_PETS_BY_USER_ID = `
	SELECT
		id, pet_name
		FROM pets
		WHERE user_id = $1
		AND deleted_at IS NULL;
`;

export const GET_SEARCHES_BY_USER_ID = `
	SELECT
		id as search_id, pet_id, include_terms, exclude_terms 
		FROM searches 
		WHERE user_id = $1 AND deleted_at IS NULL;`;

export const GET_PET_BY_ID = `
	SELECT id as pet_id, pet_name, user_id
		FROM pets
		WHERE id = $1
		AND deleted_at IS NULL;
`;

export function userReturnObjMaker({ user, searches }) {
	const searchesObj = searches.map((row) => {
		return {
			id: row.search_id,
			pet_id: row.pet_id,
			include: JSON.parse(row.include_terms),
			exclude: JSON.parse(row.exclude_terms),
		};
	});

	const returnObj = {
		id: user.id,
		first_name: user.first_name,
		last_name: user.last_name,
		email: user.email,
		isAdmin: user.is_admin,
		searches: searchesObj,
	};

	return returnObj;
}

const poolQuery = (query, params) => {
	return new Promise((resolve, reject) => {
		pool.query(query, params, (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
};

export async function getUser(userId) {
	try {
		const userResult = await poolQuery(GET_USER_BY_ID, [userId]);

		if (userResult.rows.length === 0) {
			logger.error("User not found for id", userId);
			return false;
		}

		if (userResult.rows.length > 1) {
			logger.error("Multiple users found for id", userId);
			return false;
		}

		const user = userResult.rows[0];

		return user;
	} catch (error) {
		logger.error(error);
		return false;
	}
}

export async function getUserSearches(userId) {
	try {
		const searchesResult = await poolQuery(GET_SEARCHES_BY_USER_ID, [userId]);

		return searchesResult.rows;
	} catch (error) {
		logger.error(error);
		return false;
	}
}

export async function getUserPets(userId) {
	try {
		const petsResult = await poolQuery(GET_PETS_BY_USER_ID, [userId]);
		return petsResult.rows;
	} catch (error) {
		logger.error(error);
		return false;
	}
}

export async function getUserByEmail(email) {
	try {
		const userResult = await poolQuery(GET_USER_BY_EMAIL, [email]);

		if (userResult.rows.length === 0) {
			logger.error("User not found for email", email);
			return false;
		}

		if (userResult.rows.length > 1) {
			logger.error("Multiple users found for email", email);
			return false;
		}

		const user = userResult.rows[0];

		return user;
	} catch (error) {
		logger.error(error);
		return false;
	}
}

export async function getPetById(petId) {
	try {
		const petResult = await poolQuery(GET_PET_BY_ID, [petId]);

		if (petResult.rows.length === 0) {
			logger.error("Pet not found for id", petId);
			return false;
		}

		if (petResult.rows.length > 1) {
			logger.error("Multiple pets found for id", petId);
			return false;
		}

		const pet = petResult.rows[0];

		return pet;
	} catch (error) {
		logger.error(error);
		return false;
	}
}
