import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import axios from "axios";

import validateInput from "../utils/validateInput";
import LoginImage from "./../assets/onboarding/login";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Icon from "react-native-vector-icons/Ionicons";
import BouncyCheckbox from "react-native-bouncy-checkbox";

// Done, test

// Current

// To do
// TODO: Email confirmation
// TODO: Sign up / Sign in with Google - switch backend to OAuth2

const Login = () => {
  //#region utils
  const router = useRouter();

  const [passwordHidden, setPasswordHidden] = useState(true);
  const togglePasswordVisibility = () => {
    setPasswordHidden(!passwordHidden);
  };

  const [rememberLogin, setRememberLogin] = useState(false);
  const toggleRememberLogin = () => {
    setRememberLogin(!rememberLogin);
  };

  const { height, width } = Dimensions.get("window");
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
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [invalidCredentials, setInvalidCredentials] = useState(false);

  const onSubmit = () => {
    const user = {
      email: email.replace("@", "%40"),
      password: password,
    };

    const options = {
      method: "POST",
      url: "http://192.168.0.73:8080/api/auth/login", // https
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

        if (response.data.token) {
          await AsyncStorage.setItem("token", response.data.token);

          navigation.reset({
            index: 0,
            routes: [{ name: "mainscreen" }],
          });
        } else {
          setError(true);
        }
      } catch (error) {
        setError(error);

        setInvalidCredentials(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  };
  //#endregion

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={-50}
      style={{ flex: 1, width: width, paddingHorizontal: 10 }}
      className="bg-white"
    >
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          {/* Image */}
          <View className="mt-10">
            <LoginImage height={height * 0.25} width={width * 0.5} />
          </View>

          {/* Login text */}
          <View className="mt-5 items-center">
            <Text className="text-3xl font-semibold text-midnight mb-4">
              Login Now
            </Text>
            <Text className="text-concrete font-normal">
              Please enter your details below to continue
            </Text>
          </View>

          {/* Login form */}
          {!loading ? (
            <View
              style={{
                marginTop: 25 - (invalidCredentials ? 25 : 0),
                width: width * 0.9,
              }}
              className="gap-y-4"
            >
              {/* Error message */}
              {invalidCredentials ? (
                <Text className="text-alizarin font-normal text-sm text-center">
                  Invalid email or password, please try again
                </Text>
              ) : null}

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

              <View className="">
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
              <TouchableOpacity className="flex flex-row justify-between items-center w-full px-2 mb-5">
                <BouncyCheckbox
                  size={25}
                  fillColor="#e74c3c"
                  unfillColor="#ffffff"
                  text="Remember me"
                  textStyle={{ textDecorationLine: "none" }}
                  customContainerStyle={{ marginLeft: "10" }}
                  onPress={() => toggleRememberLogin()}
                />

                <Text className="text-alizarin font-normal text-sm text-right">
                  Forgot password?
                </Text>
              </TouchableOpacity>
              {/* Submit button */}
              <TouchableOpacity
                className="bg-alizarin rounded-full w-full"
                onPress={onSubmit}
              >
                <Text className="text-white text-center font-semibold py-4 px-8">
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ marginTop: 50 }}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}

          {/* Sign up */}
          {loading ? null : (
            <View className="flex-row gap-x-2 mt-10">
              <Text className="text-midnight font-normal text-sm">
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push("/signup")}>
                <Text className="text-alizarin font-bold text-sm">Sign up</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
