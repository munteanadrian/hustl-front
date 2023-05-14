import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";

import ImageOverlay from "react-native-image-overlay";
import { useRouter } from "expo-router";

const HorizontalCard = ({ card }) => {
  const router = useRouter();

  const { height, width } = Dimensions.get("window");

  return (
    <TouchableOpacity
      className="flex-1"
      onPress={() => router.push("/" + card.id, { card })}
    >
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
          <Text className="font-semibold text-white text-3xl">
            {card.title}
          </Text>
          <View className="flex-col items-start justify-center">
            <Text className="text-concrete tracking-wider font-semibold text-sm">
              {card.type}
            </Text>
            <Text className="text-concrete text-sm">
              {card.members} members
            </Text>
          </View>
        </View>
      </ImageOverlay>
    </TouchableOpacity>
  );
};

const Groups = ({ cards }) => {
  const { height, width } = Dimensions.get("window");

  return (
    <View className="pt-5">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-semibold text-midnight">
          My communities
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
