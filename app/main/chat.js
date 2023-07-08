import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SockJS from "sockjs-client";
import { over } from "stompjs";

const Message = ({ message, sentByMe }) => {
  return (
    <View
      className={`flex w-full mb-2 ${sentByMe ? "items-start" : "items-end"}`}
    >
      <View
        className={`w-5/6 py-2 px-4 rounded-t-xl ${
          sentByMe
            ? "bg-peterRiver rounded-br-xl"
            : "bg-nephritis rounded-bl-xl"
        }`}
      >
        <View className="flex-row items-center justify-between pb-1">
          <Text className="text-white text-base font-regular font-bold">
            {message.sender}
          </Text>
          <Text className="text-white text-base font-regular">
            {message.timestamp}
          </Text>
        </View>

        <Text className={`text-white text-base font-regular`}>
          {message.content}
        </Text>
      </View>
    </View>
  );
};

const Chat = ({ navigation }) => {
  const route = useRoute();
  const [community, setCommunity] = useState([]);
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);

  const stompRef = useRef(null);

  const dateFromMiliseconds = (timestamp) => {
    const date = new Date(parseInt(timestamp));

    const dateYear = date.getFullYear();
    const todayYear = new Date().getFullYear();

    const dateToday = date.getDate();

    const dateString = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      day: dateToday !== new Date().getDate() ? "numeric" : undefined,
      month: dateToday !== new Date().getDate() ? "long" : undefined,
      year: dateYear !== todayYear ? "numeric" : undefined,
    });

    return dateString;
  };

  const createMessage = ({ timestamp, sender, senderId, content }) => {
    const dateString = dateFromMiliseconds(timestamp);

    return {
      timestamp: dateString,
      senderId: senderId,
      sender: sender,
      content: content,
    };
  };

  const [loadingData, setLoadingData] = useState(false);
  useEffect(() => {
    setLoadingData(true);

    setCommunity(route.params.community);
    const getAsyncData = async () => {
      const tempName = await AsyncStorage.getItem("name");
      const tempUserId = await AsyncStorage.getItem("id");
      setUserId(tempUserId);
      setName(tempName);
    };
    getAsyncData();

    let webSocket = new SockJS("http://192.168.172.8:8080/api/ws");
    const stomp = over(webSocket);
    stomp.connect({}, onConnected, onError);
    stompRef.current = stomp;

    const getMessages = async () => {
      try {
        const communityId = route.params.community.communityId;
        const token = await AsyncStorage.getItem("token");

        const options = {
          method: "GET",
          url:
            "http://192.168.172.8:8080/api/community/" +
            communityId +
            "/messages",
          headers: {
            ContentType: "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios(options);

        let tempMessages = [];

        response.data.forEach((message) => {
          tempMessages.push(
            createMessage({
              timestamp: message.timestamp,
              senderId: message.sender.userId,
              sender: message.sender.name,
              content: message.content,
            })
          );
        });

        setMessages(tempMessages);
      } catch (e) {
        console.log(e);
      }
    };
    getMessages();

    setLoadingData(false);
  }, []);

  const onConnected = () => {
    stompRef.current.subscribe(
      "/topic/" + route.params.community.communityId,
      onMessageReceived
    );
  };

  const onError = (err) => {
    console.log(err);
  };

  const addMessage = (newMessage) => {
    setMessages((prevMessages) => [newMessage, ...prevMessages]);
  };

  const onMessageReceived = (response) => {
    try {
      const body = JSON.parse(response.body);

      const receivedTimestamp = body["body"]["timestamp"];
      const receivedSender = body["body"]["sender"];
      const receivedContent = body["body"]["content"];
      const receivedSenderId = body["body"]["senderId"];

      const message = createMessage({
        timestamp: receivedTimestamp,
        sender: receivedSender,
        senderId: receivedSenderId,
        content: receivedContent,
      });

      addMessage(message);
    } catch (e) {
      console.log(e);
    }
  };

  const sendMessage = (msg) => {
    const stomp = stompRef.current;

    const messageToSend = {
      groupId: community.communityId,
      userId: parseInt(userId),
      message: msg,
    };

    if (stomp && stomp.connected) {
      stomp.send(
        "/api/message/" + community.communityId,
        {},
        JSON.stringify(messageToSend)
      );

      const message = createMessage({
        timestamp: new Date().getTime().toString(),
        senderId: userId,
        sender: name,
        content: msg,
      });

      setText("");
    }
  };

  const [text, setText] = useState("");

  return (
    <SafeAreaView className="w-full flex-1 bg-white px-5">
      <Text className="text-4xl text-midnight font-bold">{community.name}</Text>
      {community.description && (
        <Text className="text-concrete text-basis font-regular">
          {community.description}
        </Text>
      )}
      {loadingMessages || loadingData ? (
        <View className="w-full h-full flex-row items-center justify-center">
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      ) : (
        <ScrollView className="mt-5">
          {messages.map((message) => (
            <Message
              key={Math.floor(Math.random() * 100000 + 1)}
              message={message}
              sentByMe={message.sender !== name}
            />
          ))}
        </ScrollView>
      )}
      <View className="w-full py-4 flex-row items-center relative">
        <TextInput
          className="w-full py-2 px-4 border border-concrete rounded-full"
          placeholder="Type a message..."
          placeholderTextColor="#BDBDBD"
          onChangeText={(text) => setText(text)}
          value={text}
          multiline={true}
          numberOfLines={1}
        />
        <TouchableOpacity
          className="bg-emerald items-center justify-center h-full px-8 rounded-full absolute right-0 top-4"
          onPress={() => sendMessage(text)}
        >
          <Text className="text-white font-bold">Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Chat;
