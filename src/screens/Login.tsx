import React, { useState, useEffect } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';


import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/AppNavigator';
import { fetchMobileCheck } from '../Service/HomePageService';
import { Colors } from '../comman/comman/Colors';
import FontsSize from '../comman/comman/FontsSize';
import HWSize from '../comman/comman/HWSize';
import MarginHW from '../comman/comman/MarginHW';
import fonts from '../comman/comman/fonts';
import { getAuth, signInWithPhoneNumber } from "@react-native-firebase/auth";
import ScreenWrapper from '../comman/comman/ScreenWrapper';
type Language = "en" | "hi";
type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login = ({ navigation, route }: Props) => {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const lang = route.params?.lang;

  /* Localization Data */
  const textData: Record<Language, {
    title: string;
    placeholder: string;
    haveIdText: string;
    clickHereText: string;
    policyText: string;
    policyLink: string;
    continueBtn: string;
    loadingText: string;
  }> = {
    en: {
      title: "Sign In ",
      placeholder: "Enter 10 digit mobile no",
      haveIdText: "If you have an ID/Password? ",
      clickHereText: "Click here",
      policyText: "By clicking continue, you agree with our ",
      policyLink: "Privacy Policy",
      continueBtn: "Continue",
      loadingText: "Please wait...",
    },
    hi: {
      title: "साइन इन ",
      placeholder: "10 अंकों का मोबाइल नंबर दर्ज करें",
      haveIdText: "यदि आपके पास आईडी/पासवर्ड है? ",
      clickHereText: "यहाँ क्लिक करें",
      policyText: "जारी रखने पर, आप हमारी ",
      policyLink: "गोपनीयता नीति से सहमत होते हैं",
      continueBtn: "जारी रखें",
      loadingText: "कृपया प्रतीक्षा करें...",
    },
  };
  const safeLang: Language = lang ?? "en";

  const { title, placeholder, haveIdText, clickHereText, policyText, policyLink, continueBtn, loadingText } = textData[safeLang];
  const handleContinue = async () => {
    try {
      setLoading(true);

      const res = await fetchMobileCheck(mobile);


      if (res?.Result === "true") {
        console.log(res, "resresres");
        const authInstance = getAuth();
        console.log(authInstance, "authInstanceauthInstance");

        const confirmation = await signInWithPhoneNumber(
          authInstance,
          `+91${mobile}`
        );
        console.log(confirmation, "confirmationconfirmationconfirmation");

        navigation.replace("OtpScreen", {
          mobile,
          confirmation,
          lang,
        });
      } else {
        navigation.replace("PasswordScreen", { mobile, lang });
      }
    } catch (e) {
      Alert.alert("Error", "Unable to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    navigation.replace("PasswordScreen", {
      mobile: "",
      lang,
    });
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate("WebViewScreen", { url: "https://somacy.in/pp.html", title: "Privacy Policy" });
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.surface}
      />
      <ScreenWrapper
        style={styles.container}
        edges={['left', 'right', 'bottom']}
      >
        <View style={styles.header}>
          <Text style={styles.appName}>Somacy</Text>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.largeLogo}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.ś}>
            <Text style={styles.prefix}>+91 </Text>
            <TextInput
              placeholder={placeholder}
              placeholderTextColor={Colors.lightGreyText}
              keyboardType="numeric"
              maxLength={10}
              style={styles.input}
              value={mobile}
              onChangeText={setMobile}
            />
          </View>

          <View style={{
            flexDirection: 'row', alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text style={styles.text1}>{haveIdText}</Text>
            <Text style={styles.text2} onPress={handleNavigate}>{clickHereText}</Text>
          </View>


          <View style={styles.textContainer1}>
            <Text style={styles.text1}>
              {policyText}
            </Text>

            <Text style={styles.text2} onPress={handlePrivacyPolicy}>{policyLink}</Text>
          </View>

          <TouchableOpacity
            style={styles.continueBtn}
            onPress={handleContinue}
            disabled={loading}
          >
            {loading ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ActivityIndicator color="#fff" />
                <Text style={[styles.continueText, { marginLeft: 10 }]}>{loadingText}</Text>
              </View>
            ) : (
              <Text style={styles.continueText}>{continueBtn}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backHandler,
    alignItems: 'center',
  },
  header: {
    marginTop: MarginHW.MarginH100,
    alignItems: 'center',
  },
  largeLogo: {
    width: HWSize.W_Width100,
    height: HWSize.H_Height90,
    marginBottom: MarginHW.MarginH10,
  },
  appName: {
    fontSize: FontsSize.size30,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.appName,
    marginBottom: MarginHW.MarginH10,
  },
  card: {
    backgroundColor: Colors.white,
    padding: MarginHW.PaddingH16,
    borderRadius: HWSize.H_Height20,
    margin: MarginHW.MarginH14,
  },
  title: {
    fontSize: FontsSize.size20,
    fontFamily: fonts.Lexend_SemiBold,
    marginBottom: MarginHW.MarginH16,
  },
  ś: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.appName,
    borderRadius: HWSize.H_Height18,
    padding: MarginHW.PaddingH10,
    marginBottom: MarginHW.MarginH10,
  },

  prefix: {
    marginRight: MarginHW.MarginH10,
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,
  },
  input: {
    flex: 1,
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,
  },
  textContainer: {
    flexDirection: 'row',
  },

  text1: {
    fontSize: FontsSize.size16,
    fontFamily: fonts.Lexend_SemiBold,
  },

  text2: {
    fontSize: FontsSize.size16,
    color: Colors.appName,
    fontFamily: fonts.Lexend_SemiBold,
  },
  textContainer1: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: MarginHW.MarginH10,
  },
  continueBtn: {
    backgroundColor: Colors.background,
    paddingVertical: MarginHW.PaddingH10,
    borderRadius: HWSize.H_Height12,
    alignItems: 'center',
    marginVertical: MarginHW.MarginH10,
  },
  continueText: {
    color: Colors.text,
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,
  },
});
