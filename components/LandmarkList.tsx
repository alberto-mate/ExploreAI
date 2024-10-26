import { useRouter } from "expo-router";
import {
  Award,
  Lock,
  MapPin,
  Navigation,
  Clock,
  Users,
  Star,
} from "lucide-react-native";
import React from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { LandmarkProps } from "../types";
import { useLandmarkProximityStore } from "@/store/landmarkProximityStore";
import { calculateDistance } from "@/utils/mapUtils";
import { useLocationStore } from "@/store/locationStore";

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
  const { userLatitude, userLongitude } = useLocationStore();

  if (!userLatitude || !userLongitude) return null;

  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth - 48; // 24px padding on each side

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
    const gradientColors = isUserInside
      ? ["#7c3aed20", "#7c3aed40"]
      : landmark.isUnlocked
        ? ["#22c55e20", "#22c55e40"]
        : ["#9ca3af20", "#9ca3af40"];

    return (
      <Pressable
        className="rounded-xl overflow-hidden shadow-lg active:opacity-90"
        onPress={() => router.push(`/${landmark.id}`)}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="p-4"
        >
          <View className="flex-row items-start space-x-4">
            <Image
              source={{ uri: landmark.image }}
              className="w-20 h-20 rounded-lg"
              resizeMode="cover"
            />
            <View className="flex-1">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold text-white mb-1">
                  {landmark.name}
                </Text>
                {landmark.isUnlocked ? (
                  <Award color="#22c55e" size={24} />
                ) : (
                  <Lock color="#9ca3af" size={24} />
                )}
              </View>

              <View className="flex-row items-center space-x-4 mt-2">
                <View className="flex-row items-center">
                  <Navigation color="#9ca3af" size={16} />
                  <Text className="text-gray-400 text-sm ml-1">
                    {landmark.distance.toFixed(1)} km
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Users color="#9ca3af" size={16} />
                  <Text className="text-gray-400 text-sm ml-1">
                    {Math.floor(Math.random() * 100)} visits
                  </Text>
                </View>
              </View>

              <View className="flex-row mt-2 space-x-2">
                <View className="bg-violet-500/20 px-2 py-1 rounded-full">
                  <Text className="text-violet-300 text-xs">Historical</Text>
                </View>
                <View className="bg-blue-500/20 px-2 py-1 rounded-full">
                  <Text className="text-blue-300 text-xs">Cultural</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
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
        className="rounded-xl overflow-hidden shadow-lg active:opacity-90"
        onPress={() => router.push(`/${landmark.id}`)}
      >
        <View className="relative h-48">
          <Image
            source={{ uri: landmark.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(124, 58, 237, 0.95)"]}
            locations={[0.3, 1]}
            className="absolute w-full h-full"
          />
          <View className="absolute bottom-0 left-0 right-0 p-4">
            <View className="flex-row items-center space-x-1 mb-2">
              <Lock color="#fff" size={16} />
              <Text className="text-white font-semibold">Unlock Now</Text>
            </View>

            <Text className="text-white text-xl font-bold mb-2">
              {landmark.name}
            </Text>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center space-x-4">
                <View className="flex-row items-center">
                  <Navigation color="#fff" size={16} />
                  <Text className="text-white text-sm ml-1">You're here! </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-900">
      <View className="p-6">
        {landmarksInsideLocked.length > 0 && (
          <View className="mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-2xl font-bold text-white">
                Unlock These Spots
              </Text>
            </View>
            <FlatList
              data={landmarksInsideLocked}
              renderItem={renderInsideLocked}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={() => <View className="h-4" />}
              scrollEnabled={false}
            />
          </View>
        )}

        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-white">
            Nearby Landmarks
          </Text>

          {/* 
          TODO: Now working the stack navigation
          <Pressable
            className="flex-row items-center bg-gray-800 px-3 py-1 rounded-full"
            onPress={() => router.push(`/cities/${landmarks[0].cityId}`)}
          >
            <Text className="text-violet-400 text-sm">See All</Text>
          </Pressable> */}
        </View>

        {landmarksWithDistance.length === 0 ? (
          <View className="flex items-center justify-center py-8">
            <MapPin color="#9ca3af" size={48} />
            <Text className="text-gray-400 text-lg mt-4">
              No landmarks found nearby
            </Text>
            <Text className="text-gray-500 text-sm mt-2">
              Try exploring a different area
            </Text>
          </View>
        ) : (
          <FlatList
            data={landmarksWithDistance}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => <View className="h-4" />}
            scrollEnabled={false}
          />
        )}
      </View>
      <View className="h-20" />
    </ScrollView>
  );
}
