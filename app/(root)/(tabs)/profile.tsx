import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";

const Profile = () => {
  const { user } = useUser();
  const { signOut } = useAuth();

  const onSignOutPress = async () => {
    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (err: any) {
      console.log("Error status:> " + err?.status || "");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView
        className="p-6"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text className="text-3xl font-bold mb-4 text-white">My Profile</Text>

        <View className="flex items-center justify-center my-5">
          <Image
            source={{
              uri: user?.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
            }}
            style={{ width: 110, height: 110, borderRadius: 110 / 2 }}
            className=" rounded-full h-[110px] w-[110px] border-[3px] border-white shadow-sm shadow-neutral-300"
          />
        </View>

        <View className="flex bg-gray-500/20 rounded-xl px-5 py-3">
          <InputField
            label="First name"
            placeholder={user?.firstName || "Not Found"}
            containerStyle="w-full"
            inputStyle="p-3.5"
            editable={false}
          />

          <InputField
            label="Last name"
            placeholder={user?.lastName || "Not Found"}
            containerStyle="w-full"
            inputStyle="p-3.5"
            editable={false}
          />

          <InputField
            label="Email"
            placeholder={user?.primaryEmailAddress?.emailAddress || "Not Found"}
            containerStyle="w-full"
            inputStyle="p-3.5"
            editable={false}
          />

          <InputField
            label="Phone"
            placeholder={user?.primaryPhoneNumber?.phoneNumber || "Not Found"}
            containerStyle="w-full"
            inputStyle="p-3.5"
            editable={false}
          />
        </View>

        {/* Sign out button */}
        <Pressable onPress={onSignOutPress} className="px-3">
          <Text className="text-red-500 text-center mt-5">Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
