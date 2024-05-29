import "dotenv/config";
import pg from "pg";
import { ingredientsQueryBuilder } from "./queryHelpers/ingredients.js";
// const pgCredentials = process.env.DB_CREDENTIALS;

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

export const getProducts = async (_, res) => {
	console.log("GET productsasdfasd");
	const response = await pool.query("SELECT * FROM products;");
	return res.json(response.rows);
};

export const getProductsByIngredients = async (req, res) => {
	const includeIngredients = req.query.include
		? req.query.include.split(",")
		: [];
	const excludeIngredients = req.query.exclude
		? req.query.exclude.split(",")
		: [];
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

	if (!userId) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	if (!include && !exclude) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	const user_id = userId;
	const include_terms = JSON.stringify(include);
	const exclude_terms = JSON.stringify(exclude);

	pool.query(
		`INSERT INTO searches (user_id, include_terms, exclude_terms) VALUES ($1, $2, $3)`,
		[user_id, include_terms, exclude_terms],
		(err, result) => {
			if (err) {
				logger.error(err);
				return res.status(500).json({ error: "Error saving search" });
			} else {
				pool.query(
					`SELECT 
					u.id AS user_id, 
					u.first_name, 
					u.last_name, 
					u.email, 
					u.is_admin,
					u.password, 
					s.id AS search_id,
					s.include_terms, 
					s.exclude_terms
					FROM users u 
					LEFT JOIN searches s 
					ON u.id = s.user_id 
					WHERE u.id = $1 
					AND s.deleted_at IS NULL;`,
					[userId],
					(selectError, selectResult) => {
						if (selectError) {
							logger.error(selectError);
							return res
								.status(500)
								.json({ error: "Error getting updated user searches" });
						}

						if (selectResult.rows.length === 0) {
							return res.status(400).json({ error: "User not found" });
						}

						const user = selectResult.rows[0];

						const searches = selectResult.rows.map((row) => {
							return {
								id: row.search_id,
								include: JSON.parse(row.include_terms),
								exclude: JSON.parse(row.exclude_terms),
							};
						});

						const returnUserObj = {
							id: user.user_id,
							first_name: user.first_name,
							last_name: user.last_name,
							email: user.email,
							isAdmin: user.is_admin,
							searches,
						};

						return res.status(200).json({ user: returnUserObj });
					}
				);
			}
		}
	);
};

// soft deletes a search from the database
export const postCancelSearch = async (req, res) => {
	const { userId, searchId } = req.body;

	if (!userId || !searchId) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	pool.query(
		`UPDATE searches SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`,
		[searchId],
		(err, result) => {
			if (err) {
				logger.error(err);
				return res.status(500).json({ error: "Error deleting search" });
			} else {
				pool.query(
					`SELECT 
					u.id AS user_id, 
					u.first_name, 
					u.last_name, 
					u.email, 
					u.password,
					u.is_admin,
					s.id AS search_id,
					s.include_terms, 
					s.exclude_terms
					FROM users u 
					LEFT JOIN searches s 
					ON u.id = s.user_id 
					WHERE u.id = $1 
					AND s.deleted_at IS NULL;`,
					[userId],
					(selectError, selectResult) => {
						if (selectError) {
							logger.error(selectError);
							return res
								.status(500)
								.json({ error: "Error getting updated user searches" });
						}

						if (selectResult.rows.length === 0) {
							return res.status(400).json({ error: "Search not found" });
						}

						const user = selectResult.rows[0];

						const searches = selectResult.rows.map((row) => {
							return {
								id: row.search_id,
								include: JSON.parse(row.include_terms),
								exclude: JSON.parse(row.exclude_terms),
							};
						});

						const returnUserObj = {
							id: user.user_id,
							first_name: user.first_name,
							last_name: user.last_name,
							email: user.email,
							isAdmin: user.is_admin,
							searches,
						};

						return res.status(200).json({ user: returnUserObj });
					}
				);
			}
		}
	);
};
