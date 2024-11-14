import React, { useEffect, useRef, useCallback } from "react";
import {
  ActivityIndicator,
  Animated,
  LayoutChangeEvent,
  PanResponder,
  Text,
  ViewStyle,
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
const SPRING_CONFIG = {
  speed: 12,
  bounciness: 4,
  useNativeDriver: false,
};

const UnlockSlider: React.FC<UnlockSliderProps> = ({ onUnlock, isLoading }) => {
  const containerWidth = useRef(0);
  const isDragging = useRef(false);
  const translationX = useRef(new Animated.Value(0)).current;
  const backgroundColor = useRef(new Animated.Value(0)).current;
  const hasStartedLoading = useRef(false);

  const calculateDistance = useCallback(() => {
    return containerWidth.current - SLIDER_WIDTH - SLIDER_MARGIN * 2;
  }, []);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    containerWidth.current = event.nativeEvent.layout.width;
  }, []);

  useEffect(() => {
    if (isLoading) {
      hasStartedLoading.current = true;
    }
  }, [isLoading]);

  const animateToPosition = useCallback(
    (toValue: number, callback?: () => void) => {
      Animated.parallel([
        Animated.spring(translationX, {
          toValue,
          ...SPRING_CONFIG,
        }),
        Animated.spring(backgroundColor, {
          toValue: toValue / calculateDistance(),
          ...SPRING_CONFIG,
        }),
      ]).start(callback);
    },
    [translationX, backgroundColor],
  );

  const release = useCallback(() => {
    isDragging.current = false;
    animateToPosition(0);
  }, [animateToPosition]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isLoading,
      onMoveShouldSetPanResponder: () => !isLoading,

      onPanResponderGrant: () => {
        isDragging.current = true;
        // Ensure the animation is stopped when starting a new gesture
        translationX.stopAnimation();
        backgroundColor.stopAnimation();
      },

      onPanResponderMove: (_, gestureState) => {
        if (!isDragging.current) return;

        const maxDistance = calculateDistance();
        const newPosition = Math.max(0, Math.min(gestureState.dx, maxDistance));

        translationX.setValue(newPosition);
        backgroundColor.setValue(newPosition / maxDistance);
      },

      onPanResponderRelease: (_, gestureState) => {
        if (!isDragging.current) return;

        const maxDistance = calculateDistance();
        const threshold = maxDistance * 0.8; // 80% threshold for unlock

        if (gestureState.dx >= threshold) {
          animateToPosition(maxDistance, () => {
            if (isDragging.current) {
              onUnlock();
            }
          });
        } else {
          release();
        }
      },

      onPanResponderTerminate: () => {
        release();
      },
    }),
  ).current;

  const interpolateBackgroundColor = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["#111827", "#7c3aed"],
  });

  const sliderStyle: Animated.WithAnimatedValue<ViewStyle> = {
    transform: [{ translateX: translationX }],
    marginLeft: SLIDER_MARGIN,
    width: SLIDER_WIDTH,
  };

  return (
    <Animated.View
      className="w-full h-[75px] rounded-full justify-between flex-row items-center border-[1px] border-gray-300/50"
      style={{ backgroundColor: interpolateBackgroundColor }}
      onLayout={onLayout}
    >
      <Animated.View
        style={sliderStyle}
        {...panResponder.panHandlers}
        className="bg-white h-[70%] rounded-full flex flex-row items-center justify-center"
      >
        {hasStartedLoading.current ? (
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
