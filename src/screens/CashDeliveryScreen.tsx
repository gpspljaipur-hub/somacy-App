import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigations/AppNavigator";
import { Colors } from '../../src/comman/comman/Colors';
import FontsSize from '../comman/comman/FontsSize';
import HWSize from '../comman/comman/HWSize';
import MarginHW from '../comman/comman/MarginHW';
import fonts from '../comman/comman/fonts';
import ScreenWrapper from '../comman/comman/ScreenWrapper';
import ImageSize from '../comman/comman/ImageSize';
type Props = NativeStackScreenProps<RootStackParamList, 'CashDeliveryScreen'>;
type Language = "en" | "hi";
const CashDeliveryScreen: React.FC<Props> = ({ route, navigation }) => {
  const lang = route?.params?.lang
  const safeLang: Language = lang ?? "en";
  const textData: Record<Language, {
    headerTitle: string;
    message: string;
    subMessage: string;
    btnText: string;
  }> = {
    en: {
      headerTitle: "Order Placed",
      message: "Your order has been placed successfully and will be on the way soon.",
      subMessage: "We will call you to confirm your order very soon.",
      btnText: "Go to Home",
    },
    hi: {
      headerTitle: "ऑर्डर दिया गया",
      message: "आपका ऑर्डर सफलतापूर्वक दे दिया गया है और जल्द ही रास्ते में होगा।",
      subMessage: "हम आपके ऑर्डर की पुष्टि के लिए आपको बहुत जल्द कॉल करेंगे।",
      btnText: "मुख्यपृष्ठ पर जाएं",
    },
  };

  /* Localization Data */
  const { headerTitle, message, subMessage, btnText } = textData[safeLang];

  const goHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "MainPageDetailsScrren" }],
    });
  };

  return (
    <ScreenWrapper
      style={styles.container}
      edges={["top", "bottom"]}
      contentContainerStyle={styles.scrollContent}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Image
            source={require("../assets/images/back.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
      </View>



      <View style={styles.mainContent}>
        <View style={styles.successContainer}>
          <View style={styles.circleOuter}>
            <View style={styles.circleInner}>
              <Image
                source={require("../assets/images/thank_you.png")}
                style={styles.checkIcon}
              />
            </View>
          </View>

          <Text style={styles.message}>
            {message}
          </Text>

          <Text style={styles.subMessage}>
            {subMessage}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={goHome}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{btnText}</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default CashDeliveryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flex: 1,
  },
  header: {
    height: HWSize.H_Height40,
    backgroundColor: Colors.purpleBtn,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: MarginHW.PaddingW14,
    marginBottom: MarginHW.MarginH12,
  },
  backBtn: {
    padding: MarginHW.PaddingW5,
  },
  backIcon: {
    width: ImageSize.ImageW20,
    height: ImageSize.ImageH20,
    tintColor: Colors.white,
    resizeMode: 'contain'
  },
  headerTitle: {
    color: Colors.white,
    fontSize: FontsSize.normalize18,
    marginLeft: MarginHW.MarginW12,
    fontFamily: fonts.Lexend_SemiBold
  },

  backArrow: {
    fontSize: FontsSize.size30,
    color: Colors.white,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: MarginHW.MarginH20,
  },

  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: MarginHW.PaddingH24,
  },

  circleOuter: {
    width: HWSize.W_Width180,
    height: HWSize.W_Width180,
    borderRadius: HWSize.W_Width90,
    backgroundColor: Colors.backgroundColor,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: MarginHW.MarginH30,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  circleInner: {
    width: HWSize.W_Width120,
    height: HWSize.W_Width120,
    borderRadius: HWSize.W_Width60,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  checkIcon: {
    width: HWSize.W_Width70,
    height: HWSize.H_Height70,
    resizeMode: "contain",
  },

  message: {
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,
    textAlign: "center",
    color: Colors.black,
    marginBottom: MarginHW.MarginH16,
    lineHeight: FontsSize.size24,
  },

  subMessage: {
    fontSize: FontsSize.size16,
    fontFamily: fonts.Lexend_SemiBold,
    textAlign: "center",
    color: Colors.appName,
    lineHeight: FontsSize.size22,
    paddingHorizontal: MarginHW.PaddingH10,
  },

  button: {
    backgroundColor: Colors.background,
    marginHorizontal: MarginHW.MarginH24,
    marginTop: MarginHW.MarginH20,
    paddingVertical: MarginHW.PaddingH16,
    borderRadius: HWSize.H_Height12,
    alignItems: "center",
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  buttonText: {
    color: Colors.white,
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,
  },
});
