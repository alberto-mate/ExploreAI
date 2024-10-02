import { useOAuth } from "@clerk/clerk-expo";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert, Image, Text, View } from "react-native";

import GoogleIcon from "@/assets/google.png";
import CustomButton from "@/components/CustomButton";
import { UserProps } from "@/types";
import { googleOAuth } from "@/utils/auth";
import { fetchAPI } from "@/utils/fetch";

const OAuth = () => {
  const mutationUser = useMutation({
    mutationFn: (data: UserProps) =>
      fetchAPI("/(api)/user", { method: "POST", body: JSON.stringify(data) }),
  });
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const handleGoogleSignIn = async () => {
    const result = await googleOAuth(startOAuthFlow, mutationUser.mutate);

    if (result.code === "session_exists") {
      Alert.alert("Success", "Session exists. Redirecting to home screen.");
      router.replace("/(root)/(tabs)/map");
    }

    Alert.alert(result.success ? "Success" : "Error", result.message);
    if (result.success) {
      router.replace("/(root)/(tabs)/map");
    }
  };

  return (
    <View>
      <View className="flex flex-row justify-center items-center mt-2 gap-x-3">
        <View className="flex-1 h-[1px] bg-gray-100" />
        <Text className="text-lg text-white">Or</Text>
        <View className="flex-1 h-[1px] bg-gray-100" />
      </View>

      <CustomButton
        title="Log In with Google"
        className="mt-2 w-full shadow-none"
        IconLeft={() => (
          <Image
            source={GoogleIcon}
            resizeMode="contain"
            className="w-5 h-5 mx-2"
          />
        )}
        bgVariant="outline"
        textVariant="primary"
        onPress={handleGoogleSignIn}
      />
    </View>
  );
};

export default OAuth;
