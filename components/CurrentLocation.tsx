import { MapPin } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import { Dimensions, LayoutChangeEvent, StyleSheet, Text } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaFrame } from "react-native-safe-area-context";

interface CurrentLocationProps {
  locationName: string;
  animatedPosition: Animated.SharedValue<number>;
  animatedIndex: Animated.SharedValue<number>;
}

const SPACE = 8;
const MIDDLE_SNAP_POINT = 0.6 * Dimensions.get("window").height;

export default function CurrentLocation({
  locationName,
  animatedIndex,
  animatedPosition,
}: CurrentLocationProps) {
  const [height, setHeight] = useState(0);
  const { height: screenHeight } = useSafeAreaFrame();

  const handleOnLayout = useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      setHeight(layout.height);
    },
    [],
  );

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const belowMiddlePosition =
      screenHeight - animatedPosition.value < MIDDLE_SNAP_POINT;
    return {
      opacity: interpolate(
        animatedIndex.value,
        [1, 1.125],
        [1, 0],
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          translateY: belowMiddlePosition
            ? animatedPosition.value - height - SPACE
            : screenHeight - MIDDLE_SNAP_POINT - height - SPACE,
        },
      ],
    };
  }, [animatedIndex.value, animatedPosition.value, height, screenHeight]);

  const containerStyle = useMemo(
    () => [styles.container, containerAnimatedStyle],
    [containerAnimatedStyle],
  );

  return (
    <Animated.View
      onLayout={handleOnLayout}
      style={containerStyle}
      className="bg-gray-900 rounded-md p-2"
    >
      <Text className="text-white align-center">
        <MapPin color="#fff" className="inline-block mr-1" size={12} />
        Current Location: {locationName || "Loading..."}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 12,
    top: 0,
  },
});
