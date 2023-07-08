import {
  TextInput,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SelectList } from "react-native-dropdown-select-list";

const Create = ({ navigation }) => {
  const route = useRoute();
  const [createLoading, setCreateLoading] = useState(false);

  const [interests, setInterests] = useState([]);
  useEffect(() => {
    setInterests(route.params.interests);
  }, []);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const handleCreate = () => {
    setCreateLoading(true);

    const community = {
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
    };

    const create = async () => {
      const token = await AsyncStorage.getItem("token");

      try {
        const options = {
          method: "POST",
          url: "http://192.168.172.8:8080/api/community/",
          headers: {
            ContentType: "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: community,
        };
        const res = await axios(options);
        if (res.status === 201) {
          ToastAndroid.show(
            "Community " + community.name + " created!",
            ToastAndroid.SHORT
          );
          navigation.navigate("main/chats");
        } else {
          setNameError(true);
        }
      } catch (e) {
        console.log(e);
      }
    };

    create();
    setCreateLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View className="px-5 pb-5">
        <Text className="text-4xl text-midnight font-bold">
          Create a community
        </Text>
        <Text className="text-basis text-concrete">
          Create your own community, meet likeminded people!
        </Text>
      </View>
      {createLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View className="flex-1 px-5">
          <Text className="text-midnight text-basis font-semibold pb-2">
            Name your community
          </Text>
          <TextInput
            className="border w-full px-4 py-2 rounded-lg border-concrete bg-white"
            placeholder="Community's name"
            placeholderTextColor={"#A0AEC0"}
            value={name}
            onChangeText={(text) => setName(text)}
          />
          {name === "" || nameError === false ? null : (
            <Text className="text-alizarin bg-alizarin/30 pt-3 pb-2 px-4 rounded-b-lg -mt-2 -z-10">
              This community already exists!
            </Text>
          )}

          <Text className="text-midnight text-basis font-semibold pt-4 pb-2">
            Select a category
          </Text>
          <SelectList
            inputPlaceholder="Search for a category"
            inputPlaceholderColor="#A0AEC0"
            inputStyle={{
              borderWidth: 1,
              borderColor: "#E2E8F0",
              borderRadius: 8,
              padding: 10,
              backgroundColor: "#fff",
              color: "#000",
            }}
            itemStyle={{
              padding: 10,
              backgroundColor: "#fff",
              borderBottomWidth: 1,
              borderBottomColor: "#E2E8F0",
            }}
            selectedItemStyle={{
              padding: 10,
              backgroundColor: "#fff",
              borderBottomWidth: 1,
              borderBottomColor: "#E2E8F0",
            }}
            selectedItemTextStyle={{
              color: "#000",
            }}
            itemTextStyle={{
              color: "#000",
            }}
            itemsContainerStyle={{
              maxHeight: "140",
            }}
            data={interests}
            search={false}
            setSelected={(item) => setCategory(item)}
          />

          <Text className="text-midnight text-basis font-semibold pt-4 pb-2">
            A short description here
          </Text>
          <TextInput
            className="border w-full px-4 py-2 rounded-lg border-concrete bg-white"
            placeholder="Community's description"
            placeholderTextColor={"#A0AEC0"}
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
        </View>
      )}

      <View className="w-full px-5 py-5 flex-row items-center justify-around">
        <TouchableOpacity
          className="rounded-full bg-white py-2 basis-1/2"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-midnight text-center font-semibold text-lg">
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`rounded-full bg-midnight py-2 basis-1/2 ${
            createLoading || !category || !name ? "bg-emerald/50" : "bg-emerald"
          }`}
          onPress={() => handleCreate()}
          disabled={createLoading || !category || !name}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Create
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Create;
