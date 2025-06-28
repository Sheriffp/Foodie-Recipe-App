import jwt from "jsonwebtoken";
import "dotenv/config";

const protectRoute = async (req, res, next) => {
	const { token } = req.headers;
	

	if (!token) {
		return res.status(400).json({
			success: false,
			message: "Not authenticated! kindly login"
		});
	}

	try {
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		//making sure req.body is not undefined
		req.body = req.body || {};

		req.body.userId = decodedToken.id;

		next();
	} catch (error) {
		console.error("Error verifying token", error);
		res.status(500).json({
			success: false,
			message: "Internal server error"
		});
	}
};

export default protectRoute;
