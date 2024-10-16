import { useUser } from "@clerk/clerk-expo";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useRef } from "react";
import { ActivityIndicator, Dimensions, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";

import CurrentLocation from "@/components/CurrentLocation";
import LandmarkList from "@/components/LandmarkList";
import Map from "@/components/Map";
import { useLocationStore } from "@/store/locationStore";
import { CityProps, LandmarkProps } from "@/types";
import { fetchAPI } from "@/utils/fetch";
import { useLandmarkProximityStore } from "@/store/landmarkProximityStore";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function HomeScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { user } = useUser();

  const { userAddress } = useLocationStore();
  const clerkId = user?.id; // Get the clerkId (user ID)

  // Get the current city name from the user address
  const currentCityName = userAddress?.split(",")[0] || "Unknown";

  const { data: cities, isLoading: isLoadingCities } = useQuery<CityProps[]>(
    ["cities"],
    () => fetchAPI("/(api)/cities").then((response) => response.data),
  );

  const currentCity = cities?.find((city) => city.name === currentCityName);

  // Query the API to get the landmarks for the city and the current user
  const { data: landmarksCity, isLoading: isLoadingLandmarks } = useQuery<
    LandmarkProps[]
  >(
    ["landmarksCity", currentCity?.id, clerkId],
    () =>
      fetchAPI(
        `/(api)/landmarksCity?cityId=${currentCity?.id}&clerkId=${clerkId}`,
      ).then((response) => response.data),
    {
      enabled: !!clerkId && !!currentCity?.id, // Only run the query if both clerkId and currentCity.id are available
    },
  );

  const { setLandmarks } = useLandmarkProximityStore();
  useEffect(() => {
    setLandmarks(landmarksCity || []);
  }, [landmarksCity]);

  // Animated values
  const animatedBottomSheetIndex = useSharedValue(0);
  const animatedBottomSheetPosition = useSharedValue(SCREEN_HEIGHT * 0.2);

  const currentLocationAnimatedIndex = useDerivedValue(
    () => animatedBottomSheetIndex.value,
  );
  const currentLocationAnimatedPosition = useDerivedValue(
    () => animatedBottomSheetPosition.value,
  );

  const snapPoints = useMemo(() => ["20%", "45%", "85%"], []);

  const handleSheetChanges = (index: number) => {
    animatedBottomSheetIndex.value = index;
  };

  if (isLoadingCities || isLoadingLandmarks || !userAddress) {
    return (
      <SafeAreaView edges={["bottom"]} className="flex-1 bg-gray-900">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="small" color="#ffffff" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-gray-900">
      <GestureHandlerRootView>
        <Map landmarks={landmarksCity || []} />
        <CurrentLocation
          locationName={userAddress}
          animatedIndex={currentLocationAnimatedIndex}
          animatedPosition={currentLocationAnimatedPosition}
        />
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={1}
          animatedPosition={animatedBottomSheetPosition}
          animatedIndex={animatedBottomSheetIndex}
          onChange={handleSheetChanges}
          backgroundStyle={{
            backgroundColor: "#111827",
          }}
          handleIndicatorStyle={{
            backgroundColor: "#ffffff",
          }}
        >
          <BottomSheetView style={{ flex: 1, paddingBottom: 20 }}>
            <LandmarkList landmarks={landmarksCity || []} />
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
