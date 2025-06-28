import {
	View,
	Text,
	TouchableOpacity,
	FlatList,
	Alert,
	ScrollView
} from "react-native";
import { useState, useEffect } from "react";
import { recipeDetailStyles } from "@/assets/styles/recipe-details.styles";
import { COLORS } from "@/constants/colors";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/authStore";
import { API_URL } from "@/constants/api";
import RecipeCard from "@/components/RecipeCard";
import Loader from "@/components/Loader";
import { useLocalSearchParams } from "expo-router";
import { MealAPI } from "@/services/mealAPI";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { WebView } from "react-native-webview";

const RecipeDetailScreen = () => {
	const router = useRouter();
	const { id: recipeId } = useLocalSearchParams();
	const { token } = useAuthStore();
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(true);
	const [recipe, setRecipe] = useState(null);
	const [isSaved, setIsSaved] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		const checkIfSaved = async () => {
			try {
				const response = await fetch(`${API_URL}/food/${recipeId}`, {
					headers: { token }
				});
				const food = await response.json();
				const isRecipeSaved = food.success;

				setIsSaved(isRecipeSaved);
			} catch (error) {
				console.error("Error checking if recipe is saved", error);
			}
		};

		const loadRecipeDetail = async () => {
			setLoading(true);
			try {
				const mealData = await MealAPI.getMealById(recipeId);

				const transformedRecipe = MealAPI.transformMealData(mealData);
				const recipeWithVideo = {
					...transformedRecipe,
					youtubeUrl: mealData.strYoutube || null
				};
				setRecipe(recipeWithVideo);
			} catch (error) {
				console.error("Error loading recipe detail", error);
			} finally {
				setLoading(false);
			}
		};

		checkIfSaved();
		loadRecipeDetail();
	}, [recipeId, token]);

	const getYoutubeEmbedUrl = url => {
		const videoId = url.split("v=")[1];
		return `https://www.youtube.com/embed/${videoId}`;
	};

	const handleToggleSave = async () => {
		setIsSaving(true);
		try {
			if (isSaved) {
				const response = await fetch(`${API_URL}/food/${recipeId}`, {
					method: "DELETE",
					headers: { token }
				});

				if (!response.ok) throw new Error("Failed to remove recipe");

				setIsSaved(false);
			} else {
				const response = await fetch(`${API_URL}/food`, {
					method: "POST",
					headers: { "Content-Type": "application/json", token },
					body: JSON.stringify({
						recipeId: parseInt(recipeId),
						title: recipe.title,
						image: recipe.image,
						cookTime: recipe.cookTime,
						servings: recipe.servings
					})
				});
				if (!response.ok) throw new Error("Failed to save recipe");
				const data = await response.json();

				setIsSaved(true);
			}
		} catch (error) {
			console.error("Error toggling recipe save", error);
			Alert.alert("Error", "Something went wrong. Please try again");
		} finally {
			setIsSaving(false);
		}
	};

	if (loading) return <Loader message='Loading recipe details...' />;

	return (
		<View style={recipeDetailStyles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={recipeDetailStyles.headerContainer}>
					<View style={recipeDetailStyles.imageContainer}>
						<Image
							source={{ uri: recipe.image }}
							style={recipeDetailStyles.headerImage}
							contentFit='cover'
						/>
					</View>
					<LinearGradient
						colors={[
							"transparent",
							"rgba(0,0,0,0.5)",
							"rgba(0,0,0,0.9)"
						]}
						style={recipeDetailStyles.gradientOverlay}
					/>

					<View style={recipeDetailStyles.floatingButtons}>
						<TouchableOpacity
							style={recipeDetailStyles.floatingButton}
							onPress={() => router.back()}
						>
							<Ionicons
								name='arrow-back'
								size={24}
								color={COLORS.white}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								recipeDetailStyles.floatingButton,
								{
									backgroundColor: isSaving
										? COLORS.gray
										: COLORS.primary
								}
							]}
							onPress={handleToggleSave}
							disabled={isSaving}
						>
							<Ionicons
								name={
									isSaving
										? "hourglass"
										: isSaved
										? "bookmark"
										: "bookmark-outline"
								}
								size={24}
								color={COLORS.white}
							/>
						</TouchableOpacity>
					</View>

					<View style={recipeDetailStyles.titleSection}>
						<View style={recipeDetailStyles.categoryBadge}>
							<Text style={recipeDetailStyles.categoryText}>
								{recipe.category}
							</Text>
						</View>
						<Text style={recipeDetailStyles.recipeTitle}>
							{recipe.title}
						</Text>
						{recipe.area && (
							<View style={recipeDetailStyles.locationRow}>
								<Ionicons
									name='location'
									size={16}
									color={COLORS.white}
								/>
								<Text style={recipeDetailStyles.locationText}>
									{recipe.area} Cuisine
								</Text>
							</View>
						)}
					</View>
				</View>
				<View style={recipeDetailStyles.contentSection}>
					<View style={recipeDetailStyles.statsContainer}>
						<View style={recipeDetailStyles.statCard}>
							<LinearGradient
								colors={["#FF6868", "#FF8E53"]}
								style={recipeDetailStyles.statIconContainer}
							>
								<Ionicons
									name='time'
									size={20}
									color={COLORS.white}
								/>
							</LinearGradient>
							<Text style={recipeDetailStyles.statValue}>
								{recipe.cookTime}
							</Text>
							<Text style={recipeDetailStyles.statLabel}>
								Prep Time
							</Text>
						</View>
						<View style={recipeDetailStyles.statCard}>
							<LinearGradient
								colors={["#4ECDC4", "#44A88D"]}
								style={recipeDetailStyles.statIconContainer}
							>
								<Ionicons
									name='people'
									size={20}
									color={COLORS.white}
								/>
							</LinearGradient>
							<Text style={recipeDetailStyles.statValue}>
								{recipe.servings}
							</Text>
							<Text style={recipeDetailStyles.statLabel}>
								Servings
							</Text>
						</View>
					</View>
					{recipe.youtubeUrl && (
						<View style={recipeDetailStyles.sectionContainer}>
							<View style={recipeDetailStyles.sectionTitleRow}>
								<LinearGradient
									colors={["#FF0000", "#CC0000"]}
									style={recipeDetailStyles.sectionIcon}
								>
									<Ionicons
										name='play'
										size={20}
										color={COLORS.white}
									/>
								</LinearGradient>
								<Text style={recipeDetailStyles.sectionTitle}>
									Video Tutorial
								</Text>
							</View>
							<View style={recipeDetailStyles.videoCard}>
								<WebView
									style={recipeDetailStyles.webview}
									source={{
										uri: getYoutubeEmbedUrl(
											recipe.youtubeUrl
										)
									}}
									allowsFullscreenVideo
									mediaPlaybackRequiresUserAction={false}
								></WebView>
							</View>
						</View>
					)}
					<View style={recipeDetailStyles.sectionContainer}>
						<View style={recipeDetailStyles.sectionTitleRow}>
							<LinearGradient
								colors={[COLORS.primary, COLORS.primary + "80"]}
								style={recipeDetailStyles.sectionIcon}
							>
								<Ionicons
									name='list'
									size={16}
									color={COLORS.white}
								/>
							</LinearGradient>
							<Text style={recipeDetailStyles.sectionTitle}>
								Ingredients
							</Text>
							<View style={recipeDetailStyles.countBadge}>
								<Text style={recipeDetailStyles.countText}>
									{recipe.ingredients.length}
								</Text>
							</View>
						</View>
						<View style={recipeDetailStyles.ingredientsGrid}>
							{recipe.ingredients.map((ingredient, index) => (
								<View
									key={index}
									style={recipeDetailStyles.ingredientCard}
								>
									<View
										style={
											recipeDetailStyles.ingredientNumber
										}
									>
										<Text
											style={
												recipeDetailStyles.ingredientNumberText
											}
										>
											{index + 1}
										</Text>
									</View>
									<Text
										style={
											recipeDetailStyles.ingredientText
										}
									>
										{ingredient}
									</Text>
									<View
										style={
											recipeDetailStyles.ingredientCheck
										}
									>
										<Ionicons
											name='checkmark-circle-outline'
											size={20}
											color={COLORS.textLight}
										/>
									</View>
								</View>
							))}
						</View>
					</View>
					<View style={recipeDetailStyles.sectionContainer}>
						<View style={recipeDetailStyles.sectionTitleRow}>
							<LinearGradient
								colors={["#9C2780", "#673AB7"]}
								style={recipeDetailStyles.sectionIcon}
							>
								<Ionicons
									name='book'
									size={16}
									color={COLORS.white}
								/>
							</LinearGradient>
							<Text style={recipeDetailStyles.sectionTitle}>
								Instructions
							</Text>
							<View style={recipeDetailStyles.countBadge}>
								<Text style={recipeDetailStyles.countText}>
									{recipe.instructions.length}
								</Text>
							</View>
						</View>
						<View style={recipeDetailStyles.instructionsContainer}>
							{recipe.instructions.map((instruction, index) => (
								<View
									key={index}
									style={recipeDetailStyles.instructionCard}
								>
									<LinearGradient
										colors={[
											COLORS.primary,
											COLORS.primary + "CC"
										]}
										style={recipeDetailStyles.stepIndicator}
									>
										<Text
											style={
												recipeDetailStyles.stepNumber
											}
										>
											{index + 1}
										</Text>
									</LinearGradient>
									<View
										style={
											recipeDetailStyles.instructionContent
										}
									>
										<Text
											style={
												recipeDetailStyles.instructionText
											}
										>
											{instruction}
										</Text>
										<View
											style={
												recipeDetailStyles.instructionFooter
											}
										>
											<Text
												style={
													recipeDetailStyles.stepLabel
												}
											>
												Step {index + 1}
											</Text>
											<TouchableOpacity
												style={
													recipeDetailStyles.completeButton
												}
											>
												<Ionicons
													name='checkmark'
													size={16}
													color={COLORS.primary}
												/>
											</TouchableOpacity>
										</View>
									</View>
								</View>
							))}
						</View>
					</View>
					<TouchableOpacity
						style={recipeDetailStyles.primaryButton}
						onPress={handleToggleSave}
						disable={isSaving}
					>
						<LinearGradient
							colors={[COLORS.primary, COLORS.primary + "FF"]}
							style={recipeDetailStyles.buttonGradient}
						>
							<Ionicons
								name={isSaved ? "heart" : "heart-outline"}
								size={20}
								color={COLORS.white}
							/>
							<Text style={recipeDetailStyles.buttonText}>
								{isSaved
									? "Remove from favorites"
									: "Add to favorites"}
							</Text>
						</LinearGradient>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	);
};

export default RecipeDetailScreen;
