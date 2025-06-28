import { Stack, Redirect } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";


export default function AuthLayout() {
	const { checkAuth, token, isCheckingAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, []);

	if (isCheckingAuth) {
		return;
	}

	const isSignedIn = !!token;
	if (isSignedIn) {
		return <Redirect href='/' />;
	}

	return <Stack screenOptions={{ headerShown: false }} />;
}
