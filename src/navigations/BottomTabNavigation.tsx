import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HomeStackNavigator from "./HomeStackNavigator";
import MedicineScreen from "../screens/MedicineScreen";
import LabTestScreen from "../screens/LabTestScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MedicineStackNavigator from "./MedicineStackNavigator";

const Tab = createBottomTabNavigator();

const TAB_TEXT = {
  en: { HOME: "Home", MEDICINE: "Medicine", LAB: "Lab Test", PROFILE: "Profile" },
  hi: { HOME: "मुखपृष्ठ", MEDICINE: "दवाइयां", LAB: "लैब टेस्ट", PROFILE: "सेटिंग" },
};

const BottomTabNavigation = () => {
  const [lang, setLang] = useState<"en" | "hi">("en");

  useEffect(() => {
    AsyncStorage.getItem("app_lang").then((l) => {
      if (l === "hi" || l === "en") setLang(l);
    });
  }, []);

  const t = TAB_TEXT[lang];

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: t.HOME,
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../assets/images/ic_home.png")}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? "#007bff" : "#888",
              }}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("Home", {
              screen: "HomeMain",
            });
          },
        })}
      />


      <Tab.Screen
        name="Medicine"
        // component={MedicineStackNavigator}
        // initialParams={{ lang }}
        options={{
          tabBarLabel: t.MEDICINE,
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../assets/images/ic_medicine.png")}
              style={{ width: 24, height: 24, tintColor: focused ? "#007bff" : "#888" }}
            />
          ),
        }}
      >
        {(props) => <MedicineScreen {...props} lang={lang} />}
      </Tab.Screen>


      <Tab.Screen
        name="LabTest"
        options={{
          tabBarLabel: t.LAB,
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../assets/images/ic_lab.png")}
              style={{ width: 24, height: 24, tintColor: focused ? "#007bff" : "#888" }}
            />
          ),
        }}
      >
        {(props) => <LabTestScreen {...props} lang={lang} />}
      </Tab.Screen>

      <Tab.Screen
        name="Profile"
        options={{
          tabBarLabel: t.PROFILE,
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../assets/images/ic_profile.png")}
              style={{ width: 24, height: 24, tintColor: focused ? "#007bff" : "#888" }}
            />
          ),
        }}
      >
        {(props) => <ProfileScreen {...props} lang={lang} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
