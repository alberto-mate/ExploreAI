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

interface ChevronProps {
  style: ViewStyle;
  animated: Animated.Value;
  inputRange: number[];
  outputRange: string[];
}

const Chevron: React.FC<ChevronProps> = ({
  style,
  animated,
  inputRange,
  outputRange,
}) => {
  const chevronColor = animated.interpolate({
    inputRange,
    outputRange,
  });

  return (
    <View style={style}>
      <Animated.View
        style={[styles.upperChevron, { backgroundColor: chevronColor }]}
      />
      <Animated.View
        style={[styles.lowerChevron, { backgroundColor: chevronColor }]}
      />
    </View>
  );
};

interface UnlockSliderProps {
  onUnlock: () => void;
}

const SLIDER_WIDTH = 92;
const SLIDER_MARGIN = 10;

const UnlockSlider: React.FC<UnlockSliderProps> = ({ onUnlock }) => {
  const distance = useRef(0);
  const translationX = useRef(new Animated.Value(0)).current;
  const chevronColorAnim = useRef(new Animated.Value(0)).current;

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
  }, [translationX]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0) {
          translationX.setValue(0);
        } else if (gestureState.dx < -distance.current) {
          translationX.setValue(-distance.current);
        } else {
          translationX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -distance.current) {
          onUnlock();
        }
        release();
      },
    }),
  ).current;

  return (
    <View
      className="flex bg-purple-500 w-full h-[88px] rounded-full justify-between flex-row items-center"
      onLayout={onLayout}
    >
      <Text className="text-white text-left ml-8 text-lg">Slide to unlock</Text>
      <Animated.View
        style={{
          transform: [{ translateX: translationX }],
          marginRight: SLIDER_MARGIN, // Set margin right directly using style
        }}
        {...panResponder.panHandlers}
        className={`bg-white w-[${SLIDER_WIDTH}px] h-[70%] rounded-full`}
      >
        <Chevron
          style={styles.chevron1}
          animated={chevronColorAnim}
          inputRange={[0, 0.8, 1]}
          outputRange={["#000000", "#6a1dd9", "#000000"]}
        />
        <Chevron
          style={styles.chevron2}
          animated={chevronColorAnim}
          inputRange={[0, 0.6, 1.0]}
          outputRange={["#000000", "#6a1dd9", "#000000"]}
        />
        <Chevron
          style={styles.chevron3}
          animated={chevronColorAnim}
          inputRange={[0, 0.4, 1]}
          outputRange={["#000000", "#6a1dd9", "#000000"]}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  slider: {},
  upperChevron: {
    height: 14,
    width: 3,
    borderRadius: 1,
    position: "absolute",
    top: 20,
    transform: [{ rotate: "35deg" }],
  },
  lowerChevron: {
    height: 14,
    width: 3,
    borderRadius: 1,
    position: "absolute",
    top: 30,
    transform: [{ rotate: "-35deg" }],
  },
  chevron1: { left: 25 },
  chevron2: { left: 43 },
  chevron3: { left: 61 },
});

export default UnlockSlider;
