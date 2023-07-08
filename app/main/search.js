import { Text, TextInput } from "react-native";
import { View } from "react-native";
import Navbar from "./navbar";
import { ScrollView } from "react-native";
import { ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import colors from "../../constants/colors";
import Groups from "./groups";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { SafeAreaView } from "react-native";
import { RefreshControl } from "react-native";

const Search = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [communities, setCommunities] = useState([]);

  const getData = async () => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      const allOptions = {
        method: "GET",
        url: "http://192.168.172.8:8080/api/community/",
        headers: {
          ContentType: "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const allResponse = await axios(allOptions);
      setCommunities(deserializeCommunity(allResponse.data));
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  };

  const randomColor = () => {
    const keys = Object.keys(colors);
    return colors[keys[(keys.length * Math.random()) << 0]];
  };

  useEffect(() => {
    getData();
  }, []);

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

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState(communities);

  useEffect(() => {
    const filteredCommunities = communities.filter((community) => {
      return community.title.toLowerCase().includes(search.toLowerCase());
    });

    if (search === "" || search === null) {
      setSearchResults(communities);
    } else {
      setSearchResults(filteredCommunities);
    }
  }, [search]);

  const refresh = async () => {
    try {
      getData();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <RefreshControl refreshing={loading} onRefresh={refresh} enabled={true} />

      <View className="w-full px-5">
        <Text className="text-4xl text-midnight font-bold">Search</Text>
        <Text className="text-basis text-concrete font-regular">
          Search for communities to join. You can search by name or category.
        </Text>
        <TextInput
          className="w-full border border-concrete py-2 px-4 rounded-lg my-4"
          placeholder="Search anything..."
          placeholderColor="#A0AEC0"
          value={search}
          onChangeText={(text) => {
            setSearch(text);
          }}
        />
      </View>
      <ScrollView className="w-full flex-1">
        {loading ? (
          <View className="flex-1 py-10">
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : searchResults.length === 0 ? (
          <View className="flex-1 py-10">
            <Text className="text-center text-midnight text-2xl font-bold">
              No results found
            </Text>
          </View>
        ) : (
          <Groups cards={searchResults} navigation={navigation} />
        )}
      </ScrollView>
      <Navbar navigation={navigation} active="search" />
    </SafeAreaView>
  );
};

export default Search;
