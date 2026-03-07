import React, { useState } from "react";
import { View, TextInput, StyleSheet, Image, TouchableOpacity } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { Colors } from "../comman/comman/Colors";
import HWSize from "../comman/comman/HWSize";
import MarginHW from "../comman/comman/MarginHW";
import FontsSize from "../comman/comman/FontsSize";
import fonts from "../comman/comman/fonts";
type Language = "en" | "hi";
const SearchBar = ({ lang }: { lang: "en" | "hi" }) => {
  const navigation = useNavigation<any>();


  /* Localization Data */
  const textData: Record<Language, {
    placeholder: string;
  }> = {

    en: {
      placeholder: "Search Medicine or Tablet or Syrup",
    },
    hi: {
      placeholder: "दवा या टैबलेट या सिरप खोजें",
    },
  };

  const { placeholder } = textData[lang as keyof typeof textData];

  return (
    <TouchableOpacity
      style={styles.searchContainer}
      onPress={() => navigation.navigate("SearchScreen", { lang: lang })}
      activeOpacity={0.9}
    >
      <Image
        source={require("../assets/images/ic_search.png")}
        style={styles.searchIcon}
      />

      <TextInput
        editable={false}
        placeholder={placeholder}
        style={styles.input}
        placeholderTextColor={Colors.lightGreyText}
      />
    </TouchableOpacity>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  // searchContainer: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   borderColor: Colors.couponSection,
  //   borderWidth: HWSize.H_Height2,
  //   borderRadius: HWSize.H_Height10,
  //   padding: MarginHW.PaddingH3,
  //   marginVertical: MarginHW.MarginH5,
  //   marginHorizontal: MarginHW.MarginH3,

  // },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: Colors.couponSection,
    borderWidth: HWSize.H_Height2,
    borderRadius: HWSize.H_Height10,
    paddingVertical: MarginHW.PaddingH1,
    paddingHorizontal: MarginHW.PaddingH4,
    // padding: MarginHW.PaddingH3,

    marginTop: MarginHW.MarginH2,
    marginBottom: MarginHW.MarginH3,
    marginHorizontal: MarginHW.MarginH3,
  },

  searchIcon: {
    width: HWSize.W_Width20,
    height: HWSize.H_Height20,
    resizeMode: "contain",
    marginRight: MarginHW.MarginH8,
  },
  //   searchIcon: {
  //   width: HWSize.W_Width18,
  //   height: HWSize.H_Height18,
  //   marginRight: MarginHW.MarginH6,
  // },

  input: {
    fontSize: FontsSize.size14,
    flex: 1,
    fontFamily: fonts.Lexend_SemiBold,
  },
});
