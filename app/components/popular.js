import ImageOverlay from "react-native-image-overlay";
import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Card = ({ card }, onRefresh) => {
  const { height, width } = Dimensions.get("window");

  const [modalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  // join group
  const joinGroup = async () => {
    const token = await AsyncStorage.getItem("token");
    console.log(card.id);
    const config = {
      method: "POST",
      url: `http://192.168.0.73:8080/api/membership/${card.id}`, // save the id inside of the card
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios(config);

    if (response.data.status === 200) {
      toggleModal();
      onRefresh();
    } else {
      console.log("error joining group");
    }
  };

  return (
    <ImageOverlay
      source={card.image}
      containerStyle={{ flex: 1, width: width * 0.8, marginHorizontal: 5 }}
      rounded={10}
      overlayColor={card.cardColor}
    >
      <View style={{ flex: 1 }}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={toggleModal}
          statusBarTranslucent={true}
        >
          <TouchableWithoutFeedback onPress={toggleModal}>
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.7)",
              }}
              className="absolute top-0 left-0 w-full h-full"
            />
          </TouchableWithoutFeedback>
          <View
            style={{
              // marginHorizontal: 30,
              // marginVertical: 250,
              flex: 1,
            }}
            className="rounded-2xl overflow-hidden"
          >
            <ImageOverlay
              source={card.image}
              containerStyle={{
                flex: 1,
                width: "100%",
                height: "100%",
              }}
              overlayColor={card.cardColor}
            >
              <Text className="text-white text-4xl font-semibold pt-10">
                {card.title}
              </Text>
              <View className="flex-row gap-x-3">
                <Text className="text-white">{card.type}</Text>
                <Text className="text-white">|</Text>
                <Text className="text-white">{card.members} members</Text>
              </View>
            </ImageOverlay>

            <ScrollView
              contentContainerStyle={{
                alignItems: "center",
              }}
              className="bg-white"
            >
              <TouchableOpacity
                style={{
                  backgroundColor: card.cardColor,
                  width: width * 0.7,
                }}
                className={`my-5 py-3 rounded-lg`}
                onPress={joinGroup}
              >
                <Text className="text-center text-2xl font-semibold text-white">
                  Join community
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>

        <TouchableOpacity onPress={toggleModal}>
          <View
            style={{
              flex: 1,
              width: width * 0.8,
              height: height * 0.5,
              marginHorizontal: 5,
              borderRadius: 10,
            }}
            className="items-center justify-between p-5"
          >
            <Text className="text-white tracking-wider font-semibold">
              {card.type}
            </Text>
            <Text className="font-semibold text-white text-4xl">
              {card.title}
            </Text>
            <Text className="text-white">{card.members} members</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ImageOverlay>
  );
};

const Popular = ({ cards }) => {
  const { height, width } = Dimensions.get("window");

  return (
    <View className="py-5">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-semibold text-midnight">
          Popular communities
        </Text>
        <Text className="text-concrete font-semibold">See all</Text>
      </View>
      <FlatList
        data={cards}
        renderItem={({ item }) => <Card card={item} />}
        keyExtractor={(item) => item.title}
        horizontal={true}
        className="-ml-1 pt-4 relative"
        snapToAlignment={"center"}
        decelerationRate={"fast"}
        snapToInterval={width * 0.5 + 10}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default Popular;
