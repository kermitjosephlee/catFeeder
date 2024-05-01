import "dotenv/config";
import pg from "pg";
import fs from "node:fs";

export const baseSchemaString = fs.readFileSync("./db/schema.sql").toString();
export const pgCredentials = process.env.DB_CREDENTIALS;

const pool = new pg.Pool({
  connectionString: pgCredentials,
});
await pool.connect();

const res = await pool.query(baseSchemaString);
console.log(res);
pool.end();
