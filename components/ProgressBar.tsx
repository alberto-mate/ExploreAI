import React, { useEffect, useRef, useState } from "react";
import { View, Animated, Easing, Text, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type ProgressBarProps = {
  progress: number;
};

export default function ProgressBar({ progress }: ProgressBarProps) {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const [displayedProgress, setDisplayedProgress] = useState(0);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 1000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    const animatedNumber = new Animated.Value(0);
    Animated.timing(animatedNumber, {
      toValue: progress,
      duration: 1000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    animatedNumber.addListener(({ value }) => {
      setDisplayedProgress(Math.round(value));
    });

    return () => animatedNumber.removeAllListeners();
  }, [progress]);

  const bubbleWidth = 40;
  const animatedPosition = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: [0, barWidth - bubbleWidth],
    extrapolate: "clamp",
  });

  return (
    <View style={{ marginBottom: 16, paddingHorizontal: 10 }}>
      <View
        className="h-6 bg-gray-700 rounded-full overflow-hidden"
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setBarWidth(width);
        }}
      >
        <Animated.View
          style={{
            width: animatedWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
            height: "100%",
          }}
        >
          <LinearGradient
            colors={["#3b82f6", "#7c3aed"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.8, y: 0 }}
            style={{ width: "100%", height: "100%", justifyContent: "center" }}
          />
        </Animated.View>
        <Animated.View
          style={{
            position: "absolute",
            left: animatedPosition,
            top: 0,
            bottom: 0,
            justifyContent: "center",
          }}
        >
          <View
            className="h-6 bg-white rounded-full flex items-center justify-center"
            style={{ width: bubbleWidth }}
          >
            <Text style={{ color: "#000", fontWeight: "bold", fontSize: 12 }}>
              {displayedProgress}%
            </Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
