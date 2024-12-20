import { useSignUp } from "@clerk/clerk-expo";
import { useMutation } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { User, Lock, Mail } from "lucide-react-native";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";

import CheckIcon from "@/assets/check.png";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { images } from "@/constants/images";
import { UserProps } from "@/types";
import { fetchAPI } from "@/utils/fetch";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const mutationUser = useMutation({
    mutationFn: (data: UserProps) =>
      fetchAPI("/(api)/user", { method: "POST", body: JSON.stringify(data) }),
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.log(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };
  const onPressVerify = async () => {
    if (!isLoaded) return;
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (completeSignUp.status === "complete") {
        mutationUser.mutate({
          name: form.name,
          email: form.email,
          clerkId: completeSignUp.createdUserId,
        });

        await setActive({ session: completeSignUp.createdSessionId });
        setVerification({
          ...verification,
          state: "success",
        });
      } else {
        setVerification({
          ...verification,
          error: "Verification failed. Please try again.",
          state: "failed",
        });
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setVerification({
        ...verification,
        error: err.errors[0].longMessage,
        state: "failed",
      });
    }
  };
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
            label="Name"
            placeholder="Enter name"
            icon={<User color="#111827" size={20} />}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
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
            title="Sign Up"
            onPress={onSignUpPress}
            className="mt-6"
          />
          <OAuth />
          <Link href="/sign-in" className="text-center text-general-200 mt-8">
            <Text className="text-white">Already have an account? </Text>
            <Text className="text-violet-600">Log In</Text>
          </Link>
        </View>
        <ReactNativeModal
          isVisible={verification.state === "pending"}
          // onBackdropPress={() =>
          //   setVerification({ ...verification, state: "default" })
          // }
          onModalHide={() => {
            if (verification.state === "success") {
              setShowSuccessModal(true);
            }
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="font-extrabold text-2xl mb-2">Verification</Text>
            <Text className="mb-5">
              We've sent a verification code to {form.email}.
            </Text>
            <InputField
              label={"Code"}
              // icon={icons.lock}
              placeholder={"12345"}
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code) =>
                setVerification({ ...verification, code })
              }
            />
            {verification.error && (
              <Text className="text-red-500 text-sm mt-1">
                {verification.error}
              </Text>
            )}
            <CustomButton
              title="Verify Email"
              onPress={onPressVerify}
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal>
        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={CheckIcon}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl font-bold text-center">Verified</Text>
            <Text className="text-base text-gray-400 text-center mt-2">
              You have successfully verified your account.
            </Text>
            <CustomButton
              title="Browse Home"
              onPress={() => {
                router.push(`/(root)/(tabs)/map`);
                setShowSuccessModal(false);
              }}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};
export default SignUp;
