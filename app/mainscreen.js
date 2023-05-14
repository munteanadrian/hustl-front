import { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  Text,
  Dimensions,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
  View,
  TouchableOpacity,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import Navbar from "./components/navbar";
import Popular from "./components/popular";
import Groups from "./components/groups";
import Search from "./components/search";

import colors from "./../constants/colors";

const MainScreen = () => {
  const router = useRouter();
  const { height, width } = Dimensions.get("window");

  // Handle page refresh
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      fetchData();
    }, 1000);
  }, []);

  // #region Fetch data from backend (on refresh and on load)
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");

  const randomColor = () => {
    const keys = Object.keys(colors);
    return colors[keys[(keys.length * Math.random()) << 0]];
  };

  const [popular, setPopular] = useState([]);
  const [myCommunities, setMyCommunities] = useState([]);

  const deserializeCommunity = (data) => {
    const communities = [];

    data.forEach((community) => {
      communities.push({
        id: community.communityId,
        title: community.name,
        type: "TYPE",
        members: "TYPE",

        cardColor: randomColor(),
        image: require("./../assets/nycBg.jpg"),
      });
    });

    return communities;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");

      const profileRequestOptions = {
        method: "GET",
        url: "http://192.168.0.73:8080/api/user/",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const profileResponse = await axios(profileRequestOptions);
      setName(profileResponse.data.name);

      const popularRequestOptions = {
        method: "GET",
        url: "http://192.168.0.73:8080/api/community/",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const popularResponse = await axios(popularRequestOptions);
      setPopular(deserializeCommunity(popularResponse.data));

      const myRequestOptions = {
        method: "GET",
        url: "http://192.168.0.73:8080/api/membership/",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const myResponse = await axios(myRequestOptions);
      setMyCommunities(deserializeCommunity(myResponse.data));

      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  // #endregion

  const createCommunity = async () => {
    const token = await AsyncStorage.getItem("token");
    const config = {
      method: "POST",
      url: "http://192.168.0.73:8080/api/community/",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        name: "Comunitatea 2",
      },
    };
    const response = await axios(config);

    if (response.status === 200) {
      // join community too, create it with the current user in it on the backend
      // refresh
      onRefresh();
    } else {
      console.log("error creating community");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, width: width, backgroundColor: "#FFFFFF" }}>
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#e74c3c" />
          <Text className="text-center">Loading...</Text>
        </View>
      ) : (
        <ScrollView
          style={{
            flex: 1,
            paddingHorizontal: 20,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              progressViewOffset={10}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <Search />
          <Text className="text-3xl font-semibold text-midnight">
            Hello there, <Text className="font-bold text-alizarin">{name}</Text>
          </Text>
          <Text className="tracking-wider leading-8 text-concrete">
            Get ready to meet new people and make friends
          </Text>

          <TouchableOpacity
            className="bg-alizarin items-center justify-center mt-2 rounded-lg"
            onPress={() => createCommunity()}
          >
            <Text className="text-white py-4 text-lg font-semibold">
              Start a community
            </Text>
          </TouchableOpacity>

          <Popular cards={popular} refresh={onRefresh} />
          <Groups cards={myCommunities} />

          <View style={{ height: 100 }} />
        </ScrollView>
      )}

      {loading ? null : <Navbar active={"home"} />}
    </SafeAreaView>
  );
};

export default MainScreen;
