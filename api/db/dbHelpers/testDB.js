import "dotenv/config";
import pg from "pg";

const connectionString = encodeURI(process.env.PG_CREDENTIALS);
const SSL_CERT = process.env.SSL_CERT;

const pool = new pg.Pool({
	connectionString,
	ssl: false,
});

await pool.connect();

const res = await pool.query(`SELECT * FROM ingredients LIMIT 10;`);
console.log(res.rows);
pool.end();
