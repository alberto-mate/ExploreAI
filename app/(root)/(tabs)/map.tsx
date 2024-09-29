import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useMemo, useRef } from "react";
import { Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import CurrentLocation from "@/components/CurrentLocation";
import { useLocationStore } from "@/store/locationStore";

import LandmarkList from "../../../components/LandmarkList";
import Map from "../../../components/Map";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// https://github.com/gorhom/react-native-bottom-sheet/blob/master/example/src/screens/integrations/map/MapExample.tsx#L15

export default function HomeScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const { userAddress } = useLocationStore();

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

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-gray-900">
      <GestureHandlerRootView>
        <Map />
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
          <BottomSheetView
            style={{
              flex: 1,
              paddingBottom: 20,
            }}
          >
            <LandmarkList />
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
