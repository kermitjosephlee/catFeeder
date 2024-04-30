import "dotenv/config";
import axios from "axios";
import * as cheerio from "cheerio";
import delay from "delay";

export const pgCredentials = process.env.DB_CREDENTIALS;
const REQUEST_DELAY = 150;

const config = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
  },
};

async function executeProductPromises(hrefs) {
  let results = [];
  for (const href of hrefs) {
    await delay(100);
    const response = await axios.get(href);
    const $ = cheerio.load(response.data);
    const $productHref = $(".col-sm-12 > a")
      .map((i, el) => {
        return $(el).attr("href");
      })
      .get();
    results = [...results, $productHref];
  }
  return results;
}

async function executeProductDetailPages(hrefs) {
  let results = [];

  console.log("hrefs: ", hrefs)
  for (const href of hrefs) {
    await delay(REQUEST_DELAY);
    const response = await axios.get(href);
    const $ = cheerio.load(response.data);
    const title = $("h1").text();
    // const ingredients = $()
    console.log("product title: ", title);
    results = [...results, $];
  }
  return results;
}

axios
  .get("https://catfooddb.com", config)
  .then((response) => {
    // console.log(response.data);
    const $ = cheerio.load(response.data);
    const $catFood = $(
      ".navbar > .container-fluid > .navbar-collapse > .navbar-nav > li > .dropdown-menu > .dropdown-submenu > .dropdown-menu > li > a",
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
    const results = await executeProductDetailPages(updatedURLs);
    return results;
  })
  .catch((error) => console.log("ERR:", error));
