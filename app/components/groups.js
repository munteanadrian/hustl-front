import { FlatList } from "react-native";
import { Dimensions } from "react-native";
import { Text, View } from "react-native";

import ImageOverlay from "react-native-image-overlay";

const HorizontalCard = ({ card }) => {
  const { height, width } = Dimensions.get("window");

  return (
    <ImageOverlay
      source={card.image}
      containerStyle={{
        flex: 1,
        width: width * 0.9,
        height: height * 0.1,
        marginTop: 10,
      }}
      rounded={10}
    >
      <View className="flex-row items-center gap-x-4">
        <Text className="font-semibold text-white text-3xl">{card.title}</Text>
        <View className="flex-col items-start justify-center">
          <Text className="text-concrete tracking-wider font-semibold text-sm">
            {card.type}
          </Text>
          <Text className="text-concrete text-sm">{card.members} members</Text>
        </View>
      </View>
    </ImageOverlay>
  );
};

const Groups = () => {
  const { height, width } = Dimensions.get("window");
  const cards = [
    {
      title: "Group 1",
      type: "Finance",
      members: "104",
      image: require("./../../assets/nycBg.jpg"),
    },
    {
      title: "Group 2",
      type: "Finance",
      members: "104",
      image: require("./../../assets/nycBg.jpg"),
    },
    {
      title: "Group 3",
      type: "Finance",
      members: "104",
      image: require("./../../assets/nycBg.jpg"),
    },
    {
      title: "Group 4",
      type: "Finance",
      members: "104",
      image: require("./../../assets/nycBg.jpg"),
    },
    {
      title: "Group 5",
      type: "Finance",
      members: "104",
      image: require("./../../assets/nycBg.jpg"),
    },
  ];

  return (
    <View className="pt-5">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-semibold text-midnight">
          Communities
        </Text>
        <Text className="text-concrete font-semibold">See all</Text>
      </View>
      <FlatList
        data={cards}
        renderItem={({ item }) => <HorizontalCard card={item} />}
        keyExtractor={(item) => item.title}
        snapToAlignment={"center"}
        decelerationRate={"fast"}
        snapToInterval={width * 0.5 + 10}
      />
    </View>
  );
};

export default Groups;
