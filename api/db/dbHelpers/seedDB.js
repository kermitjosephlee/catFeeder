import "dotenv/config";
import querystring from "node:querystring";
import axios from "axios";
import * as cheerio from "cheerio";
import delay from "delay";
import pg from "pg";

const connectionString = encodeURI(process.env.PG_CREDENTIALS);

const SSL_CERT = process.env.SSL_CERT;

const pool = new pg.Pool({
	connectionString,
	ssl: false,
});
await pool.connect();

const REQUEST_DELAY = 50;

const skipProducts = [
	"product/fancy feast/Medleys+White+Meat+Chicken+Florentine+Pate%CC%81+With+Cheese+%26+Spinach",
	"product/firstmate/Cage+Free+Chicken+%26+Wild+Tuna+50%2F50+Formula",
];

const config = {
	headers: {
		"User-Agent":
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
	},
};

async function executeProductPromises(hrefs) {
	let results = [];
	for (const href of hrefs) {
		await delay(REQUEST_DELAY);
		const response = await axios.get(href);
		const $ = cheerio.load(response.data);
		const $productHref = $(".col-sm-12 > a")
			.map((i, el) => {
				return $(el).attr("href");
			})
			.get();

		const filteredResults = $productHref.filter((each) => {
			return !skipProducts.includes(each);
		});
		results = [...results, filteredResults];
	}
	return results;
}

async function executeProductDetailPages(hrefs) {
	for (const href of hrefs) {
		const pathname = new URL(href).pathname;

		const brand = querystring
			.unescape(pathname.split("/")[2])
			.replaceAll("+", " ");
		const productName = querystring
			.unescape(pathname.split("/")[3])
			.replaceAll("+", " ");

		await delay(REQUEST_DELAY);
		try {
			const response = await axios.get(href);

			const $ = cheerio.load(response.data);
			const productImage = $(".col-sm-4 .thumbnail").attr("src");
			const chewyLink = $(".col-sm-4 > a.amazon-product").attr("href")
				? $(".col-sm-4 > a.amazon-product").attr("href").replace("pn?url=", "")
				: "";

			const ingredientsTitle = $('h3:contains("Ingredients")');
			const ingredientsList = ingredientsTitle.next().next().text();

			const queryText = `INSERT INTO products(brand, name, image_url, link_url, ingredients) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
			const queryValues = [
				brand,
				productName,
				productImage,
				chewyLink,
				ingredientsList,
			];

			const res = await pool.query(queryText, queryValues);
			console.log(res.rows[0]);
		} catch (error) {
			if (error.response && error.response.status === 404) {
				continue;
			} else {
				console.log("ERRORZ:", error);
			}
		}
	}
}

axios
	.get("https://catfooddb.com", config)
	.then((response) => {
		const $ = cheerio.load(response.data);
		const $catFood = $(
			".navbar > .container-fluid > .navbar-collapse > .navbar-nav > li > .dropdown-menu > .dropdown-submenu > .dropdown-menu > li > a"
		);
		const $catFoodHrefs = $catFood
			.map((i, el) => {
				return $(el).attr("href");
			})
			.get();

		const catFoodHrefs = $catFoodHrefs.map((each) => {
			return `https://catfooddb.com/${each}`;
		});

		return catFoodHrefs;
	})
	.then(async (catFoodHrefs) => {
		const allResults = await executeProductPromises(catFoodHrefs);
		return allResults;
	})
	.then(async (allResults) => {
		const updatedURLs = allResults.flat().map((each) => {
			return `https://catfooddb.com/${each}`;
		});
		await executeProductDetailPages(updatedURLs);
	})
	.then(() => pool.end())
	.catch((error) => console.log("ERR:", error));
