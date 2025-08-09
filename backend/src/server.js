import express from "express";
import path from "path";
import "dotenv/config";
import { initDb } from "./config/initDb.js";
import cors from "cors";
import foodRoutes from "./routes/foodRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import protectRoute from "./middlewares/protectRoute.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/foodie/api/health", (req, res) => {
	res.status(200).json({ success: true, message: "server health is ok!" });
});

app.use("/foodie/api/auth", authRoutes);
app.use("/foodie/api/food", protectRoute, foodRoutes);

initDb().then(() => {
	app.listen(PORT, () => {
		console.log("Server is running on port", PORT);
	});
});
