import { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import {
  Dimensions,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Image,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import Navbar from "./components/navbar";
import { View } from "react-native";

import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import EntypoIcon from "react-native-vector-icons/Entypo";
import FeatherIcon from "react-native-vector-icons/Feather";

const Profile = () => {
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
      <View className="flex-col justify-between items-center pb-10">
        <Image
          style={{
            height: height * 0.1,
            marginTop: 60,
          }}
          resizeMode="contain"
          source={require("../assets/profile.png")}
        />
        <Text className="text-3xl font-bold text-midnight pt-5">{name}</Text>
        <Text className="text-lg text-concrete">@adrianmuntean</Text>
      </View>

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
        {/* Profile */}

        <Text className="text-xl font-medium text-midnight">Profile</Text>

        <View className="border-b border-concrete/50 my-2" />

        <TouchableOpacity className="my-1">
          <Text className="text-lg text-midnight">Edit profile</Text>
        </TouchableOpacity>
        <TouchableOpacity className="my-1">
          <Text className="text-lg text-midnight">Change email</Text>
        </TouchableOpacity>
        <TouchableOpacity className="my-1">
          <Text className="text-lg text-midnight">Change email</Text>
        </TouchableOpacity>
        <TouchableOpacity className="my-1">
          <Text className="text-lg text-midnight">Change email</Text>
        </TouchableOpacity>
        <TouchableOpacity className="my-1">
          <Text className="text-lg text-midnight">Change email</Text>
        </TouchableOpacity>

        {/* App info */}

        <Text className="text-xl font-medium text-midnight pt-10">
          App information
        </Text>

        <View className="border-b border-concrete/50 my-2" />

        <TouchableOpacity className="my-1 flex-row items-center gap-x-2">
          <FeatherIcon name="check" size={20} color="#2c3e50" />
          <Text className="text-lg text-midnight">Terms and Conditions</Text>
        </TouchableOpacity>

        <TouchableOpacity className="my-1 flex-row items-center gap-x-2">
          <FeatherIcon name="info" size={20} color="#2c3e50" />
          <Text className="text-lg text-midnight">Version details</Text>
        </TouchableOpacity>

        <TouchableOpacity className="my-1 flex-row items-center gap-x-2">
          <EntypoIcon name="help" size={20} color="#2c3e50" />
          <Text className="text-lg text-midnight">Support</Text>
        </TouchableOpacity>

        <TouchableOpacity className="my-1 flex-row items-center gap-x-2">
          <EntypoIcon name="plus" size={20} color="#2c3e50" />
          <Text className="text-lg text-midnight">Suggest a feature</Text>
        </TouchableOpacity>

        {/* Actions */}

        <Text className="text-xl font-medium text-midnight pt-10">Actions</Text>

        <View className="border-b border-concrete/50 my-2" />

        <TouchableOpacity
          className="my-1 flex-row items-center gap-x-2"
          onPress={() => handleLogout()}
        >
          <MaterialIcon name="logout" size={20} color="#2c3e50" />
          <Text className="text-lg text-midnight">Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity className="my-1 flex-row items-center gap-x-2">
          <MaterialIcon name="delete" size={20} color="#2c3e50" />
          <Text className="text-lg text-midnight">Delete account</Text>
        </TouchableOpacity>
      </ScrollView>

      <Navbar />
    </SafeAreaView>
  );
};

export default Profile;
