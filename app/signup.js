import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import SignupImage from "./../assets/onboarding/signup";
import GoogleIcon from "./../assets/icons/google";

import Icon from "react-native-vector-icons/Ionicons";

import validateInput from "../utils/validateInput";

const Signup = () => {
  //#region utils
  const router = useRouter();
  const { height, width } = Dimensions.get("window");
  const [passwordHidden, setPasswordHidden] = useState(true);
  const togglePasswordVisibility = () => {
    setPasswordHidden(!passwordHidden);
  };
  //#endregion

  //#region password validation
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState([]);

  const onPasswordChange = (text) => {
    setPassword(text);
  };

  useEffect(() => {
    const passwordError = validateInput("password", password);
    setPasswordError(passwordError);
  }, [password]);
  //#endregion

  //#region name validation
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState([]);

  const onNameChange = (text) => {
    setName(text);
  };

  useEffect(() => {
    const nameError = validateInput("name", name);
    setNameError(nameError); // and 1
  }, [name]);
  //#endregion

  //#region email validation
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState([]);

  const onEmailChange = (text) => {
    setEmail(text);
  };

  useEffect(() => {
    const emailError = validateInput("email", email);
    setEmailError(emailError);
  }, [email]);
  //#endregion

  //#region submit

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const navigation = useNavigation();

  const onSubmit = () => {
    console.log("sending");

    const user = {
      email: email.replace("@", "%40"),
      password: password,
      name: name,
    };

    const options = {
      method: "POST",
      url: "http://192.168.0.73:8080/api/auth/signup", // https
      headers: {
        "Content-Type": "application/json",
      },
      data: user,
    };

    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await axios(options);
        setData(response.data);

        if (response.data) {
          // make request to log in and get token, then save token in local storage

          const loginUser = {
            email: email.replace("@", "%40"),
            password: password,
          };

          const loginOptions = {
            method: "POST",
            url: "http://192.168.0.73:8080/api/auth/login", // https
            headers: {
              "Content-Type": "application/json",
            },
            data: loginUser,
          };

          const loginResponse = await axios(loginOptions);

          await AsyncStorage.setItem("token", loginResponse.data.token);

          navigation.reset({
            index: 0,
            routes: [{ name: "mainscreen" }],
          });
        } else {
          setError(true);
        }
      } catch (error) {
        if (error.response.status === 400) {
          setEmailError(["Email already exists"]);
        }

        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  };
  //#endregion

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, width: width }}
      className="bg-white"
    >
      <ScrollView contentContainerStyle={{ flex: 1, paddingHorizontal: 10 }}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <View>
            <SignupImage height={height * 0.25} width={width * 0.5} />
          </View>
          <View className="items-center">
            <Text className="text-3xl font-semibold text-midnight mb-4">
              Create an account
            </Text>
            <Text className="text-concrete font-normal">
              Please enter your details below to continue
            </Text>
          </View>

          {!loading ? (
            <View
              style={{ marginTop: 15, width: width * 0.9 }}
              className="gap-y-4"
            >
              <TextInput
                caretColor="#e74c3c"
                selectionColor="#e74c3c"
                className="py-1 p-4 bg-concrete/20 rounded-lg w-full"
                placeholder="Enter your name.."
                value={name}
                onChangeText={onNameChange}
                keyboardType="default"
                disableFullscreenUI={true}
                autoCorrect={false}
                autoCapitalize="sentences"
                autoComplete="name"
              />
              {name === "" || nameError.length === 0 ? null : (
                <Text className="px-4 text-alizarin">{nameError[0]}</Text>
              )}

              <TextInput
                caretColor="#e74c3c"
                selectionColor="#e74c3c"
                className="py-1 p-4 bg-concrete/20 rounded-lg w-full"
                placeholder="Enter your email.."
                value={email}
                onChangeText={onEmailChange}
                keyboardType="email-address"
                disableFullscreenUI={true}
                autoCorrect={false}
                autoCapitalize="none"
                autoComplete="email"
              />

              {email === "" || emailError.length === 0 ? null : (
                <Text className="px-4 text-alizarin">{emailError[0]}</Text>
              )}

              <View className="mb-5">
                <TextInput
                  caretColor="#e74c3c"
                  selectionColor="#e74c3c"
                  className="py-1 p-4 bg-concrete/20 rounded-lg relative"
                  placeholder="Enter your password..."
                  value={password}
                  autoComplete="password"
                  autoCorrect={false}
                  disableFullscreenUI={true}
                  autoCapitalize="none"
                  onChangeText={onPasswordChange}
                  secureTextEntry={passwordHidden}
                />

                {password.length === 0 || passwordError.length === 0 ? null : (
                  <Text className="px-4 text-alizarin -mb-5 pt-2">
                    {passwordError[0]}
                  </Text>
                )}

                <TouchableOpacity
                  className="absolute right-5 top-5 text-concrete"
                  onPress={() => togglePasswordVisibility()}
                >
                  {/* Replace with icons */}
                  {passwordHidden ? (
                    <Icon name="eye-outline" size={20} color="#95a5a6" />
                  ) : (
                    <Icon name="eye-off-outline" size={20} color="#95a5a6" />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                className="bg-alizarin rounded-full"
                onPress={() => onSubmit()}
              >
                <Text className="text-white text-center font-semibold py-4 px-8">
                  Create account
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="border border-midnight rounded-full flex-row items-center justify-center"
                onPress={() => onSubmit()}
              >
                <GoogleIcon height={20} width={20} />

                <Text className="text-midnight text-center font-semibold py-4 px-2">
                  Sign up with Google
                </Text>
              </TouchableOpacity>
              <View className="flex-row gap-x-2 justify-center pt-5">
                <Text className="text-midnight font-normal text-sm">
                  Already have an account?
                </Text>
                <TouchableOpacity onPress={() => router.push("/login")}>
                  <Text className="text-alizarin font-bold text-sm">
                    Log in
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={{ marginTop: 50 }}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Signup;
