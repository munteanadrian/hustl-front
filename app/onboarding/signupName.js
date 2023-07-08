import {
  Dimensions,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
} from "react-native";

import { useState, useEffect } from "react";
import Progress from "../../constants/progress";
import validate from "./../../utils/validateInput";
import { StatusBar } from "react-native";

const SignupName = ({ navigation }) => {
  const { height, width } = Dimensions.get("window");

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState([]);
  const onNameChange = (text) => {
    setName(text);
  };

  useEffect(() => {
    setNameError(validate("name", name));
  }, [name]);

  const goToNextScreen = async () => {
    navigation.navigate("onboarding/signupInterests", {
      name: name.trim(),
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, width: width }}
      className="bg-white pt-12"
    >
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View className="flex-col items-start justify-between">
          <Progress totalSteps={3} currentStep={1} />
          <View className="w-full flex-col pt-10 px-5">
            <Text className="text-2xl font-bold text-midnight pb-4">
              Let's build your profile
            </Text>
            <Text className="text-concrete pb-10">
              Tell us about yourself. This will help others get to know you too!
            </Text>

            <Text className="text-midnight font-semibold pb-2">First name</Text>
            <TextInput
              caretColor="#e74c3c"
              selectionColor="#e74c3c"
              className={`rounded-md px-4 py-2 text-base border border-clouds
               bg-white text-midnight z-20 ${
                 nameError.length > 0 && name !== ""
                   ? "border border-alizarin"
                   : ""
               }`}
              underlineColorAndroid="transparent"
              placeholder="Enter your name"
              placeholderTextColor="#bdc3c7"
              value={name}
              onChangeText={onNameChange}
              autoCapitalize="sentences"
              inputMode="text"
              autoComplete="name"
              importantForAutofill="yes"
              autoFocus={true}
            />
            {name === "" || nameError.length === 0 ? null : (
              <Text className="text-alizarin bg-alizarin/30 pt-3 pb-2 px-4 rounded-b-lg -mt-2 -z-10">
                {nameError[0]}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
      <View className="w-full items-center py-10 px-5">
        <TouchableOpacity
          className={`rounded-full w-full py-2 flex flex-row items-center justify-center ${
            nameError.length > 0 || name === ""
              ? "bg-alizarin/50"
              : "bg-alizarin"
          }`}
          onPress={goToNextScreen}
          disabled={nameError.length > 0 || name === ""}
        >
          <Text className="text-white text-base font-normal text-center">
            Next page
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignupName;
