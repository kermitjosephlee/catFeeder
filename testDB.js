import "dotenv/config";
import pg from "pg";

export const pgCredentials = process.env.DB_CREDENTIALS;

const pool = new pg.Pool({
  connectionString: pgCredentials,
});
await pool.connect();

const res = await pool.query(`SELECT * FROM products LIMIT 10;`);
console.log(res);
pool.end();
