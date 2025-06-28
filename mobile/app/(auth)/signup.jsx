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

const SignUpScreen = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const { register } = useAuthStore();
	const router = useRouter();

	const handleSignup = async () => {
		try {
			setLoading(true);
			const result = await register(email, password);
			if (!result.success) {
				return Alert.alert("Error", result.error);
			}
			Alert.alert(
				"Success!",
				"Your sign up was successful, sign in now to continue"
			);
			router.push("/signin");
		} catch (error) {
			console.error("Failed to signup", error);
			Alert.alert("Error", "Failed to sign up, Please retry");
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
							source={require("@/assets/images/2.png")}
							style={authStyles.image}
							contentFit='contain'
						/>
					</View>
					<Text style={authStyles.title}>Create Account</Text>
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
							onPress={handleSignup}
							disabled={loading}
							activeOpacity={0.8}
						>
							<Text style={authStyles.buttonText}>
								{loading ? "Creating Account..." : "Sign Up"}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={authStyles.linkContainer}
							onPress={() => router.back()}
						>
							<Text style={authStyles.linkText}>
								Already have an account?{" "}
								<Text style={authStyles.link}>Sign In</Text>
							</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
};

export default SignUpScreen;
