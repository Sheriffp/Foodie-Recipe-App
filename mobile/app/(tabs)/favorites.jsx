import {
	View,
	Text,
	TouchableOpacity,
	FlatList,
	Alert,
	ScrollView,
	RefreshControl
} from "react-native";
import { useState, useEffect } from "react";
import { favoritesStyles } from "@/assets/styles/favorites.styles";
import { COLORS } from "@/constants/colors";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/authStore";
import { API_URL } from "@/constants/api";
import RecipeCard from "@/components/RecipeCard";
import NoFavoritesFound from "@/components/NoFavoritesFound";
import Loader from "@/components/Loader";

const FavoritesScreen = () => {
	const { token, logout } = useAuthStore();
	const [loading, setLoading] = useState(true);
	const [favoriteRecipes, setFavoriteRecipes] = useState([]);
	const [refreshing, setRefreshing] = useState(false);

	const loadFavorites = async () => {
		try {
			const response = await fetch(`${API_URL}/food`, {
				headers: { token }
			});
			if (!response.ok) throw new Error("Failed to fetch favorites");

			//Destructure and get the food
			const { food = [] } = await response.json();

			//this will march our recipecard component format
			const transformedFavorites = food.map(favorite => ({
				...favorite,
				id: favorite.recipe_id
			}));

			setFavoriteRecipes(transformedFavorites);
		} catch (error) {
			console.error("Error loading favorites", error);
			Alert.alert("Error", "failed to load favorites");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadFavorites();
	}, [favoriteRecipes, token]);

	const handleLogout = async () => {
		Alert.alert("Logout", "Are you sure you want to logout?", [
			{ text: "Cancel", style: "cancel" },
			{ text: "Logout", style: "destructive", onPress: logout }
		]);
	};

	const onRefresh = async () => {
		setRefreshing(true);
		await loadFavorites();
		setRefreshing(false);
	};

	if (loading) return <Loader message='Loading favorite recipes...' />;

	return (
		<View style={favoritesStyles.container}>
			<ScrollView
				showsVerticalScreenIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor={COLORS.primary}
					/>
				}
			>
				<View style={favoritesStyles.header}>
					<Text style={favoritesStyles.title}>Favorites</Text>
					<TouchableOpacity
						style={favoritesStyles.logoutButton}
						onPress={handleLogout}
					>
						<Ionicons
							name='log-out-outline'
							size={22}
							color={COLORS.text}
						/>
					</TouchableOpacity>
				</View>
				<View style={favoritesStyles.recipesSection}>
					<FlatList
						data={favoriteRecipes}
						renderItem={({ item }) => <RecipeCard recipe={item} />}
						keyExtractor={item => item.id.toString()}
						numColumns={2}
						contentContainerStyle={favoritesStyles.recipesGrid}
						columnWrapperStyle={favoritesStyles.row}
						scrollEnabled={false}
						ListEmptyComponent={<NoFavoritesFound />}
					/>
				</View>
			</ScrollView>
		</View>
	);
};
export default FavoritesScreen;
