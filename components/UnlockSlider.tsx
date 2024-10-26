import React, { useEffect, useRef, useCallback } from "react";
import {
  ActivityIndicator,
  Animated,
  LayoutChangeEvent,
  PanResponder,
  Text,
} from "react-native";
import ChevronRight from "@/assets/svg/chevron-right.svg";

interface ChevronProps {}

const Chevron: React.FC<ChevronProps> = ({}) => {
  return (
    <ChevronRight
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
  isLoading: boolean;
}

const SLIDER_WIDTH = 90;
const SLIDER_MARGIN = 10;

const UnlockSlider: React.FC<UnlockSliderProps> = ({ onUnlock, isLoading }) => {
  const distance = useRef(0);
  const translationX = useRef(new Animated.Value(0)).current;
  const backgroundColor = useRef(new Animated.Value(0)).current;

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width: layoutWidth } = event.nativeEvent.layout;
    distance.current = layoutWidth - SLIDER_WIDTH - SLIDER_MARGIN * 2;
  }, []);

  // Prevent chevron aperture after loading and before dissapearing the main component
  const hasStartedLoading = useRef(false); // Track loading state

  useEffect(() => {
    if (isLoading) {
      hasStartedLoading.current = true; // Set to true when loading starts
    }
  }, [isLoading]);

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
        if (gestureState.dx < 0) {
          translationX.setValue(0);
          backgroundColor.setValue(0);
        } else if (gestureState.dx > distance.current) {
          translationX.setValue(distance.current);
          backgroundColor.setValue(1);
        } else {
          translationX.setValue(gestureState.dx);
          backgroundColor.setValue(gestureState.dx / distance.current);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > distance.current) {
          onUnlock();
        } else {
          release();
        }
      },
    }),
  ).current;

  const interpolateBackgroundColor = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["#111827", "#7c3aed"],
  });

  return (
    <Animated.View
      className="w-full h-[75px] rounded-full justify-between flex-row items-center border-[1px] border-gray-300/50"
      style={{ backgroundColor: interpolateBackgroundColor }}
      onLayout={onLayout}
    >
      <Animated.View
        style={{
          transform: [{ translateX: translationX }],
          marginLeft: SLIDER_MARGIN,
          width: SLIDER_WIDTH,
        }}
        {...panResponder.panHandlers}
        className={`bg-white h-[70%] rounded-full flex flex-row items-center justify-center`}
      >
        {hasStartedLoading.current ? ( // Use ref to control visibility
          <ActivityIndicator size="small" color="#7c3aed" />
        ) : (
          <>
            <Chevron />
            <Chevron />
            <Chevron />
          </>
        )}
      </Animated.View>
      <Text className="text-white text-left mr-8 text-lg -z-10">
        Slide to unlock
      </Text>
    </Animated.View>
  );
};

export default UnlockSlider;
