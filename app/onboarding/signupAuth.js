import {
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
  View,
  Text,
  TextInput,
} from "react-native";

import Progress from "../../constants/progress";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import validate from "../../utils/validateInput";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

import Icon from "react-native-vector-icons/Ionicons";

const SignupAuth = ({ route, navigation }) => {
  const { width } = Dimensions.get("window");
  const { name, interests } = route.params;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [emailError, setEmailError] = useState([]);
  const [passwordError, setPasswordError] = useState([]);
  const [passwordConfirmationError, setPasswordConfirmationError] = useState(
    []
  );

  const onEmailChange = (text) => {
    setEmail(text);
  };

  useEffect(() => {
    setEmailError(validate("email", email));
  }, [email]);

  const onPasswordChange = (text) => {
    setPassword(text);
  };

  useEffect(() => {
    setPasswordError(validate("password", password));
  }, [password]);

  const onPasswordConfirmationChange = (text) => {
    setPasswordConfirmation(text);
  };

  useEffect(() => {
    if (passwordConfirmation !== password) {
      setPasswordConfirmationError(["Passwords don't match"]);
    } else {
      setPasswordConfirmationError([]);
    }
  }, [passwordConfirmation]);

  const [data, setData] = useState({});
  const [error, setError] = useState({});

  const signup = async () => {
    const user = {
      name: name.trim(),
      email: email.trim().replace("@", "%40"),
      password: password,
      interests: interests,
    };

    const options = {
      method: "POST",
      url: "http://192.168.172.8:8080/api/auth/signup",
      headers: { "Content-Type": "application/json" },
      data: user,
    };

    const send = async () => {
      try {
        const response = await axios(options);
        setData(response.data);

        if (response.data) {
          const loginCredentials = {
            email: email.trim().replace("@", "%40"),
            password: password,
          };

          const loginOptions = {
            method: "POST",
            url: "http://192.168.172.8:8080/api/auth/login",
            headers: { "Content-Type": "application/json" },
            data: loginCredentials,
          };

          const loginResponse = await axios(loginOptions);
          await AsyncStorage.setItem("token", loginResponse.data.token);

          const profile = await axios({
            method: "GET",
            url: "http://192.168.172.8:8080/api/user/",
            headers: {
              Authorization: `Bearer ${loginResponse.data.token}`,
            },
          });
          await AsyncStorage.setItem("name", profile.data.name);
          await AsyncStorage.setItem("email", profile.data.email);

          const idString = profile.data.userId.toString();
          await AsyncStorage.setItem("id", idString);

          navigation.reset({
            index: 0,
            routes: [{ name: "main/home" }],
          });
        } else {
          setError(response.data);
          console.log(error);
        }
      } catch (error) {
        setEmailError(["Email already in use"]);
        setError(error);
      } finally {
      }
    };

    send();
  };

  const [hidePassword, setHidePassword] = useState(true);

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1, width: width }}
      className="bg-white pt-14"
    >
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <Progress totalSteps={3} currentStep={3} />
        <View className="w-full flex-col pt-10 px-5">
          <Text className="text-concrete text-base">
            One more thing, <Text className="text-alizarin">{name}</Text>
          </Text>
          <Text className="text-3xl font-bold pt-2 text-midnight">
            Some more info
          </Text>
          <Text className="text-concrete pb-8 text-base pt-2">
            Choose a password and an email address to complete your account.
          </Text>

          <Text className="font-semibold text-midnight pb-2">
            Email address
          </Text>
          <TextInput
            cursorColor="#e74c3c"
            selectionColor="#e74c3c"
            className={`rounded-md px-4 py-2 text-base border border-clouds
               bg-white text-midnight z-20 ${
                 emailError.length > 0 && email !== ""
                   ? "border border-alizarin"
                   : ""
               }`}
            underlineColorAndroid="transparent"
            placeholder="Enter your email"
            placeholderTextColor="#bdc3c7"
            value={email}
            onChangeText={onEmailChange}
            inputMode="email"
            autoComplete="email"
            importantForAutofill="yes"
            autoFocus={true}
          />
          {email === "" || emailError.length === 0 ? null : (
            <Text className="text-alizarin bg-alizarin/30 pt-3 pb-2 px-4 rounded-b-lg -mt-2 -z-10">
              {emailError[0]}
            </Text>
          )}

          <Text className="font-semibold text-midnight py-2">Password</Text>
          <View className="w-full relative">
            <TextInput
              caretColor="#e74c3c"
              selectionColor="#e74c3c"
              className={`rounded-md px-4 py-2 text-base border border-clouds
               bg-white text-midnight z-20 ${
                 passwordError.length > 0 && password !== ""
                   ? "border border-alizarin"
                   : ""
               }`}
              underlineColorAndroid="transparent"
              placeholder="Choose a password"
              placeholderTextColor="#bdc3c7"
              value={password}
              onChangeText={onPasswordChange}
              keyboardType="default"
              secureTextEntry={hidePassword}
              inputMode="text"
              autoComplete="password"
              importantForAutofill="yes"
            />
            <TouchableOpacity
              onPress={() => setHidePassword(!hidePassword)}
              className="absolute right-5 top-2.5 z-30"
            >
              {hidePassword ? (
                <Icon name="eye" size={24} color="#bdc3c7" />
              ) : (
                <Icon name="eye-off" size={24} color="#bdc3c7" />
              )}
            </TouchableOpacity>
          </View>
          {password === "" || passwordError.length === 0 ? null : (
            <Text className="text-alizarin bg-alizarin/30 pt-3 pb-2 px-4 rounded-b-lg -mt-2 -z-10">
              {passwordError[0]}
            </Text>
          )}

          <Text className="font-semibold text-midnight py-2">
            Confirm password
          </Text>
          <View className="w-full relative">
            <TextInput
              className={`rounded-md px-4 py-2 text-base border border-clouds
               bg-white text-midnight z-20 ${
                 passwordConfirmationError.length > 0 &&
                 passwordConfirmation !== ""
                   ? "border border-alizarin"
                   : ""
               }`}
              underlineColorAndroid="transparent"
              placeholder="Enter your password again"
              placeholderTextColor="#bdc3c7"
              value={passwordConfirmation}
              onChangeText={onPasswordConfirmationChange}
              keyboardType="default"
              secureTextEntry={hidePassword}
              inputMode="text"
              autoComplete="password"
              importantForAutofill="yes"
            />
            <TouchableOpacity
              onPress={() => setHidePassword(!hidePassword)}
              className="absolute right-5 top-2.5 z-30"
            >
              {hidePassword ? (
                <Icon name="eye" size={24} color="#bdc3c7" />
              ) : (
                <Icon name="eye-off" size={24} color="#bdc3c7" />
              )}
            </TouchableOpacity>
          </View>
          {passwordConfirmationError === "" ||
          passwordConfirmationError.length === 0 ? null : (
            <Text className="text-alizarin bg-alizarin/30 pt-3 pb-2 px-4 rounded-b-lg -mt-2 -z-10">
              {passwordConfirmationError[0]}
            </Text>
          )}

          <BouncyCheckbox
            className="text-midnight text-base font-normal py-4"
            text="I agree to the terms and conditions"
            fillColor="#e74c3c"
            unfillColor="#fff"
            iconStyle={{ borderColor: "#e74c3c", borderRadius: 4 }}
            textStyle={{ textDecorationLine: "none" }}
          />
        </View>
        <View className="w-screen px-5">
          <TouchableOpacity
            className={`mx-auto w-full my-10 rounded-full py-2 ${
              emailError.length > 0 ||
              passwordError.length > 0 ||
              passwordConfirmationError.length > 0 ||
              email === "" ||
              password === "" ||
              passwordConfirmation === ""
                ? "bg-alizarin/50"
                : "bg-alizarin"
            }`}
            disabled={
              emailError.length > 0 ||
              passwordError.length > 0 ||
              passwordConfirmationError.length > 0 ||
              email === "" ||
              password === "" ||
              passwordConfirmation === ""
            }
            onPress={signup}
          >
            <Text className="text-white font-normal text-base text-center">
              Join hustl
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default SignupAuth;
