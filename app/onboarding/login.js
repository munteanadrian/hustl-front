import {
  ScrollView,
  Text,
  Dimensions,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { StatusBar } from "react-native";
import { useState } from "react";

import Icon from "react-native-vector-icons/Ionicons";

const Login = ({ navigation }) => {
  const { width } = Dimensions.get("window");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onEmailChange = (text) => {
    setEmail(text);
  };

  const onPasswordChange = (text) => {
    setPassword(text);
  };

  const [data, setData] = useState([]);
  const [error, setError] = useState([]);
  const [invalidCredentials, setInvalidCredentials] = useState(false);

  const login = async () => {
    const data = {
      email: email.trim().replace("@", "%40"),
      password: password,
    };

    const logionRequestOptions = {
      method: "POST",
      url: "http://192.168.172.8:8080/api/auth/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    const fetch = async () => {
      try {
        const response = await axios(logionRequestOptions);
        setData(response.data);

        if (response.data.token) {
          await AsyncStorage.setItem("token", response.data.token);

          const profile = await axios({
            method: "GET",
            url: "http://192.168.172.8:8080/api/user/",
            headers: {
              Authorization: `Bearer ${response.data.token}`,
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
        }
      } catch (error) {
        console.log(error);
        setInvalidCredentials(true);
      } finally {
        // setLoading(false);
      }
    };

    fetch();
  };

  const [hidePassword, setHidePassword] = useState(true);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, width: width }}
      className="bg-white"
    >
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ flex: 1 }} className="pt-20 px-5">
        <Text className="text-4xl text-midnight font-bold">Welcome back!</Text>
        <Text className="text-concrete text-base pt-2">
          Please enter your details below to continue
        </Text>

        <View className="mt-10 pb-4">
          <Text className="font-semibold text-midnight pb-2">
            Email address
          </Text>
          <TextInput
            caretColor="#e74c3c"
            selectionColor="#e74c3c"
            className={`rounded-md px-4 py-2 text-base border 
               bg-white text-midnight z-20 ${
                 invalidCredentials ? "border-alizarin" : "border-clouds"
               }`}
            underlineColorAndroid="transparent"
            placeholder="Enter your email"
            placeholderTextColor="#bdc3c7"
            value={email}
            onChangeText={onEmailChange}
            keyboardType="email-address"
            autoFocus={true}
            inputMode="email"
            autoComplete="email"
            importantForAutofill="yes"
          />

          <Text className="font-semibold text-midnight py-2">Password</Text>
          <View className="w-full relative">
            <TextInput
              caretColor="#e74c3c"
              selectionColor="#e74c3c"
              className={`rounded-md px-4 py-2 text-base border 
               bg-white text-midnight z-20 ${
                 invalidCredentials ? "border-alizarin" : "border-clouds"
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
        </View>

        {invalidCredentials && (
          <Text className="text-alizarin text-base py-2 px-4 rounded-lg bg-alizarin/30">
            Invalid credentials
          </Text>
        )}
      </ScrollView>

      <TouchableOpacity
        className={`py-2 rounded-full mx-auto mb-10 ${
          email === "" || password === "" ? "bg-alizarin/50" : "bg-alizarin"
        }`}
        title="Login"
        style={{ width: width * 0.9 }}
        onPress={() => {
          login();
        }}
        disabled={email === "" || password === ""}
      >
        <Text className="text-center text-base text-white font-normal">
          Login
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default Login;
