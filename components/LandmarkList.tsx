import { useRouter } from "expo-router";
import { Award, Lock, MapPin } from "lucide-react-native";
import React from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { LandmarkProps } from "../types";
import { useLandmarkProximityStore } from "@/store/landmarkProximityStore";
import { calculateDistance } from "@/utils/mapUtils";
import { useLocationStore } from "@/store/locationStore";

// Add distance to the LandmarkProps type
interface LandmarkWithDistance extends LandmarkProps {
  distance: number;
}

export default function LandmarkList({
  landmarks,
}: {
  landmarks: LandmarkProps[];
}) {
  const router = useRouter();
  const { getUserIsInside, getListLandmarksInsideLocked } =
    useLandmarkProximityStore();

  // Get the user's location from the store
  const { userLatitude, userLongitude } = useLocationStore();
  if (!userLatitude || !userLongitude) return null;

  // Add distances to landmarks and sort them
  const landmarksWithDistance: LandmarkWithDistance[] = landmarks
    .map((landmark) => ({
      ...landmark,
      distance: calculateDistance(
        userLatitude,
        userLongitude,
        landmark.latitude,
        landmark.longitude,
      ),
    }))
    .sort((a, b) => a.distance - b.distance);

  const landmarksInsideLocked = getListLandmarksInsideLocked()
    .map((landmark) => ({
      ...landmark,
      distance: calculateDistance(
        userLatitude,
        userLongitude,
        landmark.latitude,
        landmark.longitude,
      ),
    }))
    .sort((a, b) => a.distance - b.distance);

  const renderItem = ({ item: landmark }: { item: LandmarkWithDistance }) => {
    const isUserInside = getUserIsInside(landmark.id);
    const backgroundColor = isUserInside
      ? "bg-violet-600/20"
      : landmark.isUnlocked
        ? "bg-green-500/20"
        : "bg-gray-500/20";

    return (
      <Pressable
        className={`px-4 py-3 rounded-md ${backgroundColor}`}
        onPress={() => router.push(`/${landmark.id}`)}
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="font-medium text-white">{landmark.name}</Text>
            <View className="flex-row items-center mt-1">
              <MapPin color="#9ca3af" size={16} />
              <Text className="text-gray-400 text-sm ml-1">
                {landmark.distance.toFixed(1)} km away
              </Text>
            </View>
          </View>
          {landmark.isUnlocked ? (
            <Award color="#22c55e" size={20} />
          ) : (
            <Lock color="#9ca3af" size={20} />
          )}
        </View>
      </Pressable>
    );
  };

  const renderInsideLocked = ({
    item: landmark,
  }: {
    item: LandmarkWithDistance;
  }) => {
    return (
      <Pressable
        className="rounded-md overflow-hidden shadow-lg active:opacity-80"
        onPress={() => router.push(`/${landmark.id}`)}
      >
        <View className="relative h-36">
          <Image
            source={{ uri: landmark.image }}
            className="w-full h-[100%]"
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "#7c3aed"]}
            locations={[0, 0.8]}
            className="absolute w-full h-[100%] bottom-0 overflow-hidden rounded-b-md"
          />
          <View className="absolute bottom-0 left-0 right-0 p-3">
            <Text className="text-white text-base mb-1">Unlock it now! 🎉</Text>
            <Text className="text-white text-xl font-bold mb-1">
              {landmark.name}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <ScrollView className="p-6 flex-1">
      {landmarksInsideLocked.length > 0 && (
        <View className="mb-4">
          <Text className="text-xl font-semibold mb-4 text-gray-300">
            Landmarks Inside Locked
          </Text>
          <FlatList
            data={landmarksInsideLocked}
            renderItem={renderInsideLocked}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => <View className="h-3" />}
            scrollEnabled={false}
          />
        </View>
      )}

      <Text className="text-xl font-semibold mb-4 text-gray-300">
        Nearby Landmarks
      </Text>
      {landmarksWithDistance.length === 0 ? (
        <Text className="text-gray-500 text-lg">No landmarks found</Text>
      ) : (
        <FlatList
          data={landmarksWithDistance}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <View className="h-3" />}
          scrollEnabled={false}
        />
      )}
      <View className="h-20" />
    </ScrollView>
  );
}
