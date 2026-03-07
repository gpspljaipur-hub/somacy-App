import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Colors } from "../comman/comman/Colors";
import FontsSize from "../comman/comman/FontsSize";
import HWSize from "../comman/comman/HWSize";
import MarginHW from "../comman/comman/MarginHW";
import fonts from "../comman/comman/fonts";
import ScreenWrapper from "../comman/comman/ScreenWrapper";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigations/AppNavigator";
type Language = "en" | "hi";
type Props = NativeStackScreenProps<
  RootStackParamList,
  "LanguageSelect"
>;

const LanguageSelect = ({ navigation }: Props) => {
  const [selected, setSelected] = useState<Language>("en");

  /* Text Data for Localization */
  const textData: Record<Language, {

    title: String,
    englishBtn: String,
    hindiBtn: String,
    continueBtn: String,
  }> =
  {
    en: {
      title: "Select Your Language",
      englishBtn: "English",
      hindiBtn: "Hindi",
      continueBtn: "Continue",
    },
    hi: {
      title: "अपनी भाषा चुनें",
      englishBtn: "अंग्रेज़ी",
      hindiBtn: "हिन्दी",
      continueBtn: "जारी रखें",
    },
  };

  const { title, englishBtn, hindiBtn, continueBtn } = textData[selected as keyof typeof textData];

  const saveLang = async () => {
    try {
      await AsyncStorage.setItem("app_lang", selected);
      navigation.replace("Home", { lang: selected } );
    } catch (error) {
      console.log("Language save error:", error);
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      {/* HEADER */}
      <View style={styles.headWrap}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.head}>Somacy</Text>
      </View>

      <View style={styles.logoWrap}>
        <Image
          source={require("../assets/images/language_img.png")}
          style={styles.icon}
        />
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* OPTIONS */}
      <View style={styles.OptionWrap}>
        <Pressable
          onPress={() => setSelected("en")}
          style={[styles.option, selected === "en" && styles.selected]}
        >
          <Text style={styles.text}>{englishBtn}</Text>
          {selected === "en" && (
            <View style={styles.tickContainer}>
              <Text style={styles.tick}>✓</Text>
            </View>
          )}
        </Pressable>

        {/* HINDI */}
        <Pressable
          onPress={() => setSelected("hi")}
          style={[styles.option, selected === "hi" && styles.selected]}
        >
          <Text style={styles.text}>{hindiBtn}</Text>
          {selected === "hi" && (
            <View style={styles.tickContainer}>
              <Text style={styles.tick}>✓</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* CONTINUE */}
      <Pressable onPress={saveLang} style={styles.button}>
        <Text style={styles.buttonText}>{continueBtn}</Text>
      </Pressable>
    </ScreenWrapper>
  );
};

export default LanguageSelect;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: MarginHW.PaddingH12,
    justifyContent: 'space-between',
  },

  headWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: MarginHW.MarginH1,
  },
  logo: {
    width: HWSize.W_Width30,
    height: HWSize.H_Height30,
  },
  head: {
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,
    marginTop: MarginHW.MarginH1,
    marginLeft: MarginHW.MarginW8,
  },

  logoWrap: {
    alignItems: 'center',
    marginTop: MarginHW.MarginW5,
  },
  icon: {
    width: HWSize.W_Width120,
    height: HWSize.H_Height120,
    marginTop: HWSize.H_Height100,
    resizeMode: "contain",
  },
  tick: {
    color: Colors.text,
    fontSize: FontsSize.size14,
    fontFamily: fonts.Lexend_SemiBold,
  },

  title: {
    fontSize: FontsSize.size22,
    fontFamily: fonts.Lexend_SemiBold,
  },

  OptionWrap: {
    padding: MarginHW.PaddingH16,
  },

  option: {
    padding: MarginHW.PaddingH20,
    borderRadius: HWSize.H_Height12,
    borderWidth: HWSize.H_Height1,
    borderColor: Colors.borderColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: MarginHW.MarginH10,
    alignItems: 'center',
  },

  selected: {
    backgroundColor: Colors.backgroundColor,
    borderColor: Colors.borderColor,
  },

  text: { fontSize: FontsSize.size18, fontFamily: fonts.Lexend_SemiBold },
  tickContainer: {
    width: HWSize.W_Width20,
    height: HWSize.H_Height20,
    backgroundColor: Colors.background,
    borderRadius: HWSize.H_Height50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    backgroundColor: Colors.background,
    padding: MarginHW.PaddingH12,
    margin: MarginHW.MarginH16,
    borderRadius: HWSize.H_Height20,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.text,
    fontSize: FontsSize.size20,
    fontFamily: fonts.Lexend_SemiBold,
  },
});
