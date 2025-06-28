import {
	createFood,
	fetchFood,
	removeFood,
	fetchFoodById
} from "../models/foodModel.js";

export const addFood = async (req, res) => {
	try {
		const { userId, recipeId, title, image, cookTime, servings } = req.body;
		
		console.log(req.body)

		if (!userId || !recipeId || !title) {
			return res.status(200).json({
				success: false,
				message: "Some required fields are missing"
			});
		}

		const [food] = await createFood(
			userId,
			recipeId,
			title,
			image,
			cookTime,
			servings
		);

		res.status(201).json({
			success: true,
			message: "Food added successfully",
			food
		});
	} catch (error) {
		console.error("Error adding food to favorite", error);
		res.status(200).json({
			success: false,
			error: "Internal server error"
		});
	}
};

export const getFood = async (req, res) => {
	try {
		const { userId } = req.body;

		const [food] = await fetchFood(userId);

		if (!food || food.length === 0) {
			return res.status(200).json({
				success: false,
				message: "You do not have any saved food"
			});
		}

		res.status(200).json({ success: true, food });
	} catch (error) {
		console.error("Error fetching food", error);
		res.status(200).json({
			success: false,
			error: "Internal server error!"
		});
	}
};

export const deleteFood = async (req, res) => {
	try {
		const { userId } = req.body;
		const { recipeId } = req.params;

		const [food] = await fetchFoodById(userId, recipeId);

		if (!food || food.length === 0) {
			return res.status(400).json({
				success: false,
				message: "This food either does not exist or has been removed"
			});
		}
		await removeFood(userId, recipeId);

		res.status(200).json({
			success: true,
			message: "Food removed successfully"
		});
	} catch (error) {
		console.error("Error removing food", error);
		res.json({ success: false, error: "Something went wrong" });
	}
};

export const getFoodById = async (req, res) => {
	try {
		const { userId } = req.body;
		const { recipeId } = req.params;

		const [food] = await fetchFoodById(userId, recipeId);

		if (!food || food.length === 0) {
			return res.status(400).json({
				success: false,
				message: "This recipe is not in your favorites"
			});
		}
		res.status(200).json({
			success: true,
			message: "This recipe is the your favorites"
		});
	} catch (error) {
		console.error("Error getting food by id", error);
		res.json({ success: false, error: "Something went wrong" });
	}
};
