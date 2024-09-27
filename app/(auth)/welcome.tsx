import { router } from "expo-router";
import { useRef, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

import CustomButton from "@/components/CustomButton";
import { images } from "@/constants/images";
import { onboarding } from "@/constants/onboarding";

const Home = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === onboarding.length - 1;

  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-gray-900">
      <Pressable
        onPress={() => {
          router.push("/(auth)/sign-up");
        }}
        className="w-full flex justify-between items-end p-5 flex-row items-center"
      >
        <Image
          source={images.logo}
          className="w-[120px] h-[24px]"
          resizeMode="contain"
        />
        <Text className="text-white text-md text-bold">Skip</Text>
      </Pressable>

      <Swiper
        ref={swiperRef}
        loop={false}
        dot={<View className="w-[32px] h-[4px] mx-1 bg-white rounded-full" />}
        activeDot={
          <View className="w-[32px] h-[4px] mx-1 bg-blue-500 rounded-full" />
        }
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboarding.map((item) => (
          <View key={item.id} className="flex items-center justify-center p-5">
            <Image
              source={item.image}
              className="w-full h-[300px]"
              resizeMode="contain"
            />
            <View className="flex flex-row items-center justify-center w-full mt-10">
              <Text className="text-white text-3xl font-bold mx-10 text-center">
                {item.title}
              </Text>
            </View>
            <Text className="text-md font-semibold text-center text-gray-300 mx-10 mt-3">
              {item.description}
            </Text>
          </View>
        ))}
      </Swiper>

      <CustomButton
        title={isLastSlide ? "Get Started" : "Next"}
        onPress={() =>
          isLastSlide
            ? router.push("/(auth)/sign-up")
            : swiperRef.current?.scrollBy(1)
        }
        className="w-11/12 mt-10 mb-5"
      />
    </SafeAreaView>
  );
};

export default Home;
