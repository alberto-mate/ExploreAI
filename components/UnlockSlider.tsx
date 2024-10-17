import React from "react";
import { View, Text, Animated, PanResponder } from "react-native";
import { useState, useRef } from "react";

interface UnlockSliderProps {
  onUnlock: () => void;
}

const UnlockSlider: React.FC<UnlockSliderProps> = ({ onUnlock }) => {
  const [sliderActivated, setSliderActivated] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Constrain sliding within the slider width
        if (gestureState.dx >= 0 && gestureState.dx <= 250) {
          slideAnim.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 180) {
          setSliderActivated(true);
          onUnlock();
        } else {
          // Reset the slider if it's not far enough
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  // Check if the user is inside the landmark and if it's still locked

  // If user is not inside or the slider is activated, don't render
  if (sliderActivated) return null;

  return (
    <View className="flex items-center justify-center mt-8">
      <View className="w-64 h-16 bg-gray-900 rounded-full overflow-hidden border border-gray-700 relative">
        <Text className="absolute text-white font-semibold text-lg text-center h-full leading-16">
          Slide to Unlock
        </Text>

        {/* Slider button */}
        <Animated.View
          {...panResponder.panHandlers}
          style={{
            transform: [{ translateX: slideAnim }],
          }}
          className="w-14 h-14 bg-purple-500 rounded-full absolute top-1 left-1 shadow-md"
        />
      </View>
    </View>
  );
};

export default UnlockSlider;
