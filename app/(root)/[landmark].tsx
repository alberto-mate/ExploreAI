import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import {
  MapPin,
  ArrowLeft,
  Lock,
  Unlock,
  Navigation,
  Clock,
  Share2,
  ChevronDown,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Animated,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import CustomButton from "@/components/CustomButton";
import InfoButtons from "@/components/InfoButtons";
import { useLocationStore } from "@/store/locationStore";
import { LandmarkProps } from "@/types";
import { fetchAPI } from "@/utils/fetch";
import { calculateDistance } from "@/utils/mapUtils";
import { useLandmarkProximityStore } from "@/store/landmarkProximityStore";
import UnlockSlider from "@/components/UnlockSlider";

const HERO_HEIGHT = 384; // height-96 in pixels

export default function LandmarkScreen() {
  const { landmark: landmarkId } = useLocalSearchParams();
  const { userLatitude, userLongitude } = useLocationStore();
  const router = useRouter();
  const { user } = useUser();
  const clerkId = user?.id;
  const [scrollY] = useState(new Animated.Value(0));

  const queryClient = useQueryClient();
  const { getUserIsInside } = useLandmarkProximityStore();
  const isUserInside = getUserIsInside(Number(landmarkId));

  const {
    data: landmark,
    isLoading,
    error,
  } = useQuery<LandmarkProps>(
    ["landmark", landmarkId, clerkId],
    () =>
      fetchAPI(
        `/(api)/landmark?landmarkId=${landmarkId}&clerkId=${clerkId}`,
      ).then((response) => response.data),
    { enabled: !!clerkId },
  );

  const mutationLandmark = useMutation({
    mutationFn: (newUnlockState: boolean) =>
      fetchAPI("/(api)/landmark", {
        method: "POST",
        body: JSON.stringify({
          landmarkId,
          clerkId,
          isUnlocked: newUnlockState,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["landmark", landmarkId, clerkId]);
      queryClient.invalidateQueries([
        "landmarksCity",
        landmark?.cityId,
        clerkId,
      ]);
      queryClient.invalidateQueries(["cityProgress", clerkId]);
    },
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.5, 1],
    extrapolateLeft: "extend",
    extrapolateRight: "clamp",
  });

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900">
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  if (error || !landmark) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900">
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <Text className="text-white">Error fetching landmark</Text>
      </View>
    );
  }

  const distance =
    userLatitude && userLongitude
      ? calculateDistance(
          userLatitude,
          userLongitude,
          landmark.latitude,
          landmark.longitude,
        ).toFixed(2)
      : "Unknown";

  return (
    <View className="flex-1 bg-gray-900">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Animated Header */}
      <Animated.View
        style={{ opacity: headerOpacity }}
        className="absolute top-0 left-0 right-0 z-10 h-[92px]"
      >
        <BlurView
          intensity={100}
          className="w-full h-full absolute top-0 left-0"
        />

        {/* Main container with proper padding and spacing */}
        <View className="flex-1 flex-row items-center justify-between h-full pt-14 pb-2">
          {/* Left section */}
          <View className="flex-[0.2] justify-center">
            <Pressable
              onPress={() => router.back()}
              className="px-4 py-2"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ArrowLeft color="#fff" size={24} />
            </Pressable>
          </View>

          {/* Center section */}
          <View className="flex-[0.6] items-center justify-center">
            <Text
              className="text-white text-lg font-semibold text-center"
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {landmark.name}
            </Text>
          </View>

          {/* Right section - maintains symmetry */}
          <View className="flex-[0.2]" />
        </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
        className="flex-1"
      >
        {/* Hero Section */}
        <Animated.View
          className="overflow-hidden"
          style={{
            height: HERO_HEIGHT,
            transform: [{ scale: imageScale }],
          }}
        >
          <Animated.Image
            source={{ uri: landmark.image }}
            className="absolute top-0 left-0 right-0 w-full h-full"
            style={{ transform: [{ scale: 1.1 }] }} // Slight overscale to prevent white edges
          />
          <LinearGradient
            colors={["transparent", "rgba(17, 24, 39, 1)"]}
            className="absolute bottom-0 left-0 right-0 h-40"
          />
          {/* // Small linear gradient in the bottom right with the red if the landmark is locked and green if it is unlocked */}
          <LinearGradient
            colors={[
              landmark.isUnlocked ? "#10B981" : "#EF4444",
              "transparent",
            ]}
            start={[1, 1]}
            end={[0.5, 0.5]}
            style={{
              position: "absolute",
              bottom: -10,
              right: -10,
              width: 150,
              height: 150,
            }}
          />
        </Animated.View>

        {/* Action Buttons - Outside the scaled container */}
        <View className="absolute top-0 left-0 right-0 flex-row justify-between px-4 pt-12">
          <Pressable
            onPress={() => router.back()}
            className="p-2 bg-black/30 rounded-full"
          >
            <ArrowLeft color="#fff" size={24} />
          </Pressable>
          <Pressable
            onPress={() => {
              /* Add share functionality */
            }}
            className="p-2 bg-black/30 rounded-full"
          >
            <Share2 color="#fff" size={24} />
          </Pressable>
        </View>

        {/* Content Section */}
        <View className="px-6 -mt-20">
          {/* Rest of the content remains the same... */}
          {/* Title and Status */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1">
              <Text className="text-3xl font-bold text-white mb-2">
                {landmark.name}
              </Text>
              <View className="flex-row items-center">
                <MapPin color="#9CA3AF" size={16} />
                <Text className="text-gray-400 ml-1 flex-1">
                  {landmark.address}
                </Text>
              </View>
            </View>
            {landmark.isUnlocked ? (
              <View className="bg-green-500/20 p-2 rounded-full">
                <Unlock color="#10B981" size={24} />
              </View>
            ) : (
              <View className="bg-red-500/20 p-2 rounded-full">
                <Lock color="#EF4444" size={24} />
              </View>
            )}
          </View>

          {/* Quick Info Cards */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row mb-6 -mx-6 px-6"
          >
            <View className="bg-gray-800 p-4 rounded-xl mr-4 min-w-[150px]">
              <Navigation color="#9CA3AF" size={20} />
              <Text className="text-white text-lg font-bold mt-2">
                {distance} km
              </Text>
              <Text className="text-gray-400 text-sm">from you</Text>
            </View>

            <View className="bg-gray-800 p-4 rounded-xl mr-4 min-w-[150px]">
              <Clock color="#9CA3AF" size={20} />
              <Text className="text-white text-lg font-bold mt-2">
                {isUserInside ? "You're here!" : "Not visited"}
              </Text>
              <Text className="text-gray-400 text-sm">Status</Text>
            </View>
          </ScrollView>

          {/* Unlock Section */}
          {!landmark.isUnlocked && (
            <View className="bg-gray-800 rounded-xl p-6 mb-6">
              <Text className="text-white text-lg font-semibold mb-2">
                Unlock this landmark
              </Text>
              <Text className="text-gray-400 mb-4">
                Visit this location in person to unlock special content and earn
                achievements
              </Text>
              {isUserInside ? (
                <UnlockSlider
                  onUnlock={() => mutationLandmark.mutate(true)}
                  isLoading={mutationLandmark.isLoading}
                />
              ) : (
                <CustomButton
                  title="Get Directions"
                  IconLeft={Navigation}
                  bgVariant="primary"
                  onPress={() => {
                    /* Add navigation functionality */
                  }}
                />
              )}
            </View>
          )}

          {/* Additional Content */}
          {landmark.isUnlocked && (
            <View className="mb-6">
              <Text className="text-white text-xl font-semibold mb-4">
                Additional Information
              </Text>
              <InfoButtons name={landmark.name} />
            </View>
          )}
        </View>

        {/* Bounce Indicator */}
        <View className="items-center pb-6 pt-2">
          <ChevronDown color="#9CA3AF" size={24} />
        </View>
      </Animated.ScrollView>
    </View>
  );
}
