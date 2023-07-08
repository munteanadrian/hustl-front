import { SafeAreaView, View, TouchableOpacity, Text } from "react-native";

import IonIcon from "react-native-vector-icons/Ionicons";

const Navbar = ({ navigation, active }) => {
  return (
    <SafeAreaView className="w-screen">
      <View className="flex-row py-2 bg-white w-full">
        <TouchableOpacity
          onPress={() => navigation.navigate("main/home")}
          className="basis-1/4 items-center justify-center"
        >
          <IonIcon
            name={`${active == "explore" ? "compass" : "compass-outline"}`}
            size={25}
          />
          <Text
            className={`text-xs pt-1 text-center font-normal ${
              active === "explore"
                ? "text-midnight font-semibold"
                : "text-concrete"
            }`}
          >
            Explore
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("main/search")}
          className="basis-1/4 items-center justify-center"
        >
          <IonIcon
            name={`${active == "search" ? "search" : "search-outline"}`}
            size={25}
          />
          <Text
            className={`text-xs pt-1 text-center font-normal ${
              active === "search"
                ? "text-midnight font-semibold"
                : "text-concrete"
            }`}
          >
            Search
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("main/chats")}
          className="basis-1/4 flex-col items-center justify-center"
        >
          <IonIcon
            name={`${
              active == "chat"
                ? "md-chatbubble-ellipses-sharp"
                : "md-chatbubble-ellipses-outline"
            }`}
            size={25}
          />
          <Text
            className={`text-xs pt-1 text-center ${
              active === "chat"
                ? "text-midnight font-semibold"
                : "text-concrete"
            }`}
          >
            Chats
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("main/profile")}
          className="basis-1/4 items-center justify-center"
        >
          <IonIcon
            name={`${active == "profile" ? "person" : "person-outline"}`}
            size={25}
          />
          <Text
            className={`text-xs pt-1 text-center ${
              active === "profile"
                ? "text-midnight font-semibold"
                : "text-concrete"
            }`}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Navbar;
