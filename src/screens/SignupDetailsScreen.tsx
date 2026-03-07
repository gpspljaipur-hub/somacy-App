import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Colors } from '../comman/comman/Colors';
import FontsSize from '../comman/comman/FontsSize';

import MarginHW from '../comman/comman/MarginHW';
import fonts from '../comman/comman/fonts';
import HWSize from '../comman/comman/HWSize';
import ScreenWrapper from '../comman/comman/ScreenWrapper';

import { registerUser } from '../Service/HomePageService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/AppNavigator';
import { Alert, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, persistor } from '../Redux/store/store';
import { setUser } from '../Redux/Slices/authSlice';
import { restoreCart } from '../Redux/Slices/cartSlice';
import { setSelectedAddress } from '../Redux/Slices/addressSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = "en" | "hi";
type Props = NativeStackScreenProps<RootStackParamList, 'SignupDetailsScreen'>;

const SignupDetailsScreen = ({ navigation, route }: Props) => {
  const { mobile, lang } = route.params;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // const [lang, setLang] = useState<"en" | "hi">("en");

  const dispatch = useDispatch();
  const lastLoggedUserId = useSelector((state: RootState) => state.auth.lastLoggedUserId);

  /* Localization Data */
  const textData: Record<Language, {
    welcomeMsg: string;
    subtitle: string;
    firstNamePlaceholder: string;
    lastNamePlaceholder: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    policyText: string;
    policyLink: string;
    continueBtn: string;
    loadingText: string;
  }> = {
    en: {
      welcomeMsg: "Welcome to Somacy",
      subtitle: "Please provide us with a more details",
      firstNamePlaceholder: "First Name",
      lastNamePlaceholder: "Last Name",
      emailPlaceholder: "Email (Optional)",
      passwordPlaceholder: "Password",
      policyText: "By clicking continue, you agree with our ",
      policyLink: "Privacy Policy",
      continueBtn: "Continue",
      loadingText: "Please wait...",
    },
    hi: {
      welcomeMsg: "सोमसी में आपका स्वागत है",
      subtitle: "कृपया हमें और जानकारी प्रदान करें",
      firstNamePlaceholder: "पहला नाम",
      lastNamePlaceholder: "अंतिम नाम",
      emailPlaceholder: "ईमेल (वैकल्पिक)",
      passwordPlaceholder: "पासवर्ड",
      policyText: "जारी रखने पर, आप हमारी ",
      policyLink: "गोपनीयता नीति से सहमत होते हैं",
      continueBtn: "जारी रखें",
      loadingText: "कृपया प्रतीक्षा करें...",
    },
  };

  const {
    welcomeMsg,
    subtitle,
    firstNamePlaceholder,
    lastNamePlaceholder,
    emailPlaceholder,
    passwordPlaceholder,
    policyText,
    policyLink,
    continueBtn,
    loadingText,
  } = textData[lang as keyof typeof textData];

  const handleContinue = async () => {
    if (!firstName || !lastName || !password) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      // Default values for ccode and refercode as per requirement
      const ccode = "+91";
      const refercode = "";

      const res = await registerUser(firstName, lastName, email, mobile, ccode, refercode, password);
      // console.log("Signup Response:", JSON.stringify(res));

      if (res?.Result === 'true') {
        const newUser = res.UserLogin;

        // If a different user is logging in, clear all previous persisted data
        if (newUser && lastLoggedUserId && lastLoggedUserId !== newUser.id) {
          console.log("User switch detected after signup. Purging app data for fresh start...");
          await persistor.purge();
        }

        if (newUser) {
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
              // Legacy cart-only backup check
              const legacyCart = await AsyncStorage.getItem(`user_cart_${newUser.id}`);
              if (legacyCart) {
                dispatch(restoreCart(JSON.parse(legacyCart)));
              }
            }
          } catch (e) {
            console.log("Error restoring user profile data after signup:", e);
          }

          await AsyncStorage.setItem("app_user", JSON.stringify(newUser));
        }

        // Navigate to Main Page on success
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainPageDetailsScrren' }],
        });
      } else {
        Alert.alert('Signup Failed', res?.ResponseMsg || 'Something went wrong');
      }
    } catch (error) {
      console.error("Signup Error:", error);
      Alert.alert('Error', 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.white}
      />

      <ScreenWrapper
        style={styles.container}
        edges={['left', 'right', 'bottom']}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Somacy</Text>
          <Text style={styles.welcome}>{welcomeMsg}</Text>
          <Text style={styles.subtitle}>
            {subtitle}
          </Text>
          <View style={styles.row}>
            <TextInput
              placeholder={firstNamePlaceholder}
              placeholderTextColor={Colors.lightGreyText}
              style={styles.inputHalf}
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              placeholder={lastNamePlaceholder}
              placeholderTextColor={Colors.lightGreyText}
              style={styles.inputHalf}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <TextInput
            placeholder={emailPlaceholder}
            placeholderTextColor={Colors.lightGreyText}
            style={styles.inputFull}
            value={email}
            onChangeText={setEmail}
          />

          {/* Password */}
          <TextInput
            placeholder={passwordPlaceholder}
            placeholderTextColor={Colors.lightGreyText}
            secureTextEntry
            style={styles.inputFull}
            value={password}
            onChangeText={setPassword}
          />

          {/* Policy */}
          <View style={styles.bottom}>
            <Text style={styles.policy}>
              {policyText}
              <Text style={styles.link}>{policyLink}</Text>
            </Text>

            {/* Continue Button */}
            <TouchableOpacity
              style={[styles.button, loading && { opacity: 1 }]}
              onPress={handleContinue}
              disabled={loading}
            >
              {loading ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ActivityIndicator color={Colors.white} />
                  <Text style={[styles.buttonTxt, { marginLeft: 10 }]}>{loadingText}</Text>
                </View>
              ) : (
                <Text style={styles.buttonTxt}>{continueBtn}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScreenWrapper>

    </>
  );
};

