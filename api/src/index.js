import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import bodyParser from "body-parser";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import pg from "pg";
import connectPgSimple from "connect-pg-simple";
import cors from "cors";
import passwordValidator from "password-validator";
import { logger } from "../utils/logger.js";
import { morganMiddleware } from "../middlewares/morgan.middlewares.js";

import {
	getProductCount,
	getProducts,
	// getProductsByIngredients,
	getStatus,
	postCancelSearch,
	postSearch,
} from "../db/queries.js";

import { postLogin, postLogout, postRegister } from "../auth/queries.js";

const pool = new pg.Pool({
	user: "postgres",
	password: "password",
	host: "0.0.0.0",
	port: 5432,
	database: "catFeeder",
});

const pgSession = connectPgSimple(session);

const PORT = process.env.PORT || 3000;

const app = express();

const passwordSchema = new passwordValidator();

passwordSchema.is().min(8);
// .is()
// .max(100)
// .has()
// .uppercase()
// .has()
// .lowercase()
// .has()
// .digits()
// .has()
// .not()
// .spaces();

app.use(cors());

app.use(morganMiddleware);

app.use(bodyParser.json());

app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

app.use(
	session({
		store: new pgSession({
			pool,
		}),
		secret: "cats",
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
	})
);

app.use(passport.initialize());

app.use(passport.session());

passport.use(
	new LocalStrategy(function (email, password, done) {
		pool.query(
			`SELECT id, first_name, last_name, email, password FROM users WHERE email = $1`,
			[email],
			function (err, result) {
				// if error return error
				if (err) return done(err);

				// if no user found return false
				if (!result.rows.length) return done(null, false);

				// if user found, compare password
				if (result.rows.length > 0) {
					const user = result.rows[0];

					// if password does not match return false
					if (!bcrypt.compareSync(password, user.password)) {
						return done(null, false);
					}

					// if password matches return user
					return done(null, user);
				}
			}
		);
	})
);

passport.serializeUser(function (user, done) {
	done(null, user.email);
});

passport.deserializeUser(function (email, done) {
	pool.query(
		`SELECT id, first_name, last_name, email FROM users WHERE email = $1;`,
		[email],
		function (err, result) {
			if (err) return done(err);
			if (result.rows.length > 0) {
				const user = result.rows[0];
				return done(null, user);
			}
			return done(null, false);
		}
	);
});

// ------ ROUTES ------

app.post("/login", postLogin);

app.post("/logout", postLogout);

app.post("/register", postRegister);

app.post("/search", postSearch);

app.post("/cancel_search", postCancelSearch);

app.get("/", (_, res) => {
	res.json({ info: "Node.js, Express, and Postgres API" });
});

app.get("/status", getStatus);

app.get("/products", getProducts);

app.get("/product_count", getProductCount);

// app.get("/ingredients", getProductsByIngredients);

app.listen(PORT, (err) => {
	err ? logger.error(err) : logger.info(`Server is running on port ${PORT}`);
});
