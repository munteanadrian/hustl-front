import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useState } from "react";
import { Dimensions } from "react-native";
import { ToastAndroid } from "react-native";
import { Text, View, TouchableOpacity } from "react-native";
import ReactNativeModal from "react-native-modal";

const HorizontalCard = ({ card, navigation }) => {
  const { height, width } = Dimensions.get("window");

  const [popupIsOpen, setPopupIsOpen] = useState(false);

  const joinGroup = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log(card.id);

      const config = {
        method: "POST",
        url: `http://192.168.172.8:8080/api/membership/${card.id}`,
        headers: {
          ContentType: "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios(config);

      if (response.data.status === 200) {
        setPopupIsOpen(false);
        navigation.navigate("main/chats");
        ToastAndroid.show(
          "You have joined " + card.title + "!",
          ToastAndroid.SHORT
        );
      } else {
        console.log("error joining group");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableOpacity
      className="flex-1 rounded-lg py-5 my-1"
      style={{ backgroundColor: card.cardColor }}
      onPress={() => setPopupIsOpen(true)}
    >
      <ReactNativeModal
        isVisible={popupIsOpen}
        onBackdropPress={() => setPopupIsOpen(false)}
        onBackButtonPress={() => setPopupIsOpen(false)}
        hasBackdrop={true}
        backdropOpacity={0.4}
        deviceHeight={height}
        deviceWidth={width}
        style={{
          justifyContent: "flex-end",
          marginBottom: 0,
          alignItems: "center",
        }}
        backdropTransitionOutTiming={0}
        children={
          <View
            style={{
              backgroundColor: card.cardColor,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              width: width,
              height: height * 0.25,
            }}
          >
            <View className="flex-1 items-center justify-center">
              <Text className="font-semibold text-white text-3xl">
                {card.title}
              </Text>
              <Text className="text-white/80 tracking-wider font-semibold pb-5">
                {card.type}
              </Text>
              {card.description && card.description.length > 0 && (
                <Text className="text-white/80 tracking-wider font-semibold pb-5">
                  {card.description}
                </Text>
              )}
              <TouchableOpacity
                onPress={() => joinGroup()}
                className="items-center justify-center bg-white rounded-full py-2 mx-auto px-5"
                style={{ width: width * 0.5 }}
              >
                <Text className="font-semibold text-midnight text-lg">
                  Join
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      />

      <View className="absolute w-full h-screen bg-white/40 z-10" />
      <View className="flex-column items-start w-full px-5 z-20">
        <Text className="font-semibold text-midnight text-xl">
          {card.title}
        </Text>
        <View className="flex-col items-start justify-center">
          <Text className="text-white tracking-wider font-normal text-sm">
            {card.type}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Groups = ({ cards, navigation }) => {
  return (
    <View className="px-5">
      {cards.map((card) => (
        <HorizontalCard card={card} key={card.title} navigation={navigation} />
      ))}
    </View>
  );
};

export default Groups;
