import { useQuery } from "@tanstack/react-query";
import { FlatList, Text, View } from "react-native";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CityCard from "@/components/CityCard";
import { useLocationStore } from "@/store/locationStore";
import { CityProps } from "@/types";
import { fetchAPI } from "@/utils/fetch";

export default function CitiesScreen() {
  const { userAddress } = useLocationStore();
  const currentCityName = userAddress?.split(",")[0] || "Unknown";

  const {
    data: cities,
    isLoading,
    error,
  } = useQuery<CityProps[]>(["cities"], () =>
    fetchAPI("/(api)/cities").then((response) => response.data),
  );

  if (isLoading)
    return (
      <SafeAreaView className="flex-1 bg-gray-900 justify-center items-center">
        <ActivityIndicator size="small" color="#fff" />
      </SafeAreaView>
    );

  if (error || !cities) {
    return (
      <View className="flex justify-between items-center w-full">
        <Text className="text-red-500">Error: {String(error)}</Text>
      </View>
    );
  }

  const currentCity = cities.find((city) => city.name === currentCityName);

  // Explored cities are cities that the user has visited taking out the current city
  const exploredCities = cities.filter((city) => city.id !== currentCity?.id);

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
          ListHeaderComponent={renderCurrentCity()}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => <View className="h-16" />}
        />
      </View>
    </SafeAreaView>
  );
}
