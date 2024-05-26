import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import bodyParser from "body-parser";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import connectPgSimple from "connect-pg-simple";
import cors from "cors";
import * as EmailValidator from "email-validator";
import passwordValidator from "password-validator";
import { logger } from "../utils/logger.js";
import { morganMiddleware } from "../middlewares/morgan.middlewares.js";

import {
	getProducts,
	getProductsByBrand,
	getProductsByIngredients,
	getStatus,
} from "../db/queries.js";

const pool = new Pool({
	user: "postgres",
	password: "password",
	host: "0.0.0.0",
	port: 5432,
	database: "catFeeder",
});

const pgSession = connectPgSimple(session);

const PORT = process.env.PORT || 3000;

const SALT_ROUNDS = process.env.SALT_ROUNDS || 12;

const app = express();

const passwordSchema = passwordValidator();

passwordSchema
	.is()
	.min(8)
	.is()
	.max(100)
	.has()
	.uppercase()
	.has()
	.lowercase()
	.has()
	.digits()
	.has()
	.not()
	.spaces();

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

function validatePassword(user, password) {
	return bcrypt.compareSync(password, user.password);
}

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
		`SELECT id, first_name, last_name, email FROM users WHERE email = $1`,
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

app.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/login",
	})
);

app.get("/logout", function (req, res) {
	req.logout();
	res.redirect("/");
});

app.post("/register", (req, res) => {
	const { first_name, last_name, email, password } = req.body;

	// validate required fields
	if (!first_name || !last_name || !email || !password) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	// validate email string is an email
	if (!EmailValidator.validate(email)) {
		return res.status(400).json({ error: "Invalid email" });
	}

	// validate password as defined by password schema
	if (!passwordSchema.validate(password)) {
		return res.status(400).json({ error: "Invalid password" });
	}

	const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);

	// first check to see if user already exists
	pool.query(
		`SELECT id FROM users WHERE email = $1`,
		[email],
		(err, result) => {
			// if error return error
			if (err) {
				logger.error(err);
				return res.status(500).json({ error: "Error registering user" });
			}

			// if user already exists return error
			if (result.rows.length > 0) {
				return res.status(400).json({ error: "User already exists" });
			}

			// if user does not exist, insert user into database
			if (result.rows.length == 0) {
				pool.query(
					`INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)`,
					[first_name, last_name, email, hashedPassword],
					(err, res) => {
						if (err) {
							logger.error(err);
							return res.status(500).json({ error: "Error registering user" });
						}
						return res.json({ message: "User registered successfully" });
					}
				);
			}
		}
	);
});

app.get("/", (req, res) => {
	console.log({ req });
	res.json({ info: "Node.js, Express, and Postgres API" });
});

app.get("/status", getStatus);

app.get("/products", getProducts);

app.get("/brand/:brand", getProductsByBrand);

app.get("/ingredients", getProductsByIngredients);

app.listen(PORT, (err) => {
	err ? logger.error(err) : logger.info(`Server is running on port ${PORT}`);
});
