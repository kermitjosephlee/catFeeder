import "dotenv/config";
import pg from "pg";
import fs from "node:fs";

export const baseSchemaString = fs.readFileSync("./db/schema.sql").toString();

const connectionString = encodeURI(process.env.PG_CREDENTIALS);
const SSL_CERT = process.env.SSL_CERT;

const pool = new pg.Pool({
	connectionString,
	ssl: false,
});
await pool.connect();

const res = await pool.query(baseSchemaString);
console.log(res);
pool.end();
