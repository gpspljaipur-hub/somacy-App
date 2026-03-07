import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/AppNavigator';
import { Colors } from '../comman/comman/Colors';
import HWSize from '../comman/comman/HWSize';
import MarginHW from '../comman/comman/MarginHW';
import FontsSize from '../comman/comman/FontsSize';
import ScreenWrapper from '../comman/comman/ScreenWrapper';
import fonts from '../comman/comman/fonts';
type Props = NativeStackScreenProps<RootStackParamList, 'SelectAddress'>;

const SelectAddress = ({ navigation, route }: Props) => {
  const { lang } = route.params;
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.locationRow}
          onPress={() => {
            navigation.navigate("MapScreen", {
              isEdit: false,
              lang: lang,
            });
          }}
          activeOpacity={0.7}
        >
          <View style={styles.iconWrap}>
            <Image
              source={require('../assets/images/address.png')}
              style={styles.logo}
              resizeMode="contain"
            />{' '}
          </View>

          <View style={styles.textWrap}>
            <Text style={styles.title}>Current Location</Text>
            <Text style={styles.subTitle}>Using GPS</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default SelectAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.transparent,
  },
  logo: {
    width: HWSize.W_Width30,
    height: HWSize.H_Height30,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: MarginHW.PaddingH12,
    paddingVertical: MarginHW.PaddingW12,
    borderBottomWidth: HWSize.H_Height1,
    borderColor: Colors.couponSection,
  },

  iconWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  textWrap: {
    flex: 1,
    marginLeft: MarginHW.MarginH12,
  },

  title: {
    fontSize: FontsSize.size16,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black,
  },

  subTitle: {
    fontSize: FontsSize.size14,
    color: Colors.sign,
    marginTop: MarginHW.MarginH2,
    fontFamily: fonts.Lexend_SemiBold,
  },
});
