import { Link } from "expo-router";
import React from "react";
import {
  View,
  Image,
  Text,
  FlatList,
  Pressable,
  ScrollView,
} from "react-native";

import { landmarksGlobal } from "@/constants/landmarks";
import { CityProps, LandmarkProps } from "@/types";

export default function CollectionGrid({ city }: { city: CityProps }) {
  // Get the landmarks from the city
  const landmarksCity = landmarksGlobal.filter((l) => l.cityId === city.id);

  const unlockedLandmarksCity = landmarksCity.filter((l) => l.unlocked);
  const lockedLandmarksCity = landmarksCity.filter((l) => !l.unlocked);

  const renderItem = ({ item: landmark }: { item: LandmarkProps }) => (
    <View style={{ width: "48%" }}>
      <Link href={`/${landmark.id}`} asChild>
        <Pressable className="bg-white/10 rounded-lg p-2 backdrop-blur-md">
          <Image
            source={{ uri: landmark.image }}
            className="w-full h-24 rounded-md mb-2"
            resizeMode="cover"
          />
          <Text className="text-sm font-medium text-white text-center">
            {landmark.name}
          </Text>
        </Pressable>
      </Link>
    </View>
  );

  return (
    <ScrollView className="h-full">
      <View className="mb-4">
        <Text className="text-xl font-semibold mb-4 text-gray-300">
          Unlocked Landmarks
        </Text>
        <FlatList
          data={unlockedLandmarksCity}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          ItemSeparatorComponent={() => <View className="h-4" />}
          scrollEnabled={false}
        />
      </View>
      <View>
        <Text className="text-xl font-semibold mb-4 text-gray-300">
          Locked Landmarks
        </Text>
        <FlatList
          data={lockedLandmarksCity}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          ItemSeparatorComponent={() => <View className="h-4" />}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
}