export default SignupDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: MarginHW.PaddingH12,
    marginTop: MarginHW.MarginH20,
  },
  title: {
    textAlign: 'center',
    fontSize: FontsSize.size28,
    fontFamily: fonts.Lexend_SemiBold,

  },
  welcome: {
    textAlign: 'center',
    fontSize: FontsSize.size20,
    fontFamily: fonts.Lexend_SemiBold,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: FontsSize.size14,
    color: Colors.sign,
    marginBottom: MarginHW.MarginH14,
    fontFamily: fonts.Lexend_SemiBold,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    width: '48%',
    borderWidth: HWSize.H_Height2,
    borderColor: Colors.couponSection,
    borderRadius: HWSize.H_Height10,
    padding: MarginHW.PaddingH12,
    marginBottom: MarginHW.MarginH10,
    backgroundColor: Colors.transparent,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black,

  },
  inputFull: {
    width: '100%',
    borderWidth: HWSize.H_Height2,
    borderColor: Colors.couponSection,
    borderRadius: HWSize.H_Height10,
    padding: MarginHW.PaddingH12,
    marginBottom: MarginHW.MarginH10,
    backgroundColor: Colors.transparent,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black,
  },
  policy: {
    fontSize: FontsSize.size18,
    color: Colors.tabIconDefault,
    textAlign: 'left',

    marginTop: MarginHW.MarginH100,
    fontFamily: fonts.Lexend_SemiBold,
  },
  link: {
    color: Colors.secondary_button,
    fontFamily: fonts.Lexend_SemiBold

  },
  button: {
    backgroundColor: Colors.appName,
    paddingVertical: MarginHW.PaddingH12,
    borderRadius: HWSize.H_Height10,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: MarginHW.MarginH18,
  },
  buttonTxt: {
    color: Colors.white,
    fontSize: FontsSize.size20,
    fontFamily: fonts.Lexend_SemiBold
  },
  bottom: {
    marginTop: 'auto',
    gap: HWSize.H_Height12
  },
});
