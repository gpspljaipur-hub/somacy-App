import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, Image, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSelector, useDispatch } from "react-redux";
import { RootStackParamList } from "../navigations/AppNavigator";
import { Colors } from '../comman/comman/Colors';
import FontsSize from '../comman/comman/FontsSize';
import ImageSize from '../comman/comman/ImageSize';
import MarginHW from '../comman/comman/MarginHW';
import fonts from '../comman/comman/fonts';
import HWSize from '../comman/comman/HWSize';
import ScreenWrapper from '../comman/comman/ScreenWrapper';
import { setPrescriptionHistory } from "../Redux/Slices/homePageSlice";
import { fetchPresHistory } from "../Service/HomePageService";
import { RootState } from "../Redux/store/store";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;
type Language = "en" | "hi";

/* Localization Data */
export default function Home({ navigation, route }: Props) {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const { lang } = route.params;

  /* Localization Data */
  const textData: Record<Language, {
    noteTitle: string;
    noteTextPart1: string;
    noteHighlight: string;
    noteTextPart2: string;
    continueBtn: string;
  }> = {
    en: {
      noteTitle: "Note",
      noteTextPart1: "Our mobile app services tailored only for residents of ",
      noteHighlight: "Dausa, Raj (303303)",
      noteTextPart2: " right now.",
      continueBtn: "Continue",
    },
    hi: {
      noteTitle: "नोट",
      noteTextPart1: "हमारी मोबाइल ऐप सेवाएं फिलहाल केवल ",
      noteHighlight: "दौसा, राजस्थान (303303)",
      noteTextPart2: " के निवासियों के लिए उपलब्ध हैं।",
      continueBtn: "जारी रखें",
    },
  };

  const { noteTitle, noteTextPart1, noteHighlight, noteTextPart2, continueBtn } = textData[lang as keyof typeof textData];

  useEffect(() => {
    if (user?.id) {
      fetchPresHistory(user.id)
        .then((res) => {
          if (res?.PrescriptionHistory) {
            dispatch(setPrescriptionHistory(res.PrescriptionHistory));
          }
        })
        .catch((err) => console.log("Prescription fetch error", err));
    }
  }, [user, dispatch]);

  return (
    <ScreenWrapper style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={styles.headWrap}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.head}> Somacy</Text>
      </View>

      <View style={styles.Middle}>
        <Image source={require('../assets/images/delivery_img.png')} style={styles.deliveryIcon} />
        <View style={styles.note}>
          <Text style={styles.noteTitle}>{noteTitle}</Text>
          <Text style={styles.noteText}>
            {noteTextPart1}
            <Text style={styles.highlight}>{noteHighlight}</Text>
            {noteTextPart2}
          </Text>
        </View>
      </View>

      <View style={styles.buttonwrap}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace('Login', { lang })}
        >
          <Text style={styles.buttonText}>{continueBtn}</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}
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
    marginTop: MarginHW.MarginH30,
  },
  logo: {
    width: HWSize.W_Width30,
    height: HWSize.H_Height30,
  },
  head: {
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,
    marginTop: MarginHW.MarginH1,
  },
  Middle: {
    alignItems: 'center',
    marginTop: MarginHW.MarginH20,
  },
  deliveryIcon: {
    width: ImageSize.ImageW120,
    height: ImageSize.ImageH115,
    marginTop: MarginHW.MarginH100,
    tintColor: Colors.tabIconSelected,
  },

  note: {
    alignItems: 'center',
    marginTop: MarginHW.MarginH5,
    paddingHorizontal: MarginHW.PaddingH10,
  },
  noteTitle: {
    fontSize: FontsSize.size28,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.noteTitle,
    marginBottom: MarginHW.MarginH10,
  },

  noteText: {
    textAlign: 'center',
    fontSize: FontsSize.size22,
    color: Colors.noteText,
    fontFamily: fonts.Lexend_SemiBold,
  },

  highlight: {
    color: Colors.notehighlight,
    fontFamily: fonts.Lexend_SemiBold,
  },
  buttonwrap: {
    position: 'absolute',
    bottom: MarginHW.MarginH20,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: Colors.secondary_button,
    width: '95%',
    paddingVertical: MarginHW.PaddingH14,
    borderRadius: HWSize.H_Height20,
  },

  buttonText: {
    color: Colors.text,
    fontSize: FontsSize.size20,
    fontFamily: fonts.Lexend_SemiBold,
  },
});
