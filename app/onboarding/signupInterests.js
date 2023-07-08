import {
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
  View,
  Text,
} from "react-native";

import Progress from "../../constants/progress";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { StatusBar } from "react-native";
import axios from "axios";

const Interest = ({ name, selected, setSelected }) => {
  return (
    <TouchableOpacity
      className={`${
        selected ? "border-alizarin" : "border-midnight"
      } rounded-full px-4 py-1 border`}
      onPress={() => setSelected(!selected)}
    >
      <Text
        className={`${
          selected ? "text-alizarin font-semibold" : "text-midnight"
        }  text-base `}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const SignupInterests = ({ route, navigation }) => {
  const { width } = Dimensions.get("window");
  const { name } = route.params;

  const [interests, setInterests] = useState([]);

  const getInterests = async () => {
    try {
      const requestOptions = {
        method: "GET",
        url: "http://192.168.172.8:8080/api/category/",
      };

      await axios(requestOptions).then((response) => {
        const data = response.data;

        const interests = data.map((interest) => ({
          name: interest,
          selected: false,
        }));
        setInterests(interests);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInterests();
  }, []);

  const [selectedInterests, setSelectedInterests] = useState([]);

  const goToNextScreen = async () => {
    const selectedInterestsString = selectedInterests.join(",");

    navigation.navigate("onboarding/signupAuth", {
      name: name,
      interests: selectedInterestsString,
    });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, width: width }}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View className="bg-white flex-1 flex-col items-start pt-14 justify-between">
        <Progress totalSteps={3} currentStep={2} />
        <View className="flex-col items-start px-5">
          <View className="w-full flex-col gap-y-5 pt-10 pb-10">
            <Text className="text-concrete text-base">
              Alright, <Text className="text-alizarin">{name}</Text>
            </Text>
            <Text className="text-3xl font-bold text-midnight">
              What do you like?
            </Text>
            <Text className="text-concrete pb-4 text-base">
              Select some of your interests from below. This will help us find
              the best communities according to your liking!
            </Text>
          </View>
          <ScrollView
            contentContainerStyle={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              rowGap: 5,
              columnGap: 5,
            }}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            {interests.map((interest, index) => (
              <Interest
                key={index}
                name={interest.name}
                selected={interest.selected}
                setSelected={(selected) => {
                  let newInterests = [...interests];
                  newInterests[index].selected = selected;
                  setInterests(newInterests);
                  setSelectedInterests(
                    newInterests
                      .filter((interest) => interest.selected)
                      .map((interest) => interest.name)
                  );
                }}
              />
            ))}
          </ScrollView>
        </View>
      </View>
      <View className="w-screen bg-white px-5">
        <Text className="text-concrete text-base font-light text-center">
          You have selected {selectedInterests.length} interests
        </Text>
        <TouchableOpacity
          className="mx-auto w-full mb-10 mt-2 rounded-full bg-alizarin py-2"
          onPress={goToNextScreen}
        >
          <Text className="text-white font-normal text-base text-center">
            We're almost done
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignupInterests;
