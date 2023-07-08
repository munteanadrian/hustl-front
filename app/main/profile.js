import { useState, useEffect } from "react";
import {
  Dimensions,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TextInput,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import Navbar from "./navbar";
import { View } from "react-native";

import MaterialIcon from "react-native-vector-icons/MaterialIcons";

const Profile = ({ navigation }) => {
  const { width } = Dimensions.get("window");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const getData = async () => {
      setName(await AsyncStorage.getItem("name"));
      setEmail(await AsyncStorage.getItem("email"));
    };

    getData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      navigation.reset({
        index: 0,
        routes: [{ name: "onboarding/welcome" }],
      });
    } catch (e) {
      console.log(e);
    }
  };

  const update = async ({ key, value }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const requestOptions = {
        method: "PUT",
        url: "http://192.168.172.8:8080/api/user/",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify({ key: key, value: value }),
      };

      const response = await axios(requestOptions);
      const responseStatus = response.status;

      if (responseStatus === 200) {
        setSuccess(true);
        setModifiedPopup(true);

        if (key === "name") {
          await AsyncStorage.setItem("name", value);
        } else if (key === "email") {
          await AsyncStorage.setItem("email", value);
        }

        handleLogout();
      } else {
        setSuccess(false);
        setModifiedPopup(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setModifiedPopup(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, [modifiedPopup]);

  const [deleteConfirmationPopup, setDeleteConfirmationPopup] = useState(false);
  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const requestOptions = {
        method: "DELETE",
        url: "http://192.168.172.8:8080/api/user/",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios(requestOptions);
      const data = response.data;

      await AsyncStorage.removeItem("token");
      navigation.reset({
        index: 0,
        routes: [{ name: "onboarding/welcome" }],
      });
    } catch (e) {
      console.log(e);
    }
  };

  const [infoPopup, setInfoPopup] = useState(true);
  const [warningPopup, setWarningPopup] = useState(true);

  const [success, setSuccess] = useState(false);
  const [modifiedPopup, setModifiedPopup] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, width: width }} className="bg-white">
      <View className="items-start px-5 w-full">
        <TextInput
          className="text-3xl font-bold text-midnight pt-4 w-full"
          value={name}
          onChangeText={(text) => {
            setName(text);
          }}
          onBlur={() => {
            update({ key: "name", value: name });
          }}
        />
        <TextInput
          className="text-xl text-concrete w-full pb-7 "
          value={email.replace("%40", "@")}
          onChangeText={(text) => {
            setEmail(text.replace("@", "%40"));
          }}
          onBlur={() => {
            update({ key: "email", value: email });
          }}
        />
      </View>

      {modifiedPopup && (
        <View className="items-center w-full pb-2 px-5">
          <View
            className={`${
              success ? "bg-emerald" : "bg-alizarin"
            } px-4 w-full rounded-lg py-4 flex-row items-center justify-between`}
          >
            <Text className="text-base text-white">
              {success ? "Modified successfully!" : "Something went wrong!"}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setModifiedPopup(false);
              }}
            >
              <MaterialIcon name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {infoPopup && (
        <View className="items-center w-full pb-2 px-5">
          <View className="bg-emerald w-full px-4 rounded-lg py-4 flex-row items-center justify-between">
            <Text className="text-base text-white">
              Change your info? Tap on it!
            </Text>
            <TouchableOpacity
              onPress={() => {
                setInfoPopup(false);
              }}
            >
              <MaterialIcon name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {warningPopup && (
        <View className="items-center w-full pb-2 px-5">
          <View className="bg-pomegranate px-4 rounded-lg py-4 flex-row items-center justify-between w-full">
            <Text className="text-base text-white">
              You will have to log in again.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setWarningPopup(false);
              }}
            >
              <MaterialIcon name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView
        style={{
          flex: 1,
        }}
        className="px-5 relative"
      >
        <Text className="text-lg font-medium text-midnight pt-5">Actions</Text>

        <View className="border-b border-concrete/50 my-2" />

        <TouchableOpacity
          className="my-1 flex-row items-center gap-x-2"
          onPress={() => handleLogout()}
        >
          <MaterialIcon name="logout" size={20} color="#2c3e50" />
          <Text className="text-lg text-midnight">Log out</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="my-1 flex-row items-center gap-x-2"
          onPress={() => {
            setDeleteConfirmationPopup(true);
          }}
        >
          <Modal
            visible={deleteConfirmationPopup}
            animationType="fade"
            className="h-screen w-screen relative"
            onRequestClose={() => setDeleteConfirmationPopup(false)}
          >
            <TouchableOpacity
              className="bg-black/10 absolute top-0 left-0 w-full h-full -z-10"
              onPress={() => setDeleteConfirmationPopup(false)}
            />

            <View className="bg-white flex items-center justify-center z-0 pt-4 px-2">
              <Text className="text-2xl font-bold text-midnight">
                Delete account
              </Text>
              <Text className="text-base text-concrete pt-2">
                Are you sure you want to delete your account?
              </Text>
              <View className="flex-row items-center gap-x-4 py-4">
                <TouchableOpacity
                  className="my-1"
                  onPress={() => setDeleteConfirmationPopup(false)}
                >
                  <Text className="text-lg text-white bg-alizarin px-2 py-1 rounded-lg">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="my-1"
                  onPress={() => {
                    setDeleteConfirmationPopup(false);
                    handleDelete();
                  }}
                >
                  <Text className="text-lg text-midnight">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <MaterialIcon name="delete" size={20} color="#2c3e50" />
          <Text className="text-lg text-midnight">Delete account</Text>
        </TouchableOpacity>
      </ScrollView>

      <Navbar navigation={navigation} active={"profile"} />
    </SafeAreaView>
  );
};

export default Profile;
