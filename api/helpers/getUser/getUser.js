// ignore linting for this file
/* eslint-disable */

// export const USER_SUB_QUERY = `SELECT
//     u.id AS user_id,
//     u.first_name,
//     u.last_name,
//     u.email,
//     u.is_admin,
//     u.password,
//     s.id AS search_id,
//     s.include_terms,
//     s.exclude_terms
//     FROM users u
//     LEFT JOIN searches s
//     ON u.id = s.user_id
//     WHERE u.id = $1
//     AND s.deleted_at IS NULL;`;

import { logger } from "../../utils/logger.js";

// export const USER_SUB_QUERY_BY_EMAIL = `SELECT
// 		u.id AS user_id,
// 		u.first_name,
// 		u.last_name,
// 		u.email,
// 		u.is_admin,
// 		u.password,
// 		s.id AS search_id,
// 		s.include_terms,
// 		s.exclude_terms
// 		FROM users u
// 		LEFT JOIN searches s
// 		ON u.id = s.user_id
// 		WHERE u.email = $1
// 		AND s.deleted_at IS NULL;`;

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

export const GET_SEARCHES_BY_USER_ID = `
	SELECT
		id as search_id, include_terms, exclude_terms 
		FROM searches 
		WHERE user_id = $1 AND deleted_at IS NULL;`;

export function userReturnObjMaker({ user, searches }) {
	const searchesObj = searches.map((row) => {
		return {
			id: row.search_id,
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

	console.log({ returnObj });

	return returnObj;
}

export function getUser(userId) {
	return new Promise((resolve, reject) => {
		pool
			.query(GET_USER_BY_ID, [userId], (error, result) => {
				if (error) {
					reject(error);
				}

				if (result.rows.length === 0) {
					reject("User not found");
				}

				const user = result.rows[0];

				return user;
			})
			.then((user) => {
				pool.query(
					GET_SEARCHES_BY_USER_ID,
					[userId],
					(searchesError, searchesResult) => {
						if (searchesError) {
							reject(searchesError);
						}

						const searches = searchesResult.rows;

						const returnUserObj = userReturnObjMaker({ user, searches });

						resolve(returnUserObj);
					}
				);
			})
			.catch((error) => {
				logger.error(error);
				reject("Error getting user");
			});
	});
}
