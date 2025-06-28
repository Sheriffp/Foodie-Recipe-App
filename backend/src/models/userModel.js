import { db } from "../config/initDb.js";

export const createUser = async (email, password) => {
	try {
		return await db.query(
			"insert into users (email, password) values (?,?) returning * exclude(password)",
			[email, password]
		);
	} catch (error) {
		console.error("Failed to create user", error);
	}
};

export const loginUser = async email => {
	try {
		return await db.query("select * from users where email = ?", [email]);
	} catch (error) {
		console.error("Failed to login user", error);
	}
};

export const existingUser = async (email) => {
	try {
		return await db.query("select * from users where email = ?", [email]);
	} catch (error) {
		console.error("Failed to fetch user", error);
	}
};
