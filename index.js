import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import {
  getProducts,
  getProductsByBrand,
  getProductsByIngredients,
} from "./db/queries.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.get("/", (req, res) => {
  console.log({ req });
  res.json({ info: "Node.js, Express, and Postgres API" });
});

app.get("/products", getProducts);

app.get("/brand/:brand", getProductsByBrand);

app.get("/products/ingredients", getProductsByIngredients);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
