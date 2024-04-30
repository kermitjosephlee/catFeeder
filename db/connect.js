import { pgCredentials } from "../index.js";
import pg from "pg";

const client = new pg.Client({
  connectionString: pgCredentials,
});
await client.connect();

const res = await client.query(`SELECT CURRENT_DATE;`);
console.log(res.rows);
client.end();
