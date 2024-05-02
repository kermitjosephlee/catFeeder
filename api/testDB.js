import "dotenv/config";
import pg from "pg";

export const pgCredentials = process.env.DB_CREDENTIALS;

console.log(pgCredentials);

const pool = new pg.Pool({
  connectionString: pgCredentials,
});
await pool.connect();

const res = await pool.query(`SELECT * FROM ingredients LIMIT 10;`);
console.log(res.rows);
pool.end();
