import {
	View,
	Text,
	Alert,
	Platform,
	ScrollView,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { authStyles } from "@/assets/styles/auth.styles";
import { COLORS } from "@/constants/colors";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

const SignInScreen = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const { login, token, isCheckingAuth } = useAuthStore();
	const router = useRouter();

	const handleSignin = async () => {
		try {
			setLoading(true);
			const result = await login(email, password);

			if (!result.success) {
				return Alert.alert("Error", result.error);
			}

			Alert.alert("Success!", "Your sign in was successful");

			if (isCheckingAuth) return null;
		} catch (error) {
			Alert.alert("Error", "Failed to sign in, kindly retry");
			console.error("Failed to sign in", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={authStyles.container}>
			<KeyboardAvoidingView
				style={authStyles.keyboardView}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
			>
				<ScrollView
					contentContainerStyle={authStyles.scrollContent}
					showVerticalScrollIndicator={false}
				>
					<View style={authStyles.imageContainer}>
						<Image
							source={require("@/assets/images/1.png")}
							style={authStyles.image}
							contentFit='contain'
						/>
					</View>
					<Text style={authStyles.title}>Welcome Back</Text>
					<View style={authStyles.formContainer}>
						<View style={authStyles.inputContainer}>
							<TextInput
								style={authStyles.textInput}
								placeholder='Enter email'
								placeholderTextColor={COLORS.textLight}
								value={email}
								onChangeText={setEmail}
								keyboardType='email-address'
								autoCapitalize='none'
							/>
						</View>
						<View style={authStyles.inputContainer}>
							<TextInput
								style={authStyles.textInput}
								placeholder='Enter password'
								placeholderTextColor={COLORS.textLight}
								value={password}
								onChangeText={setPassword}
								secureTextEntry={!showPassword}
								autoCapitalize='none'
							/>
							<TouchableOpacity
								style={authStyles.eyeButton}
								onPress={() => setShowPassword(!showPassword)}
							>
								<Ionicons
									name={
										showPassword
											? "eye-outline"
											: "eye-off-outline"
									}
									size={20}
									color={COLORS.textLight}
								/>
							</TouchableOpacity>
						</View>
						<TouchableOpacity
							style={[
								authStyles.authButton,
								loading && authStyles.buttonDisabled
							]}
							onPress={handleSignin}
							disabled={loading}
							activeOpacity={0.8}
						>
							<Text style={authStyles.buttonText}>
								{loading ? "Signing In..." : "Sign In"}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={authStyles.linkContainer}
							onPress={() => router.push("/(auth)/signup")}
						>
							<Text style={authStyles.linkText}>
								Don&apos;t have an account?{" "}
								<Text style={authStyles.link}>Sign Up</Text>
							</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
};

export default SignInScreen;
