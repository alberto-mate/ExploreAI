import { useSignIn } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { Lock, Mail, ArrowLeft } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { images } from "@/constants/images";

const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(root)/(tabs)/map");
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling for more info on error handling
        console.log(JSON.stringify(signInAttempt, null, 2));
        Alert.alert("Error", "Log in failed. Please try again.");
      }
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    }
  }, [isLoaded, form]);

  return (
    <ScrollView className="flex-1 bg-gray-900">
      <View className="flex-1">
        <View className="relative w-full h-[200px]">
          <Image source={images.stars} className="z-0 w-full h-[200px]" />
          <LinearGradient
            colors={["transparent", "#111827"]}
            className="absolute w-full h-[50%] bottom-0 overflow-hidden rounded-b-md"
          />
          <Text className="text-2xl text-white font-semibold absolute bottom-2 left-5">
            Create Your Account
          </Text>
          <View className="absolute top-12 left-5 flex flex-row justify-start items-center">
            {/* <Pressable onPress={() => router.back()} className="px-1 pb-1">
              <ArrowLeft color="white" size={24} className="" />
            </Pressable> */}
            <Image
              source={images.logo}
              className="w-[120px] h-[24px]"
              resizeMode="contain"
            />
          </View>
        </View>

        <View className="p-5">
          <InputField
            label="Email"
            placeholder="Enter email"
            icon={<Mail color="#111827" size={20} />}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />

          <InputField
            label="Password"
            placeholder="Enter password"
            icon={<Lock color="#111827" size={20} />}
            secureTextEntry={true}
            textContentType="password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          <CustomButton
            title="Sign In"
            onPress={onSignInPress}
            className="mt-6"
          />

          <OAuth />

          <Link href="/sign-up" className="text-center text-general-200 mt-8">
            <Text className="text-white">Don't have an account?</Text>
            <Text className="text-blue-500"> Sign Up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
