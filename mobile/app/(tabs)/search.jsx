import {
	View,
	Text,
	TouchableOpacity,
	FlatList,
	TextInput
} from "react-native";
import { useState, useEffect } from "react";
import { searchStyles } from "@/assets/styles/search.styles";
import { COLORS } from "@/constants/colors";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { MealAPI } from "@/services/mealAPI";
import { useDebounce } from "@/hooks/useDebounce";
import RecipeCard from "@/components/RecipeCard";
import Loader from "@/components/Loader";

const SearchScreen = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [recipes, setRecipes] = useState([]);
	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);

	const debouncedSearchQuery = useDebounce(searchQuery, 300);

	const performSearch = async query => {
		if (!query.trim()) {
			const randomMeals = await MealAPI.getRandomMeals(12);
			return randomMeals
				.map(meal => MealAPI.transformMealData(meal))
				.filter(meal => meal !== null);
		}

		const nameResults = await MealAPI.searchMealsByName(query);
		let results = nameResults;

		if (results.length === 0) {
			const ingredientResults = await MealAPI.filterByIngredient(query);
			results = ingredientResults;
		}
		return results
			.slice(0, 12)
			.map(meal => MealAPI.transformMealData(meal))
			.filter(meal => meal !== null);
	};

	useEffect(() => {
		const loadInitialData = async () => {
			try {
				const results = await performSearch("");
				setRecipes(results);
			} catch (error) {
				console.error("Error loading initial search data", error);
			} finally {
				setInitialLoading(false);
			}
		};
		loadInitialData();
	}, []);

	useEffect(() => {
		if (initialLoading) return;
		const handleSearch = async () => {
			setLoading(true);
			try {
				const results = await performSearch(debouncedSearchQuery);
				setRecipes(results);
			} catch (error) {
				console.error("Error searching", error);
				setRecipes([]);
			} finally {
				setLoading(false);
			}
		};
		handleSearch();
	}, [debouncedSearchQuery, initialLoading]);

	if (initialLoading) return <Loader message='Loading...' />;

	return (
		<View style={searchStyles.container}>
			<View style={searchStyles.searchSection}>
				<View style={searchStyles.searchContainer}>
					<Ionicons
						name='search'
						size={20}
						color={COLORS.textLight}
						style={searchStyles.searchIcon}
					/>
					<TextInput
						style={searchStyles.searchInput}
						placeholder='Search recipes'
						placeholderTextColor={COLORS.textLight}
						value={searchQuery}
						onChangeText={setSearchQuery}
						returnKeyType='search'
					/>
					{searchQuery.length > 0 && (
						<TouchableOpacity
							onPress={() => setSearchQuery("")}
							style={searchStyles.clearButton}
						>
							<Ionicons
								name='close-circle'
								size={20}
								color={COLORS.textLight}
							/>
						</TouchableOpacity>
					)}
				</View>
			</View>
			<View style={searchStyles.resultsSection}>
				<View style={searchStyles.resultsHeader}>
					<Text style={searchStyles.resultsTitle}>
						{searchQuery
							? `Results for "${searchQuery}"`
							: "Popular Recipes"}
					</Text>
					<Text style={searchStyles.resultsCount}>
						{recipes.length} found
					</Text>
				</View>

				{loading ? (
					<View style={searchStyles.loadingContainer}>
						<Loader message='Searching...'size="small" />
					</View>
				) : (
					<FlatList
						data={recipes}
						renderItem={({ item }) => <RecipeCard recipe={item} />}
						keyExtractor={item => item.id.toString()}
						numColumns={2}
						columnWrapperStyle={searchStyles.row}
						contentContainerStyle={searchStyles.recipesGrid}
						showsVerticalScrollIndicator={false}
						ListEmptyComponent={
							<View style={searchStyles.emptyState}>
								<Ionicons
									name='search-outline'
									size={64}
									color={COLORS.textLight}
								/>
								<Text style={searchStyles.emptyTitle}>
									No Recipes Found
								</Text>
								<Text style={searchStyles.emptyDescription}>
									Try using a different keyword
								</Text>
							</View>
						}
					/>
				)}
			</View>
		</View>
	);
};
export default SearchScreen;
