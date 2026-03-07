import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

import { Colors } from '../../src/comman/comman/Colors';
import FontsSize from '../comman/comman/FontsSize';
import HWSize from '../comman/comman/HWSize';
import MarginHW from '../comman/comman/MarginHW';
import fonts from '../comman/comman/fonts';
import ScreenWrapper from '../comman/comman/ScreenWrapper';

import { getAuth, signInWithPhoneNumber } from "@react-native-firebase/auth";

type Language = "en" | "hi";

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

const ForgotPassword = ({ navigation, route }: Props) => {
  const { lang } = route.params;
  const [mobile, setMobile] = useState(route.params.mobile || '');
  const [loading, setLoading] = useState(false);

  /* Localization Data */
  const textData: Record<Language, {
    title: string;
    cardTitle: string;
    placeholder: string;
    continueBtn: string;
    loadingText: string;
  }> = {
    en: {
      title: "Forgot Password",
      cardTitle: "Forgot Password?",
      placeholder: "Enter 10 digit mobile no",
      continueBtn: "Continue",
      loadingText: "Please wait...",
    },
    hi: {
      title: "पासवर्ड भूल गए",
      cardTitle: "पासवर्ड भूल गए?",
      placeholder: "10 अंकों का मोबाइल नंबर दर्ज करें",
      continueBtn: "जारी रखें",
      loadingText: "कृपया प्रतीक्षा करें...",
    },
  };

  const { title, cardTitle, placeholder, continueBtn, loadingText } = textData[lang as keyof typeof textData];


  const handleContinue = async () => {
    if (mobile.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }
    try {
      setLoading(true);

      const res = await fetchMobileCheck(mobile);
      console.log(res, "resssss");

      if (res?.Result === 'false') {
        const authInstance = getAuth();
        const confirmation = await signInWithPhoneNumber(authInstance, `+91${mobile}`);
        navigation.replace('OtpScreen', {
          mobile,
          confirmation,
          isForgotPassword: true,
          lang,
        });
      } else {
        navigation.replace('PasswordScreen', { mobile, lang });
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Unable to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar backgroundColor={Colors.surface} barStyle="dark-content" />
      <ScreenWrapper style={styles.container} edges={['left', 'right', 'bottom']}>
        <View style={styles.header}>
          <Text style={styles.appName}>Somacy</Text>
          <Image source={require('../assets/images/logo.png')} style={styles.largeLogo} />
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>{cardTitle}</Text>

          <View style={styles.inputContainer}>
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

          <TouchableOpacity style={styles.continueBtn} onPress={() => handleContinue()} disabled={loading}>
            {loading ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color={Colors.white} />
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

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Colors.,
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
    marginHorizontal: MarginHW.MarginH14,
    width: HWSize.W_Width350,
  },
  title: {
    fontSize: FontsSize.size20,
    fontFamily: fonts.Lexend_SemiBold,
    marginBottom: MarginHW.MarginH16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: HWSize.H_Height2,
    borderColor: Colors.borderColor,
    borderRadius: HWSize.H_Height10,
    paddingHorizontal: MarginHW.PaddingH10,
    marginBottom: MarginHW.MarginH16,
    height: HWSize.H_Height50,
  },

  prefix: {
    marginRight: MarginHW.MarginH10,
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.noteText,
  },
  input: {
    flex: 1,
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black,
  },
  continueBtn: {
    backgroundColor: Colors.background,
    paddingVertical: MarginHW.PaddingH10,
    borderRadius: HWSize.H_Height10,
    alignItems: 'center',
    marginVertical: MarginHW.MarginH10,
    height: HWSize.H_Height50,
    justifyContent: 'center',
  },
  continueText: {
    color: Colors.text,
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,
  },
});
