import { SafeAreaView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import Icon from "react-native-vector-icons/Entypo";
import IonIcon from "react-native-vector-icons/Ionicons";
import { Dimensions } from "react-native";

const Navbar = () => {
  const router = useRouter();
  const { height, width } = Dimensions.get("window");

  return (
    <SafeAreaView
      style={{
        flexDirection: "row",
        paddingVertical: 20,
      }}
    >
      <TouchableOpacity
        onPress={() => router.replace("/mainscreen")}
        className="basis-1/3 items-center justify-center"
      >
        <Icon name="home" size={25} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.replace("/chats")}
        className="basis-1/3 items-center justify-center"
      >
        <IonIcon name="md-chatbubble-ellipses-sharp" size={25} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.replace("/profile")}
        className="basis-1/3 items-center justify-center"
      >
        <IonIcon name="person" size={25} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Navbar;
