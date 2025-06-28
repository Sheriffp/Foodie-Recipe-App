import mysql from "mysql2/promise";
import "dotenv/config";

export const db = mysql.createPool({
	host: process.env.DB_HOST,
	database: process.env.DB,
	user: process.env.DB_USER,
	password: process.env.DB_PASS
});

export const initDb = async () => {
	try {
		await db.query(
			"create table if not exists foods (id serial primary key, user_id varchar(255) not null, recipe_id int not null, title varchar(255) not null, image varchar(255), cook_time varchar(255), servings varchar(255), created_at date default current_date)"
		);

		await db.query(
			"create table if not exists users (id serial primary key, email varchar(255) not null, password varchar(255) not null)"
		);

		console.log("Database initialized successfully!");
	} catch (error) {
		console.error("Error initilizing database", error);
	}
};
