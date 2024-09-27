import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

const Page = () => {
  const { isSignedIn } = useAuth();

  console.log("isSignedIn", isSignedIn);

  if (isSignedIn) return <Redirect href="/(root)/(tabs)/map" />;

  return <Redirect href="/(auth)/welcome" />;
};

export default Page;
