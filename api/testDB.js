import "dotenv/config";
import pg from "pg";

export const pgCredentials = process.env.DB_CREDENTIALS;

console.log(pgCredentials);

const pool = new pg.Pool({
  user: "postgres",
  password: "password",
  host: "0.0.0.0",
  port: 5432,
});

await pool.connect();

const res = await pool.query(`SELECT * FROM ingredients LIMIT 10;`);
console.log(res.rows);
pool.end();
