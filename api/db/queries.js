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

export const postSearch = async (req, res) => {
	const { include, exclude, userId } = req.body;

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
			}
			return res.json({
				message: "Search saved successfully",
			});
		}
	);
};
