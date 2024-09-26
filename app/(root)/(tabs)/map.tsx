import React, { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Map from "../../../components/Map";
import LandmarkList from "../../../components/LandmarkList";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

export default function HomeScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-gray-900">
      <GestureHandlerRootView>
        <Map />
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={["20%", "50%", "85%"]}
          index={1}
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
            }}
          >
            <LandmarkList />
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
