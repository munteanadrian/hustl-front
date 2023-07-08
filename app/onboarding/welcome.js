import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { Video } from "expo-av";
import { useNavigation } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

const Welcome = () => {
  const navigation = useNavigation();
  const { width } = Dimensions.get("window");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        setIsAuthenticated(true);
        navigation.reset({
          index: 0,
          routes: [{ name: "main/home" }],
        });
      }
      console.log(isAuthenticated);
    };

    checkAuth();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, width: width }}>
      <StatusBar translucent={true} barStyle="light-content" />
      <View className="flex-1 items-center pt-10">
        <View className="bg-black/70 absolute top-0 left-0 right-0 bottom-0 z-20" />
        <Video
          source={require("./../../assets/onboarding/bg.mp4")}
          rate={1.0}
          isMuted={true}
          resizeMode="cover"
          shouldPlay
          isLooping
          style={{
            width: width,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: "absolute",
            zIndex: 10,
          }}
          usePoster
        />

        <View className="flex-1 items-left justify-start z-20 w-full px-10 pt-20">
          <Text className="text-white text-7xl font-bold">Ready.</Text>
          <Text className="text-white text-7xl font-bold">Set.</Text>
          <Text className="text-alizarin text-7xl font-bold">Hustl.</Text>
        </View>

        <View className="items-center justify-end z-20 pb-5">
          <TouchableOpacity
            style={{ width: width * 0.9 }}
            className="bg-alizarin rounded-full mb-2"
            onPress={() => {
              navigation.navigate("onboarding/signupName");
            }}
          >
            <Text className="text-white py-4 font-normal text-lg text-center">
              Create an account
            </Text>
          </TouchableOpacity>

          <View className="flex-row pt-2 pb-16 gap-x-2 items-center">
            <Text className="text-sm font-normal text-white">
              Already have an account?
            </Text>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate("onboarding/login");
              }}
            >
              <Text className="text-alizarin font-bold text-center">Login</Text>
            </TouchableOpacity>
          </View>

          <View className="absolute bottom-5">
            <Text className="text-concrete text-xs">Version 0.0.1</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
