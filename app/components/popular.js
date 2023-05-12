import { FlatList } from "react-native";
import { Dimensions } from "react-native";
import { View, Text } from "react-native";
import ImageOverlay from "react-native-image-overlay";

const Card = ({ card }) => {
  const { height, width } = Dimensions.get("window");

  return (
    <ImageOverlay
      source={card.image}
      containerStyle={{
        flex: 1,
        width: width * 0.5,
        height: height * 0.15,
        marginHorizontal: 5,
      }}
      rounded={10}
    >
      <Text className="font-semibold text-white text-2xl">{card.title}</Text>
      <Text className="text-concrete tracking-wider font-semibold text-sm">
        {card.type}
      </Text>
      <Text className="text-concrete text-sm">{card.members} members</Text>
    </ImageOverlay>
  );
};

const Popular = () => {
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
    <View className="py-5">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-semibold text-midnight">Popular</Text>
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
