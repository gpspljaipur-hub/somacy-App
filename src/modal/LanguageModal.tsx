import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Colors } from "../comman/comman/Colors";
import FontsSize from "../comman/comman/FontsSize";
import HWSize from "../comman/comman/HWSize";
import MarginHW from "../comman/comman/MarginHW";
import fonts from "../comman/comman/fonts";
import ImageSize from "../comman/comman/ImageSize";

interface Props {
  visible: boolean;
  onClose: () => void;
  navigation: any;
}
const LANG_TEXT = {
  en: {
    title: "Select Your Language",
    english: "English",
    hindi: "हिन्दी",
    cancel: "Cancel",
    apply: "Apply",
  },
  hi: {
    title: "अपनी भाषा चुनें",
    english: "English",
    hindi: "हिन्दी",
    cancel: "रद्द करें",
    apply: "लागू करें",
  },
};

const LanguageModal: React.FC<Props> = ({
  visible,
  onClose,
  navigation,
}) => {
  const [selectedLang, setSelectedLang] = useState<"en" | "hi">("en");
  useEffect(() => {
    const loadLang = async () => {
      const savedLang = await AsyncStorage.getItem("app_lang");
      if (savedLang === "hi" || savedLang === "en") {
        setSelectedLang(savedLang);
      }
    };
    loadLang();
  }, [visible]);

  const applyLanguage = async () => {
    await AsyncStorage.setItem("app_lang", selectedLang);
    onClose();

    navigation.reset({
      index: 0,
      routes: [{ name: "MainPageDetailsScrren" }],
    });
  };

  const LT = LANG_TEXT[selectedLang];

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Image source={require('../assets/images/language_img.png')} style={styles.headerIcon} />
          </View>

          <Text style={styles.title}>{LT.title}</Text>

          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.langBtn,
                selectedLang === "en" ? styles.active : styles.inactive,
              ]}
              onPress={() => setSelectedLang("en")}
              activeOpacity={0.8}
            >
              <Text style={[styles.langText, selectedLang === "en" ? styles.activeText : styles.inactiveText]}>{LT.english}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.langBtn,
                selectedLang === "hi" ? styles.active : styles.inactive,
              ]}
              onPress={() => setSelectedLang("hi")}
              activeOpacity={0.8}
            >
              <Text style={[styles.langText, selectedLang === "hi" ? styles.activeText : styles.inactiveText]}>{LT.hindi}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.cancel}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelText}>{LT.cancel}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={applyLanguage}
              style={styles.apply}
              activeOpacity={0.8}
            >
              <Text style={styles.applyText}>{LT.apply}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LanguageModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: '78%',
    backgroundColor: Colors.white,
    borderRadius: 1,
    paddingVertical: MarginHW.PaddingH14,
    paddingHorizontal: MarginHW.PaddingH22,
    alignItems: 'center',
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  iconContainer: {
    marginBottom: MarginHW.MarginH5,
    marginTop: MarginHW.MarginH10,
  },
  headerIcon: {
    width: ImageSize.ImageW50,
    height: ImageSize.ImageH50,
    resizeMode: 'contain',
    tintColor: Colors.tint,
  },

  title: {
    textAlign: "center",
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,
    marginBottom: MarginHW.MarginH10,
    color: Colors.black,
  },

  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: MarginHW.MarginH10,
    width: '100%',
  },

  langBtn: {
    width: HWSize.W_Width120,
    height: HWSize.W_Width40,
    borderWidth: HWSize.H_Height1,
    borderRadius: HWSize.H_Height10,
    justifyContent: "center",
    alignItems: "center",
  },

  active: {
    backgroundColor: Colors.couponSection,
    borderColor: Colors.tint,
    borderWidth: 2,
  },
  inactive: {
    backgroundColor: Colors.white,
    borderColor: Colors.borderColor,
  },

  langText: {
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,
  },

  activeText: {
    color: Colors.black,
    fontFamily: fonts.Lexend_SemiBold,
  },
  inactiveText: {
    color: Colors.black,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: '100%',
    gap: 10,
  },

  cancel: {
    flex: 1,
    backgroundColor: Colors.greyText,
    paddingVertical: MarginHW.PaddingH8,
    borderRadius: HWSize.H_Height10,
    alignItems: "center",
  },

  cancelText: {
    color: Colors.white,
    fontFamily: fonts.Lexend_SemiBold,
    fontSize: FontsSize.size16,
  },

  apply: {
    flex: 1,
    backgroundColor: Colors.tint,
    paddingVertical: MarginHW.PaddingH8,
    borderRadius: HWSize.H_Height10,
    alignItems: "center",
  },

  applyText: {
    color: Colors.white,
    fontFamily: fonts.Lexend_SemiBold,
    fontSize: FontsSize.size16,
  },
});
