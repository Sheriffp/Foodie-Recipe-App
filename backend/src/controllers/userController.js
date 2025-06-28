import bcrypt from "bcryptjs";
import { createUser, loginUser, existingUser } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const createToken = id => {
	return jwt.sign({ id }, process.env.JWT_SECRET);
};

export const register = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "All fields are required"
			});
		}

		if (!email.includes("@")) {
			return res.status(400).json({
				success: false,
				message: "Enter a valid email address"
			});
		}

		if (password.trim().length < 7) {
			return res.status(400).json({
				success: false,
				message: "Password should be at least 8 characters in length"
			});
		}

		const [userExist] = await existingUser(email);

		if (userExist[0]) {
			return res
				.status(400)
				.json({ success: false, message: "User already exist" });
		}

		const salt = await bcrypt.genSalt(10);

		const hashedPassword = await bcrypt.hash(password, salt);

		const [newUser] = await createUser(email, hashedPassword);

		if (!newUser) {
			return res.status(400).json({
				success: false,
				message: "Error creating account"
			});
		}

		res.status(201).json({
			success: true,
			message: "Account created successfully, login to continue"
		});
	} catch (error) {
		console.error("Error creating", error);
		res.status(500).json({
			success: false,
			message: "Internal server error"
		});
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "All fields are required"
			});
		}
		if (!email.includes("@")) {
			return res.status(400).json({
				success: false,
				message: "Enter a valid email address"
			});
		}

		if (password.trim().length < 7) {
			return res.status(400).json({
				success: false,
				message: "Password should be at least 8 characters in length"
			});
		}

		const [user] = await loginUser(email);

		if (!user || user.length === 0) {
			return res.status(400).json({
				success: false,
				message: "User does not exist!"
			});
		}

		const passwordCheck = await bcrypt.compare(password, user[0].password);

		if (!passwordCheck) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid credentials" });
		}

		const token = createToken(user[0].id);

		res.status(200).json({
			success: true,
			token: token,
			user:user,
			message: "Login successful"
		});
	} catch (error) {
		console.error("Error logging user in", error);
		res.status(500).json({
			success: false,
			message: "Internal server error"
		});
	}
};
