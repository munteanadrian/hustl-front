import { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  Text,
  Dimensions,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import Navbar from "./navbar";
import Popular from "./popular";
import Groups from "./groups";

import colors from "../../constants/colors";

const Home = ({ navigation }) => {
  // home page
  // don't display communities that user is already in
  // style the recommended communities
  // add refresh control to get the data again
  // clicking on a community will open a new dynamic page instead of a modal, joining will take you to the chat page
  // improve create community to handle all searches

  // profile
  // add profile image
  // add some random pages like "app info" and "version" and "terms and conditions" and "privacy policy"
  // create a contact form that sends an email to the developer
  // add more info to each profile - photo, gender, date of birth, location, bio

  // search
  // search bar, live search as you type
  // search a community name
  // add sort and filter
  // display search results as tiles

  const { width } = Dimensions.get("window");

  const [name, setName] = useState([]);
  const [popularCommunities, setPopularCommunities] = useState([]);
  const [recommendedCommunities, setRecommendedCommunities] = useState([]);
  // const [allCommunities, setAllCommunities] = useState([]);

  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(true);

  const [interests, setInterests] = useState([]);

  const getData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const tempName = await AsyncStorage.getItem("name");
      setName(tempName);

      const popularOptions = {
        method: "GET",
        url: "http://192.168.172.8:8080/api/community/popular",
        headers: {
          ContentType: "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const popularResponse = await axios(popularOptions);
      setPopularCommunities(deserializeCommunity(popularResponse.data));
      setLoadingPopular(false);

      const recommendedOptions = {
        method: "GET",
        url: "http://192.168.172.8:8080/api/user/recommendations",
        headers: {
          ContentType: "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const recommendedResponse = await axios(recommendedOptions);
      setRecommendedCommunities(deserializeCommunity(recommendedResponse.data));
      setLoadingRecommended(false);

      const interestsOptions = {
        method: "GET",
        url: "http://192.168.172.8:8080/api/category/",
        headers: {
          ContentType: "application/json",
        },
      };
      const interestsResponse = await axios(interestsOptions);
      setInterests(interestsResponse.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const refresh = async () => {
    try {
      getData();
    } catch (e) {
      console.log(e);
    }
  };

  const randomColor = () => {
    const keys = Object.keys(colors);
    return colors[keys[(keys.length * Math.random()) << 0]];
  };

  const deserializeCommunity = (data) => {
    const communities = [];

    data.forEach((community) => {
      communities.push({
        id: community.communityId,
        title: community.name,
        type: community.category,
        description: community.description,
        cardColor: randomColor(),
      });
    });

    return communities;
  };

  return (
    <SafeAreaView style={{ flex: 1, width: width, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        style={{
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
        className="pt-10"
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-4xl font-semibold text-midnight pt-5 px-5">
            Hi, <Text className="font-bold text-alizarin">{name}</Text>
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("main/create", { interests: interests })
            }
            className="px-5 pt-5"
          >
            <Text className="text-3xl font-semibold bg-alizarin text-white rounded-full items-center justify-center px-3">
              +
            </Text>
          </TouchableOpacity>
        </View>
        <Text className="tracking-wider leading-8 text-concrete px-5 py-2">
          Get ready to meet new people and make friends
        </Text>

        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-semibold text-midnight px-5 pt-4">
            Popular
          </Text>
          <Text className="text-concrete font-semibold px-5">See all</Text>
        </View>
        {loadingPopular ? (
          <View className="flex-1 py-10">
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <Popular
            cards={popularCommunities.slice(0, 20)}
            navigation={navigation}
          />
        )}

        <View className="flex-row items-center justify-between px-5 pb-5">
          <Text className="text-2xl font-semibold text-midnight">
            Recommended
          </Text>
          <Text className="text-concrete font-semibold">See all</Text>
        </View>
        {loadingRecommended ? (
          <View className="flex-1 py-10">
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <Groups
            cards={recommendedCommunities.slice(0, 50)}
            navigation={navigation}
          />
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
      <Navbar navigation={navigation} active="explore" />
    </SafeAreaView>
  );
};

export default Home;
