import "dotenv/config";
import pg from "pg";
import * as EmailValidator from "email-validator";
import passwordValidator from "password-validator";
import bcrypt from "bcryptjs";
import { logger } from "../utils/logger.js";
import {
	userReturnObjMaker,
	getUserSearches,
	getUserByEmail,
} from "../helpers/getUser/getUser.js";

const SALT_ROUNDS = process.env.SALT_ROUNDS || 12;

const connectionString = encodeURI(process.env.PG_CREDENTIALS);
const SSL_CERT = process.env.SSL_CERT;

const pool = new pg.Pool({
	connectionString,
	ssl: false,
});

await pool.connect();

const passwordSchema = new passwordValidator();
passwordSchema.is().min(8);

export const postLogin = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	const user = await getUserByEmail(email);

	if (!user) {
		return res.status(400).json({ error: "User not found" });
	}

	if (!bcrypt.compareSync(password, user.password)) {
		return res.status(400).json({ error: "Invalid password" });
	}

	const searches = await getUserSearches(user.id);

	const returnUserObj = userReturnObjMaker({ user, searches });

	req.login(user, (err) => {
		if (err) {
			logger.error(err);
			return res.status(500).json({ error: "Error logging in - 003" });
		}

		return res.status(200).json({ user: returnUserObj });
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
	const user = await getUserByEmail(email);

	if (user) {
		return res.status(400).json({ error: "User already exists" });
	} else {
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
				return res.status(200).json({
					message: "User registered successfully",
				});
			}
		);
	}
};
