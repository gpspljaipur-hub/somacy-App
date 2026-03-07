import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Alert,

} from 'react-native';

import { resetUserPassword, FetchLoginUserDetails } from '../Service/HomePageService';
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

const ConfirmPasswordScreen = ({ navigation, route }: any) => {
  const { mobile, lang } = route.params;
  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const lastLoggedUserId = useSelector((state: RootState) => state.auth.lastLoggedUserId);

  /* Localization Data */
  const textData: Record<Language, {
    title: string;
    placeholderPass: string;
    placeholderConfirmPass: string;
    continueBtn: string;
  }> = {
    en: {
      title: "Enter New Password",
      placeholderPass: "Enter Password",
      placeholderConfirmPass: "Enter Confirm password",
      continueBtn: "Continue",
    },
    hi: {
      title: "नया पासवर्ड दर्ज करें?",
      placeholderPass: "पासवर्ड दर्ज करें",
      placeholderConfirmPass: "पुष्टि के लिए पासवर्ड दर्ज करें",
      continueBtn: "जारी रखें",
    },
  };

  const { title, placeholderPass, placeholderConfirmPass, continueBtn } = textData[lang as keyof typeof textData];

  const handleLoginSuccess = async (newUser: any) => {
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
      JSON.stringify(newUser)
    );

    Alert.alert("Success", "Password updated successfully", [
      {
        text: "OK",
        onPress: () => navigation.replace("MainPageDetailsScrren"),
      },
    ]);
  };

  const handleContinue = async () => {

    try {

      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match");

        return;
      } else {
        const res = await resetUserPassword(mobile, password);
        if (res?.Result === "true") {
          if (res?.UserLogin) {
            await handleLoginSuccess(res.UserLogin);
          } else {
            // Fallback: Fetch user details explicitly if not returned by reset API
            const loginRes = await FetchLoginUserDetails(mobile, password);
            if (loginRes?.Result === "true" && loginRes?.UserLogin) {
              await handleLoginSuccess(loginRes.UserLogin);
            } else {
              // Should rarely happen if reset was successful
              Alert.alert("Success", "Password updated successfully. Please login.", [
                {
                  text: "OK",
                  onPress: () => navigation.replace("Login", { lang }),
                },
              ]);
            }
          }
        } else {
          Alert.alert("Message", res?.ResponseMsg || "Failed to update password");
        }
      }
    } catch (error) {
      Alert.alert("Error", "Server not responding");

    }
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
            placeholder={placeholderPass}
            placeholderTextColor={Colors.lightGreyText}
            style={styles.input}
            value={password}
            onChangeText={setPassword}

            secureTextEntry
          />

          <TextInput
            placeholder={placeholderConfirmPass}
            placeholderTextColor={Colors.lightGreyText}
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}

            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonTxt}>{continueBtn}</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    </>
  );
};

export default ConfirmPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backHandler,
    paddingHorizontal: MarginHW.PaddingH16,
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
    marginTop: MarginHW.MarginH14,
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
});
