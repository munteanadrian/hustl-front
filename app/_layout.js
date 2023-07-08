import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Welcome from "./onboarding/welcome";
import SignupName from "./onboarding/signupName";
import SignupInterests from "./onboarding/signupInterests";
import SignupAuth from "./onboarding/signupAuth";
import Login from "./onboarding/login";

import Home from "./main/home";
import Chats from "./main/chats";
import Profile from "./main/profile";
import Create from "./main/create";
import Search from "./main/search";
import Chat from "./main/chat";

const Stack = createNativeStackNavigator();

const Layout = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="onboarding/welcome"
        component={Welcome}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="onboarding/signupName"
        component={SignupName}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="onboarding/signupInterests"
        component={SignupInterests}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="onboarding/signupAuth"
        component={SignupAuth}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="onboarding/login"
        component={Login}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="main/home"
        component={Home}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="main/chats"
        component={Chats}
        options={{
          headerShown: true,
          title: "Chats",
          headerStyle: {
            backgroundColor: "#fff",
            shadowColor: "transparent",
            elevation: 0,
          },
          headerTitleStyle: {
            color: "#2c3e50",
            fontSize: 22,
            fontWeight: "600",
          },
          headerShadowVisible: false,
        }}
      />

      <Stack.Screen
        name="main/profile"
        component={Profile}
        options={{
          headerShown: true,
          title: "Profile",
          headerBackTitle: "",
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: "#fff",
            shadowColor: "transparent",
            elevation: 0,
          },
          headerTitleStyle: {
            color: "#2c3e50",
            fontSize: 22,
            fontWeight: "600",
          },
          iconColor: "#2c3e50",
          headerShadowVisible: false,
          headerTitleContainerStyle: {
            paddingBottom: 0,
          },
        }}
      />

      <Stack.Screen
        name="main/create"
        component={Create}
        options={{
          headerShown: true,
          title: "",
          headerBackTitle: "",
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: "#fff",
            shadowColor: "transparent",
            elevation: 0,
          },
          headerTitleStyle: {
            color: "#2c3e50",
            fontSize: 22,
            fontWeight: "600",
          },
          iconColor: "#2c3e50",
          headerShadowVisible: false,
          headerTitleContainerStyle: {
            paddingBottom: 0,
          },
        }}
      />

      <Stack.Screen
        name="main/search"
        component={Search}
        options={{
          headerShown: true,
          title: "",
          headerBackTitle: "",
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: "#fff",
            shadowColor: "transparent",
            elevation: 0,
          },
          headerTitleStyle: {
            color: "#2c3e50",
            fontSize: 22,
            fontWeight: "600",
          },
          iconColor: "#2c3e50",
          headerShadowVisible: false,
          headerTitleContainerStyle: {
            paddingBottom: 0,
          },
        }}
      />

      <Stack.Screen
        name="main/chat"
        component={Chat}
        options={{
          headerShown: true,
          title: "",
          headerBackTitle: "",
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: "#fff",
            shadowColor: "transparent",
            elevation: 0,
          },
          headerTitleStyle: {
            color: "#2c3e50",
            fontSize: 22,
            fontWeight: "600",
          },
          iconColor: "#2c3e50",
          headerShadowVisible: false,
          headerTitleContainerStyle: {
            paddingBottom: 0,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default Layout;
