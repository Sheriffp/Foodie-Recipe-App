import {Redirect, Tabs } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

export default function TabLayout() {
	const { checkAuth, token, isCheckingAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, []);

	if (isCheckingAuth) {
		return null;
	}

	const isSignedIn = !!token;
	if (!isSignedIn) {
		return <Redirect href='/(auth)/signin' />;
	}

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: COLORS.primary,
				tabBarInactiveTintColor: COLORS.textLight,
				tabBarStyle: {
					backgroundColor: COLORS.background,
					borderTopColor: COLORS.border,
					borderTopWidth: 1,
					paddingBottom: 8,
					paddingTop: 8,
					height: 80
				},
				tabBarLabelStyle: { fontSize: 12, fontWeight: "600" }
			}}
		>
			<Tabs.Screen
				name='index'
				options={{
					title: "Recipes",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='restaurant' size={size} color={color} />
					)
				}}
			/>
			<Tabs.Screen
				name='search'
				options={{
					title: "Search",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='search' size={size} color={color} />
					)
				}}
			/>
			<Tabs.Screen
				name='favorites'
				options={{
					title: "Favorites",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='heart' size={size} color={color} />
					)
				}}
			/>
		</Tabs>
	);
}
