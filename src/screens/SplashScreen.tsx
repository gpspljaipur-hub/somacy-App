import React, { useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/AppNavigator';
import { Colors } from '../comman/comman/Colors';
import FontsSize from '../comman/comman/FontsSize';

import MarginHW from '../comman/comman/MarginHW';
import fonts from '../comman/comman/fonts';
import HWSize from '../comman/comman/HWSize';
import ScreenWrapper from '../comman/comman/ScreenWrapper';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store/store';

type Props = NativeStackScreenProps<RootStackParamList, 'SplashScreen'>;

const SplashScreen = ({ navigation }: Props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { isLoggedIn } = useSelector((state: RootState) => state.auth)
  // SplashScreen.tsx
  useEffect(() => {
    const onAppLaunch = async () => {
      await AsyncStorage.setItem('APP_LAUNCHED', 'true');
      await AsyncStorage.removeItem('APP_CONFIRM_MODAL_SHOWN');
    };

    onAppLaunch();
  }, []);


  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoggedIn) {
        navigation.replace("MainPageDetailsScrren");
      } else {
        navigation.replace("LanguageSelect");
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [isLoggedIn]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(async () => {
      const lang = await AsyncStorage.getItem('app_lang');
      if (lang) navigation.replace('Home', { lang: lang });
      else navigation.replace('LanguageSelect');
    }, 2000);

    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <Image
          source={require('../assets/images/splash_character.png')}
          style={styles.image}
        />

        <View style={styles.row}>
          <Image
            source={require('../assets/images/splash_logo.png')}
            style={styles.logo}
          />
          {/* <Text style={styles.brand}>SOMACY</Text> */}
        </View>

        <Text style={styles.tagline}>Somacy always with you</Text>
      </Animated.View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: HWSize.W_Width350,
    height: HWSize.H_Height350,
    resizeMode: 'contain',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: MarginHW.MarginH20,
  },
  logo: {
    width: HWSize.W_Width180,
    height: HWSize.H_Height80,
    marginRight: MarginHW.MarginW2,
    resizeMode: 'contain',
  },
  brand: {
    fontSize: FontsSize.size30,
    color: Colors.text,
    fontFamily: fonts.Lexend_SemiBold,
  },
  tagline: {
    color: Colors.tagline,
    marginTop: MarginHW.MarginH5,
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,

  },
});
