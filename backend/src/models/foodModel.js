import { db } from "../config/initDb.js";

export const createFood = async (
	userId,
	recipeId,
	title,
	image,
	cookTime,
	servings
) => {
	return await db.query(
		"insert into foods (user_id, recipe_id, title, image, cook_time, servings) values (?,?,?,?,?,?) returning *",
		[userId, recipeId, title, image, cookTime, servings]
	);
};

export const fetchFood = async userId => {
	return await db.query("select * from foods where user_id = ? order by id desc", [
		userId
	]);
};

export const fetchFoodById = async (userId, recipeId) => {
	return await db.query(
		"select * from foods where user_id = ? and recipe_id = ?",
		[userId, recipeId]
	);
};

export const removeFood = async (userId, recipeId) => {
	return await db.query(
		"delete from foods where user_id = ? and recipe_id = ?",
		[userId, recipeId]
	);
};
