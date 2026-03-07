
import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/AppNavigator';
import { Alert } from 'react-native';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../src/comman/comman/Colors';
import FontsSize from '../comman/comman/FontsSize';
import HWSize from '../comman/comman/HWSize';
import MarginHW from '../comman/comman/MarginHW';
import fonts from '../comman/comman/fonts';
import ScreenWrapper from '../comman/comman/ScreenWrapper';
import { getAuth, signInWithPhoneNumber } from "@react-native-firebase/auth";
import { useDispatch } from 'react-redux';
import { setVerificationId } from '../Redux/Slices/authSlice';

type Language = "en" | "hi";
type Props = NativeStackScreenProps<RootStackParamList, 'OtpScreen'>;

const OtpScreen = ({ navigation, route, }: Props) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const { mobile, confirmation, lang } = route.params;
  const [confirmResult, setConfirmResult] = useState<any>(confirmation);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  // const [lang, setLang] = useState<"en" | "hi">("en");
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const dispatch = useDispatch()

  /* Localization Data */
  const textData: Record<Language, {
    titlePre: string;
    titlePost: string;
    ifNotReceived: string;
    resendLink: string;
    resendTimerText: string;
    resendTimerUnit: string;
    continueBtn: string;
  }> = {
    en: {
      titlePre: "Enter the 6-digit code sent to you at ",
      titlePost: "",
      ifNotReceived: "If you not receive OTP?",
      resendLink: "Re-send again",
      resendTimerText: "Resend in ",
      resendTimerUnit: "s",
      continueBtn: "Continue",
    },
    hi: {
      titlePre: "",
      titlePost: " पर भेजा गया 6-अंकों का कोड दर्ज करें",
      ifNotReceived: "यदि आपको ओटीपी नहीं मिला?",
      resendLink: "फिर से भेजें",
      resendTimerText: "में पुनः भेजें ",
      resendTimerUnit: " सेकंड",
      continueBtn: "जारी रखें",
    },
  };

  const { titlePre, titlePost, ifNotReceived, resendLink, resendTimerText, resendTimerUnit, continueBtn } = textData[lang as keyof typeof textData];

  const handleOtp = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handleBackspace = (key: string, index: number) => {
    if (key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const resendOtp = async () => {
    try {
      setCanResend(false);
      setTimer(59);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      const auth = getAuth();
      const newConfirmation = await signInWithPhoneNumber(
        auth,
        `+91${mobile}`
      );
      const fb_token_data = newConfirmation?.verificationId
      if (!fb_token_data) {
        Alert.alert("Error", "Failed to get verification ID. Try again.");
        return;
      }
      dispatch(setVerificationId(fb_token_data));
      setConfirmResult(newConfirmation);
      setWrongAttempts(0);
      Alert.alert('OTP Sent', 'A new OTP has been sent to your number');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };


  const handleSubmit = async () => {
    if (!confirmResult) {
      Alert.alert('Error', 'OTP session expired. Please resend OTP.');
      return;
    }
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP');
      return;
    }
    try {
      const res = await confirmResult.confirm(otpCode);
      dispatch(setVerificationId(confirmResult?.verificationId));


      console.log(res?.user?._user, "ressssss");

      if (route.params.isForgotPassword) {
        navigation.replace('ConfirmPasswordScreen', { mobile, lang });
      } else {
        navigation.replace('SignupDetailsScreen', { mobile, lang });
      }

      // if(res?.user)


    } catch (error: any) {
      const attempts = wrongAttempts + 1;
      setWrongAttempts(attempts);

      if (attempts >= 3) {
        Alert.alert(
          'Too many attempts',
          'You have entered wrong OTP multiple times. Please resend OTP.'
        );
        setCanResend(true);
      } else {
        Alert.alert(
          'Invalid OTP',
          `Incorrect OTP. Attempts left: ${3 - attempts}`
        );
      }
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
        <View style={styles.header}>
          <Text style={styles.appName}>Somacy</Text>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.largeLogo}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>
            {titlePre}
            <Text style={styles.phone}>+91 {mobile}</Text>
            {titlePost}
          </Text>

          {/* OTP Boxes */}
          <View style={styles.otpRow}>
            {otp.map((digit, i) => (
              <TextInput
                key={i}
                ref={ref => {
                  inputRefs.current[i] = ref;
                }}
                style={styles.otpBox}
                value={digit}
                keyboardType="numeric"
                maxLength={1}
                onChangeText={v => handleOtp(v, i)}
                onKeyPress={({ nativeEvent }) =>
                  handleBackspace(nativeEvent.key, i)
                }
              />
            ))}
          </View>

          <Text style={styles.receiveOtp}>{ifNotReceived}</Text>

          <Text style={styles.resend}>
            {canResend ? (
              <Text style={styles.resendLink} onPress={resendOtp}>
                {resendLink}
              </Text>
            ) : (
              <Text>{resendTimerText}{timer}{resendTimerUnit}</Text>
            )}
          </Text>


          <TouchableOpacity style={styles.continueBtn} onPress={handleSubmit}>
            <Text style={styles.continueText}>{continueBtn}</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    </>
  );
};

export default OtpScreen;

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
    textAlign: 'center',
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,
    marginBottom: MarginHW.MarginH10,
  },
  phone: {
    color: Colors.notehighlight,
    fontFamily: fonts.Lexend_SemiBold,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: MarginHW.MarginH20,
  },
  otpBox: {
    width: HWSize.W_Width40,
    height: HWSize.H_Height40,
    borderWidth: HWSize.H_Height2,
    borderColor: Colors.button,
    borderRadius: HWSize.H_Height10,
    textAlign: 'center',
    fontSize: FontsSize.size22,
    backgroundColor: Colors.text,
    fontFamily: fonts.Lexend_SemiBold,
  },

  receiveOtp: {
    color: Colors.black,
    textAlign: 'center',
    fontSize: FontsSize.size16,
    marginBottom: MarginHW.MarginH10,
    fontFamily: fonts.Lexend_SemiBold,
  },
  resend: {
    textAlign: 'center',
    fontSize: FontsSize.size18,
    marginBottom: MarginHW.MarginH18,
    color: Colors.tabIconDefault,
    fontFamily: fonts.Lexend_SemiBold,
  },
  resendLink: { color: Colors.notehighlight },
  continueBtn: {
    backgroundColor: Colors.secondary_button,
    paddingVertical: MarginHW.PaddingH14,
    borderRadius: HWSize.H_Height10,
    alignItems: 'center',
  },
  continueText: {
    color: Colors.white,
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,
  },
});
