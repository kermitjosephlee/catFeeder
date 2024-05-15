import "dotenv/config";
import pg from "pg";
import { ingredientsQueryBuilder } from "./queryHelpers/ingredients.js";
// const pgCredentials = process.env.DB_CREDENTIALS;

const pool = new pg.Pool({
  user: "postgres",
  password: "password",
  host: "db",
  port: 5432,
  database: "catFeeder"
});

await pool.connect();

export const getProducts = async (_, res) => {
  console.log("GET products")
  const response = await pool.query("SELECT * FROM products;");
  return res.json(response.rows);
};

export const getProductsByBrand = async (req, res) => {
  const brand = req.params.brand || "acana";
  const response = await pool.query(
    `SELECT * FROM products WHERE brand = $1;`,
    [brand],
  );
  return res.json(response.rows);
};

export const getProductsByIngredients = async (req, res) => {
  const includeIngredients = req.query.include
    ? req.query.include.split(",")
    : [];
  const excludeIngredients = req.query.exclude
    ? req.query.exclude.split(",")
    : [];
  const ingredientsQuery = ingredientsQueryBuilder({
    includeIngredients,
    excludeIngredients,
  });

  console.log({ ingredientsQuery });

  const response = await pool.query(ingredientsQuery);
  return res.json(response.rows);
};

export const getStatus = async (req, res) => {
  const response = await pool.query(`SELECT NOW();`);
  return res.json(response.rows);
}

// const res = await pool.query(`SELECT * FROM ingredients LIMIT 10;`);

// pool.end();
