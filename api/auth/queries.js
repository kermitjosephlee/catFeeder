import "dotenv/config";
import pg from "pg";
import * as EmailValidator from "email-validator";
import bcrypt from "bcryptjs";
import { logger } from "../utils/logger.js";
import {
	// USER_SUB_QUERY,
	USER_SUB_QUERY_BY_EMAIL,
	userReturnObjMaker,
} from "../helpers/getUser/getUser.js";

const SALT_ROUNDS = process.env.SALT_ROUNDS || 12;

const pool = new pg.Pool({
	user: "postgres",
	password: "password",
	host: "0.0.0.0",
	port: 5432,
	database: "catFeeder",
});

await pool.connect();

export const postLogin = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	pool.query(USER_SUB_QUERY_BY_EMAIL, [email], (error, result) => {
		if (error) {
			logger.error(error);
			return res.status(500).json({ error: "Error logging in - 001" });
		}

		// getting an error for queries for users with no searches - this query will return with no rows
		// TODO: need to fix for users with no searches
		if (result.rows.length === 0) {
			return res.status(400).json({ error: "User not found" });
		}

		const user = result.rows[0];

		if (!bcrypt.compareSync(password, user.password)) {
			return res.status(400).json({ error: "Invalid password" });
		}

		const returnUserObj = userReturnObjMaker(result);

		req.login(user, (err) => {
			if (err) {
				logger.error(err);
				return res.status(500).json({ error: "Error logging in - 002" });
			}

			console.log("session details", req.session);

			return res.status(200).json({ user: returnUserObj });
		});
	});
};

export const postLogout = async (req, res) => {
	req.session.destroy(function (err) {
		if (err) {
			logger.error(err);
			console.log("logout error", { err });
			return res.status(500).json({ error: "Error logging out" });
		} else {
			res.status(200).json({ message: "User logged out" });
		}
	});
};

export const postRegister = async (req, res) => {
	const { firstName, lastName, email, password } = req.body;

	// validate required fields
	if (!firstName || !lastName || !email || !password) {
		console.log("Missing required fields");
		return res.status(400).json({ error: "Missing required fields" });
	}

	// validate email string is an email
	if (!EmailValidator.validate(email)) {
		console.log("Invalid email");
		return res.status(400).json({ error: "Invalid email" });
	}

	// validate password as defined by password schema
	if (!passwordSchema.validate(password)) {
		console.log("Invalid password");
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
				const first_name = firstName;
				const last_name = lastName;

				pool.query(
					`INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)`,
					[first_name, last_name, email, hashedPassword],
					(err, insertResponse) => {
						if (err) {
							logger.error(err);
							return res.status(500).json({ error: "Error registering user" });
						}
						return res.json({
							message: "User registered successfully",
						});
					}
				);
			}
		}
	);
};
