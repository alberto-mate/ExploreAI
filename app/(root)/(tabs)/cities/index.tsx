import { Link } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CityCard from "@/components/CityCard";
import { cities } from "@/constants/cities";
import { useLocationStore } from "@/store/locationStore";

export default function CitiesScreen() {
  // TODO: Implement current city from user location
  const { userAddress } = useLocationStore();
  const currentCityName = userAddress?.split(",")[0] || "Unknown";

  const currentCity = cities.find((city) => city.name === currentCityName);

  const renderCurrentCity = () => {
    return (
      <>
        <Text className="text-3xl font-bold mb-4 text-white">ExploreAI</Text>

        <CityCard city={currentCity} isCurrentCity={true} />
        <Text className="text-white text-xl font-semibold my-4">
          Explored cities
        </Text>
      </>
    );
  };

  // Explored cities are cities that the user has visited taking out the current city
  const exploredCities = cities.filter((city) => city.id !== currentCity?.id);

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="p-6">
        <FlatList
          data={exploredCities}
          renderItem={({ item }) => (
            <CityCard city={item} isCurrentCity={false} />
          )}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <View className="h-4" />}
          ListHeaderComponent={
            currentCity ? renderCurrentCity : <View className="h-4" />
          }
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => <View className="h-16" />}
        />
      </View>
    </SafeAreaView>
  );
}
