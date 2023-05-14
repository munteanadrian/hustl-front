import { SafeAreaView, View, TextInput, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const Search = () => {
  return (
    <SafeAreaView style={{ flex: 1 }} className="pt-12 pb-7">
      <View
        style={{ flex: 1 }}
        className="bg-concrete/20 py-3 px-8 rounded-full flex-row items-center"
      >
        <TextInput
          style={{ width: "90%" }}
          placeholder="Search"
          className="text-black"
        />
        <TouchableOpacity className="mx-auto">
          <Icon name="search" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Search;
