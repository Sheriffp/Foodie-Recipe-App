import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/constants/api";

export const useAuthStore = create(set => ({
	user: null,
	token: null,
	isLoading: false,
	isCheckingAuth: true,

	register: async (email, password) => {
		set({ isLoading: true });
		try {
			const response = await fetch(`${API_URL}/auth/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password })
			});

			const data = await response.json();

			if (!response.ok)
				throw new Error(data.message || "Something went wrong");

			set({ isLoading: false });
			return { success: true };
		} catch (error) {
			set({ isLoading: false });
			return { success: false, error: error.message };
		}
	},

	login: async (email, password) => {
		set({ isLoading: true });
		try {
			const response = await fetch(`${API_URL}/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password })
			});

			const data = await response.json();

			if (!response.ok)
				throw new Error(data.message || "Something went wrong");

			await AsyncStorage.setItem("token", data.token);
			await AsyncStorage.setItem("user", JSON.stringify(data.user[0]));

			
			set({ token: data.token, user: data.user[0], isLoading: false });
			return { success: true };
		} catch (error) {
			set({ isLoading: false });
			return { success: false, error: error.message };
		}
	},

	checkAuth: async () => {
		try {
			const token = await AsyncStorage.getItem("token");
			const userJson = await AsyncStorage.getItem("user");
			const user = userJson ? JSON.parse(userJson) : null;

			set({ token, user });
		} catch (error) {
			console.error("AuthCheck failed:", error.message);
		} finally {
			set({ isCheckingAuth: false });
		}
	},

	logout: async () => {
		await AsyncStorage.removeItem("user");
		await AsyncStorage.removeItem("token");
		set({ token: null, user: null });
	}
}));
