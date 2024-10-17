import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";

import CustomButton from "@/components/CustomButton";
import InfoButtons from "@/components/InfoButtons";
import { useLocationStore } from "@/store/locationStore";
import { LandmarkProps } from "@/types";
import { fetchAPI } from "@/utils/fetch";
import { calculateDistance } from "@/utils/mapUtils";
import { useLandmarkProximityStore } from "@/store/landmarkProximityStore";
import UnlockSlider from "@/components/UnlockSlider";

export default function LandmarkScreen() {
  const { landmark: landmarkId } = useLocalSearchParams();
  const { userLatitude, userLongitude } = useLocationStore();
  const router = useRouter();
  const { user } = useUser();
  const clerkId = user?.id;

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

  // Mutation to update unlock state
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
      // Invalidate the cache so that the new state is fetched after the mutation
      queryClient.invalidateQueries(["landmark", landmarkId, clerkId]);
      queryClient.invalidateQueries([
        "landmarksCity",
        landmark?.cityId,
        clerkId,
      ]);
      queryClient.invalidateQueries(["cityProgress", clerkId]);
    },
  });

  const LoadingContent = () => (
    <View className="flex-1 justify-center items-center bg-gray-900">
      <ActivityIndicator size="large" color="white" />
    </View>
  );

  const ErrorContent = () => (
    <View className="flex-1 justify-center items-center bg-gray-900">
      <Text className="text-white">Error fetching landmark</Text>
    </View>
  );

  const distance =
    userLatitude && userLongitude && landmark
      ? calculateDistance(
          userLatitude,
          userLongitude,
          landmark.latitude,
          landmark.longitude,
        ).toFixed(2)
      : "Unknown";

  return (
    <>
      <Stack.Screen
        options={{
          title: landmark?.name || "Loading...",
          headerShown: true,
          headerStyle: { backgroundColor: "#1F2937" },
          headerTintColor: "#fff",
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <ArrowLeft color="#fff" size={24} />
            </Pressable>
          ),
        }}
      />

      {isLoading ? (
        <LoadingContent />
      ) : error || !landmark ? (
        <ErrorContent />
      ) : (
        <ScrollView className="flex-1 bg-gray-900">
          <Image
            source={{ uri: landmark.image }}
            className="w-full h-40 object-cover"
          />
          <View className="p-6">
            <Text className="text-2xl font-bold text-white mb-2">
              {landmark.name}
            </Text>
            <Text className="text-gray-300 mb-2">
              Address: {landmark.address}
            </Text>
            <Text className="text-gray-300 mb-4">
              Distance: {distance} km from your location
            </Text>

            {/* Unlock Button */}
            <CustomButton
              title={
                mutationLandmark.isLoading
                  ? " "
                  : landmark.isUnlocked
                    ? "Unlocked"
                    : "Locked"
              }
              IconLeft={
                mutationLandmark.isLoading ? ActivityIndicator : undefined
              }
              bgVariant={landmark.isUnlocked ? "success" : "danger"} // Change color based on state
              onPress={() => mutationLandmark.mutate(!landmark.isUnlocked)} // Toggle unlock state
              className="mb-4"
            />

            {
              // Unlock Slider
              // Only show the unlock slider if the user is inside the landmark and it's still locked
              isUserInside && !landmark.isUnlocked && (
                <UnlockSlider
                  onUnlock={() => {
                    mutationLandmark.mutate(true);
                  }}
                />
              )
            }

            {landmark.isUnlocked && <InfoButtons name={landmark.name} />}
          </View>
        </ScrollView>
      )}
    </>
  );
}
