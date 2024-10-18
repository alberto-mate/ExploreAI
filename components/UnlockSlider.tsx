import React, { useEffect, useRef, useCallback } from "react";
import {
  Animated,
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import ChevronLeft from "@/assets/svg/chevron-left.svg";

interface ChevronProps {
  animated: Animated.Value;
  inputRange: number[];
  outputRange: string[];
}

const Chevron: React.FC<ChevronProps> = ({
  animated,
  inputRange,
  outputRange,
}) => {
  const chevronColor = animated.interpolate({
    inputRange,
    outputRange,
  });

  return (
    <ChevronLeft
      width={30}
      height={30}
      marginLeft={-5}
      marginRight={-5}
      color="black"
    />
  );
};

interface UnlockSliderProps {
  onUnlock: () => void;
}

const SLIDER_WIDTH = 90;
const SLIDER_MARGIN = 10;

const UnlockSlider: React.FC<UnlockSliderProps> = ({ onUnlock }) => {
  const distance = useRef(0);
  const translationX = useRef(new Animated.Value(0)).current;
  const chevronColorAnim = useRef(new Animated.Value(0)).current;
  const backgroundColor = useRef(new Animated.Value(0)).current;

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width: layoutWidth } = event.nativeEvent.layout;
    distance.current = layoutWidth - SLIDER_WIDTH - SLIDER_MARGIN * 2;
  }, []);

  const shimmer = useCallback(() => {
    Animated.timing(chevronColorAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start(() => {
      chevronColorAnim.setValue(0);
      shimmer();
    });
  }, [chevronColorAnim]);

  useEffect(() => {
    shimmer();
  }, [shimmer]);

  const release = useCallback(() => {
    Animated.spring(translationX, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
    Animated.spring(backgroundColor, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  }, [translationX, backgroundColor]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0) {
          translationX.setValue(0);
          backgroundColor.setValue(0);
        } else if (gestureState.dx < -distance.current) {
          translationX.setValue(-distance.current);
          backgroundColor.setValue(1);
        } else {
          translationX.setValue(gestureState.dx);
          backgroundColor.setValue(gestureState.dx / -distance.current);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -distance.current) {
          onUnlock();
        } else {
          release();
        }
      },
    }),
  ).current;

  const interpolateBackgroundColor = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["#000", "#6a1dd9"],
  });

  return (
    <Animated.View
      className="w-full h-[88px] rounded-full justify-between flex-row items-center border-[1px] border-gray-300/50"
      style={{ backgroundColor: interpolateBackgroundColor }}
      onLayout={onLayout}
    >
      <Text className="text-white text-left ml-8 text-lg">Slide to unlock</Text>
      <Animated.View
        style={{
          transform: [{ translateX: translationX }],
          marginRight: SLIDER_MARGIN,
          width: SLIDER_WIDTH,
        }}
        {...panResponder.panHandlers}
        className={`bg-white h-[70%] rounded-full flex flex-row items-center justify-center`}
      >
        <Chevron
          animated={chevronColorAnim}
          inputRange={[0, 0.8, 1]}
          outputRange={["#000000", "#6a1dd9", "#000000"]}
        />
        <Chevron
          animated={chevronColorAnim}
          inputRange={[0, 0.6, 1.0]}
          outputRange={["#000000", "#6a1dd9", "#000000"]}
        />
        <Chevron
          animated={chevronColorAnim}
          inputRange={[0, 0.4, 1]}
          outputRange={["#000000", "#6a1dd9", "#000000"]}
        />
      </Animated.View>
    </Animated.View>
  );
};

export default UnlockSlider;
