import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { homeStyles } from "../assets/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { useRouter } from "expo-router";

export default function Featured({ featuredRecipe }) {
	const router = useRouter();
	
	return (
		<View style={homeStyles.featuredSection}>
			<TouchableOpacity
				style={homeStyles.featuredCard}
				activeOpacity={0.9}
				onPress={() => router.push(`/recipe/${featuredRecipe.id}`)}
			>
				<View style={homeStyles.featuredImageContainer}>
					<Image
						source={{ uri: featuredRecipe.image }}
						style={homeStyles.featuredImage}
						contentFit='cover'
						transition={500}
					/>
					<View style={homeStyles.featuredOverlay}>
						<View style={homeStyles.featuredBadge}>
							<Text style={homeStyles.featuredBadgeText}>
								Featured
							</Text>
						</View>
						<View style={homeStyles.FeaturedContent}>
							<Text
								style={homeStyles.featuredTitle}
								numberOfLines={2}
							>
								{featuredRecipe.title}
							</Text>
							<View style={homeStyles.featuredMeta}>
								<View style={homeStyles.metaItem}>
									<Ionicons
										name='time-outline'
										size={16}
										color={COLORS.white}
									/>
									<Text style={homeStyles.metaText}>
										{featuredRecipe.cookTime}
									</Text>
								</View>
								<View style={homeStyles.metaItem}>
									<Ionicons
										name='people-outline'
										size={16}
										color={COLORS.white}
									/>
									<Text style={homeStyles.metaText}>
										{featuredRecipe.servings}
									</Text>
								</View>
								{featuredRecipe.area && (
									<View style={homeStyles.metaItem}>
										<Ionicons
											name='location-outline'
											size={16}
											color={COLORS.white}
										/>
										<Text style={homeStyles.metaText}>
											{featuredRecipe.area}
										</Text>
									</View>
								)}
							</View>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		</View>
	);
}
