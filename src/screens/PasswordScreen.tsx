import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator, // Added
} from 'react-native';

import { FetchLoginUserDetails } from '../Service/HomePageService';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../Redux/Slices/authSlice';
import { RootState, persistor } from '../Redux/store/store';
import { restoreCart } from '../Redux/Slices/cartSlice';
import { setSelectedAddress } from '../Redux/Slices/addressSlice';

import { Colors } from '../comman/comman/Colors';
import FontsSize from '../comman/comman/FontsSize';
import HWSize from '../comman/comman/HWSize';

import MarginHW from '../comman/comman/MarginHW';
import fonts from '../comman/comman/fonts';

import ScreenWrapper from '../comman/comman/ScreenWrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';


type Language = "en" | "hi";

const PasswordScreen = ({ navigation, route }: any) => {
  const { mobile, lang } = route.params;
  const [phone, setPhone] = useState(mobile || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // const [lang, setLang] = useState<"en" | "hi">("en");
  const safeLang: Language = lang ?? "en";

  const dispatch = useDispatch();
  const lastLoggedUserId = useSelector((state: RootState) => state.auth.lastLoggedUserId);

  /* Localization Data */
  const textData: Record<Language, {
    title: string;
    mobilePlaceholder: string;
    passwordPlaceholder: string;
    signupQuestion: string;
    newUserText: string;
    policyText: string;
    policyLink: string;
    continueBtn: string;
    forgotText: string;
    loadingText: string;
  }> = {
    en: {
      title: "Sign In ",
      mobilePlaceholder: "Enter Phone Number",
      passwordPlaceholder: "Enter your password",
      signupQuestion: "Sign Up?",
      newUserText: " new user",
      policyText: "By clicking continue, you agree with our ",
      policyLink: "Privacy Policy",
      continueBtn: "Continue",
      forgotText: "Forgot Password?",
      loadingText: "Please wait...",
    },
    hi: {
      title: "साइन इन ",
      mobilePlaceholder: "अपना मोबाइल नंबर दर्ज करें",
      passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
      signupQuestion: "साइन अप करें?",
      newUserText: " नया उपयोगकर्ता",
      policyText: "जारी रखने पर, आप हमारी ",
      policyLink: "गोपनीयता नीति से सहमत होते हैं",
      continueBtn: "जारी रखें",
      forgotText: "पासवर्ड भूल गए?",
      loadingText: "कृपया प्रतीक्षा करें...",
    },
  };

  const {
    title,
    mobilePlaceholder,
    passwordPlaceholder,
    signupQuestion,
    newUserText,
    policyText,
    policyLink,
    continueBtn,
    forgotText,
    loadingText,
  } = textData[safeLang];

  // const handleClick = () => {
  //   navigation.navigate('SignupDetailsScreen');
  // };
  const handleContinue = async () => {
    try {
      setLoading(true);

      const res = await FetchLoginUserDetails(phone, password);
      if (res?.Result === "true") {
        const newUser = res.UserLogin;
        // If a different user is logging in, clear all previous persisted data
        if (lastLoggedUserId && lastLoggedUserId !== newUser.id) {
          console.log("User switch detected. Purging app data for fresh start...");
          await persistor.purge();
        }

        dispatch(setUser(newUser));

        // Restore user specific profile data if exists (Cart, Address etc.)
        try {
          const savedData = await AsyncStorage.getItem(`user_profile_data_${newUser.id}`);
          if (savedData) {
            const parsedData = JSON.parse(savedData);

            // Restore Cart
            if (parsedData.cart) {
              dispatch(restoreCart(parsedData.cart));
            }

            // Restore Address
            if (parsedData.address) {
              dispatch(setSelectedAddress(parsedData.address));
            }
          } else {
            // Also check for legacy cart-only backup just in case
            const legacyCart = await AsyncStorage.getItem(`user_cart_${newUser.id}`);
            if (legacyCart) {
              dispatch(restoreCart(JSON.parse(legacyCart)));
            }
          }
        } catch (e) {
          console.log("Error restoring user profile data:", e);
        }

        // SAVE USER
        await AsyncStorage.setItem(
          "app_user",
          JSON.stringify(res.UserLogin)
        );

        navigation.replace("MainPageDetailsScrren");
      } else {
        Alert.alert("Message", res?.ResponseMsg || "Something went wrong");
      }
    } catch (error) {
      Alert.alert("Error", "Server not responding");
    } finally {
      setLoading(false);
    }
  };


  const handleForgotPassword = () => {
    navigation?.replace("ForgotPassword", { mobile: phone, lang });
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
        {/* HEADER LOGO */}
        <View style={styles.header}>
          <Text style={styles.appName}>Somacy</Text>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.largeLogo}
          />
        </View>

        {/* MAIN CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{title}</Text>

          <TextInput
            placeholder={mobilePlaceholder}
            placeholderTextColor={Colors.lightGreyText}
            style={styles.input}
            value={phone}
            // editable={false}
            onChangeText={setPhone}
            keyboardType="number-pad"
          />

          <TextInput
            placeholder={passwordPlaceholder}
            placeholderTextColor={Colors.lightGreyText}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={styles.signupRow}>
            <Text style={{ color: Colors.sign, fontSize: FontsSize.size16, fontFamily: fonts.Lexend_SemiBold }}>{signupQuestion}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login', { lang })}
              activeOpacity={0.2}
            >
              <Text style={styles.link}>{newUserText}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.policy}>
            {policyText}
            <Text style={styles.link} onPress={handlePrivacyPolicy}>{policyLink}</Text>


          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={handleContinue}
            disabled={loading}
          >
            {loading ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color={Colors.white} />
                <Text style={[styles.buttonTxt, { marginLeft: 10 }]}>{loadingText}</Text>
              </View>
            ) : (
              <Text style={styles.buttonTxt}>{continueBtn}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.lastrow} >
            <Text style={styles.forgot} onPress={handleForgotPassword}>{forgotText}</Text>
            {/* <Text style={styles.signin} onPress={() => navigation.navigate('Login')}>Sign-In</Text> */}
          </View>
        </View>
      </ScreenWrapper>
    </>
  );
};

