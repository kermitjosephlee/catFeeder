import "dotenv/config";
import pg from "pg";
import fs from "node:fs";

export const baseSchemaString = fs.readFileSync("./db/schema.sql").toString();
// export const pgCredentials = process.env.DB_CREDENTIALS;
const pool = new pg.Pool({
  user: "postgres",
  password: "password",
  host: "0.0.0.0",
  port: 5432,
});
await pool.connect();

const res = await pool.query(baseSchemaString);
console.log(res);
pool.end();
