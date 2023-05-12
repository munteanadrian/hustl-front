import { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView, Text, Dimensions, RefreshControl } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import Navbar from "./components/navbar";
import { ScrollView } from "react-native";
import Popular from "./components/popular";
import Groups from "./components/groups";

// TODO: Layout: images, icons (maybe remove profile and merge into settings but keep profile as icon), logo on top, person's info
// TODO: Fetch data from backend (maybe load 10 profiles and load 5 more every time 5 are swiped) - use Carousel
// TODO: Single navigation bar at the bottom shared between all screens instead of 4 different ones, remember current page (maybe use Context API)
// TODO: Send a post request every time a user swipes left or right - for optimization maybe fetch the current half-swipes, show a match or set the data and sent it asynchrounously in the background with the current progress: user loads 5-10 profiles and frontend knows if the people loaded swiped or not on the current user, if they did then it shows the match popup and every X seconds when it updates the next data it also sends the current progress to the backend

const MainScreen = () => {
  const router = useRouter();
  const { height, width } = Dimensions.get("window");
  const [name, setName] = useState("");

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      fetchData();
    }, 1000);
  }, []);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const options = {
        method: "GET",
        url: "http://192.168.194.8:8080/api/user/",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios(options);

      setName(response.data.name);

      console.log(token);
      console.log(name);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, width: width }} className="bg-white">
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 20,
          height: height * 0.85,
          width: width,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressViewOffset={20}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-3xl font-bol text-midnight pt-20">
          Welcome, <Text className="font-bold text-alizarin">{name}</Text>
        </Text>
        <Text className="tracking-wider leading-5 text-concrete">
          Lorem ipsum dolor sit amet consectetur elit.
        </Text>

        <Popular />
        <Groups />
      </ScrollView>

      <Navbar />
    </SafeAreaView>
  );
};

export default MainScreen;
