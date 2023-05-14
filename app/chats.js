import { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import {
  Dimensions,
  SafeAreaView,
  Text,
  ScrollView,
  RefreshControl,
  Image,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import Navbar from "./components/navbar";
import { View } from "react-native";

import { FlatList } from "react-native";

const ChatCard = ({ name, message }) => {
  const { height, width } = Dimensions.get("window");

  return (
    <View className="flex-row items-center justify-between py-4 border-b border-midnight/10">
      <View className="flex-row items-center justify-start">
        <Image
          source={require("../assets/profile.png")}
          style={{
            height: 40,
            width: 40,
            marginRight: 20,
          }}
          resizeMode="contain"
        />
        <View className="flex-column items-start gap-x-4 gap-y-1">
          <Text className="text-lg font-semibold text-midnight">{name}</Text>
          <Text className="text-lg text-concrete">{message}</Text>
        </View>
      </View>
      <View className="flex-column items-end gap-x-4 gap-y-1">
        <Text className="text-sm text-concrete">12:00 PM</Text>
        <Icon name="checkmark-done" size={20} color={"#3498db"} />
      </View>
    </View>
  );
};

const Chats = () => {
  const chats = [
    {
      name: "John Doe",
      message: "Hello",
    },
    {
      name: "John Does",
      message: "Hello",
    },
  ];

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
        url: "http://192.168.0.73:8080/api/user/",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios(options);

      if (response.data.name) {
        setName(response.data.name);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      router.replace("/onboarding");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, width: width, height: height * 0.85 }}
      className="bg-white"
    >
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 20,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressViewOffset={20}
          />
        }
      >
        <Text className="text-3xl font-bold text-midnight pt-20">Chats</Text>
        {/* Separator */}
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "#e5e5e5",
            marginTop: 20,
          }}
        />

        <FlatList
          data={chats}
          renderItem={({ item }) => (
            <ChatCard name={item.name} message={item.message} />
          )}
          keyExtractor={(item) => item.name}
          snapToAlignment={"center"}
          decelerationRate={"fast"}
          snapToInterval={width * 0.5 + 10}
        />
      </ScrollView>

      <Navbar />
    </SafeAreaView>
  );
};

export default Chats;
