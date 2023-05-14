import { Stack, useNavigation, Tabs } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

export const unstable_settings = {
  initialRouteName: "onboarding",
};

const Layout = () => {
  const navigation = useNavigation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    async function checkAuth() {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        setIsAuthenticated(true);
        navigation.reset({
          index: 0,
          routes: [{ name: "mainscreen" }],
        });
      }
    }

    checkAuth();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Tabs>
          <Tabs.Screen name="[chat]" />
          <Tabs.Screen name="chats" />
          <Tabs.Screen name="profile" />
          <Tabs.Screen name="mainscreen" />
        </Tabs>
      ) : (
        <>
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
        </>
      )}
    </Stack>
  );
};

export default Layout;
