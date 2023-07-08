import { useState, useEffect, useCallback } from "react";
import {
  Dimensions,
  SafeAreaView,
  Text,
  ScrollView,
  RefreshControl,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import Navbar from "./navbar";
import { View } from "react-native";
import colors from "../../constants/colors";
import { TouchableOpacity } from "react-native";

const ChatCard = ({ navigation, community }) => {
  const randomColor = () => {
    const keys = Object.keys(colors);
    return colors[keys[(keys.length * Math.random()) << 0]];
  };

  return (
    <TouchableOpacity
      className="w-full py-3 border-b border-gray-100 flex flex-row items-center"
      style={{ borderBottomWidth: 1, borderColor: "#E5E5E5" }}
      onPress={() => {
        navigation.navigate("main/chat", { community: community });
      }}
    >
      <View
        className="w-12 h-12 rounded-full bg-midnight flex items-center justify-center"
        style={{ backgroundColor: randomColor() }}
      >
        <Text className="text-white text-2xl font-bold">
          {community.name[0]}
        </Text>
      </View>
      <View className="ml-4">
        <Text className="text-midnight text-lg font-bold">
          {community.name}
        </Text>
        <Text className="text-concrete text-sm font-regular">
          {community.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const Chats = ({ navigation }) => {
  const { height, width } = Dimensions.get("window");

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      fetchData();
    }, 1000);
  }, []);

  const [chats, setChats] = useState([]);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const options = {
        method: "GET",
        url: "http://192.168.172.8:8080/api/membership/",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios(options);

      if (response.data) {
        setChats(response.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        {chats.map((community) => (
          <ChatCard
            key={community.communityId}
            community={community}
            navigation={navigation}
          />
        ))}
      </ScrollView>

      <Navbar navigation={navigation} active="chat" />
    </SafeAreaView>
  );
};

export default Chats;
