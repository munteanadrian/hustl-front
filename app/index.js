import { Redirect, SplashScreen } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function load() {
      await SplashScreen.preventAutoHideAsync();

      // check if authenticated
      const token = await AsyncStorage.getItem("token");

      if (token) {
        setIsAuthenticated(true);
      }

      setIsReady(true);
    }

    load();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <View onLayout={onLayoutRootView}>
      <DoubleTapToClose message="Tap again to exit app" />
      {isAuthenticated ? (
        <Redirect href="mainscreen" />
      ) : (
        <Redirect href="onboarding" />
      )}
    </View>
  );
}