export default PasswordScreen;

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
  cardTitle: {
    fontSize: FontsSize.size20,
    fontFamily: fonts.Lexend_SemiBold,
    marginBottom: MarginHW.MarginH2,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.background,
    borderRadius: HWSize.H_Height10,
    padding: MarginHW.PaddingH10,
    marginTop: MarginHW.MarginH10,
    fontSize: FontsSize.size16,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black,
  },
  signupRow: {
    flexDirection: 'row',
    marginTop: MarginHW.MarginH10,

  },
  link: {
    color: Colors.notehighlight,
    fontFamily: fonts.Lexend_SemiBold,
    fontSize: FontsSize.size16
  },
  policy: {
    textAlign: 'center',
    marginTop: MarginHW.MarginH10,
    fontSize: FontsSize.size16,
    color: Colors.sign,
    fontFamily: fonts.Lexend_SemiBold,
  },
  button: {
    backgroundColor: Colors.appName,
    padding: MarginHW.PaddingH10,
    borderRadius: HWSize.H_Height10,
    marginTop: MarginHW.MarginH10,
    alignItems: 'center',
  },
  buttonTxt: {
    color: Colors.text,
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,
  },
  lastrow: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: MarginHW.MarginH10,
    gap: MarginHW.MarginW10,
  },
  forgot: {
    textAlign: 'center',
    fontSize: FontsSize.size14,
    color: Colors.sign,
    fontFamily: fonts.Lexend_SemiBold,
  },
  // signin: {
  //   textAlign: 'center',
  //   fontSize: FontsSize.size14,
  //   color: Colors.appName,
  //   fontFamily: fonts.Lexend_SemiBold,
  // }
});
