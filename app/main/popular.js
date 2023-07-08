import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ReactNativeModal from "react-native-modal";
import { ToastAndroid } from "react-native";

const Card = ({ card, navigation }) => {
  const { height, width } = Dimensions.get("window");

  const [popupIsOpen, setPopupIsOpen] = useState(false);

  const joinGroup = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

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
    <View
      style={{
        flex: 1,
        backgroundColor: card.cardColor,
        borderRadius: 20,
        width: width * 0.8,
        marginHorizontal: 18,
      }}
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
              {card.description.length > 0 && (
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

      <TouchableOpacity onPress={() => setPopupIsOpen(true)}>
        <View
          style={{
            flex: 1,
            width: width * 0.8,
            height: height * 0.25,
          }}
          className="items-start justify-start p-5"
        >
          <Text className="font-semibold text-white text-3xl">
            {card.title}
          </Text>
          <Text className="text-white/80 tracking-wider font-semibold">
            {card.type}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const Popular = ({ cards, navigation }) => {
  const { height, width } = Dimensions.get("window");

  return (
    <View className="pb-5">
      <FlatList
        data={cards.slice(0, 10)}
        renderItem={({ item }) => <Card card={item} navigation={navigation} />}
        keyExtractor={(item) => item.title}
        horizontal={true}
        className="pt-4 relative"
        snapToInterval={width * 0.8 + 36}
        snapToAlignment={"start"}
        decelerationRate={"fast"}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default Popular;
