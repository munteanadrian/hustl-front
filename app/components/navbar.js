import { SafeAreaView, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import IonIcon from "react-native-vector-icons/Ionicons";
import { Dimensions } from "react-native";

const Navbar = ({ active }) => {
  const router = useRouter();
  const { height, width } = Dimensions.get("window");

  return (
    <SafeAreaView style={{ width: width * 0.8 }} className="mx-auto">
      <View className="flex-row py-4 bg-white rounded-full absolute bottom-4 left-0 right-0">
        <TouchableOpacity
          onPress={() => router.replace("/mainscreen")}
          className="basis-1/4 items-center justify-center"
        >
          {active === "home" ? (
            <IonIcon name="home" size={25} />
          ) : (
            <IonIcon name="home-outline" size={25} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.replace("/explore")}
          className="basis-1/4 items-center justify-center"
        >
          {active === "explore" ? (
            <IonIcon name="compass" size={25} />
          ) : (
            <IonIcon name="compass-outline" size={25} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.replace("/chats")}
          className="basis-1/4 items-center justify-center"
        >
          {active === "chat" ? (
            <IonIcon name="md-chatbubble-ellipses-sharp" size={25} />
          ) : (
            <IonIcon name="md-chatbubble-ellipses-outline" size={25} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.replace("/profile")}
          className="basis-1/4 items-center justify-center"
        >
          {active === "profile" ? (
            <IonIcon name="person" size={25} />
          ) : (
            <IonIcon name="person-outline" size={25} />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Navbar;
