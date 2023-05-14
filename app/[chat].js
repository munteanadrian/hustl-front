import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";

const Message = () => {
  return (
    <View className="w-full">
      <Text className="bg-alizarin text-lg my-2 mx-2 rounded-lg py-2 px-4 text-white">
        Message
      </Text>
    </View>
  );
};

const Chat = () => {
  const [community, setCommunity] = useState({});
  const [messages, setMessages] = useState([]);

  // getting the params
  const route = useRoute();
  const communityId = route.params.chat;

  const fetchCurrentCommunity = async () => {
    const token = await AsyncStorage.getItem("token");
    const config = {
      method: "GET",
      url: `http://192.168.0.73:8080/api/community/${communityId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios(config);
    setCommunity(response.data);
    setMessages(response.data.messages);
  };

  useEffect(() => {
    fetchCurrentCommunity();
  }, []);

  console.log(community);
  // getting the params

  const [message, setMessage] = useState("");
  const onSubmit = async () => {
    const token = await AsyncStorage.getItem("token");
    const config = {
      method: "POST",
      url: `http://192.168.0.73:8080/api/...`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: message,
    };
    const response = await axios(config);
    // setMessages([...messages, response.data]);
  };

  const { height, width } = Dimensions.get("window");
  return (
    <SafeAreaView style={{ flex: 1, width: width, backgroundColor: "#FFFFFF" }}>
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text className="pt-14 pb-7 bg-alizarin w-full text-center text-white font-semibold text-2xl">
          {community.name}
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        {messages.length > 0 ? (
          messages.map((message) => {
            return <Message />;
          })
        ) : (
          <View className="flex items-center justify-center w-full">
            <Icon name="person" size={50} color="#000000" />
            <Text className="pt-2 font-semibold text-2xl">No messages yet</Text>
          </View>
        )}
      </ScrollView>
      <View className="flex-row items-center justify-between w-full px-4 pb-2">
        <TextInput
          className="flex-1 bg-concrete/20 rounded-lg px-4 py-2"
          placeholder="Type your message here..."
          onChangeText={(text) => setMessage(text)}
          value={message}
        />
        <TouchableOpacity onPress={() => onSubmit()}>
          <Text className="flex-1 bg-alizarin text-lg mx-2 rounded-lg py-2 px-4 text-white">
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Chat;
