import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../src/comman/comman/Colors';
import FontsSize from '../comman/comman/FontsSize';
import HWSize from '../comman/comman/HWSize';
import MarginHW from '../comman/comman/MarginHW';
import fonts from '../comman/comman/fonts';
import ImageSize from "../comman/comman/ImageSize";
import ScreenWrapper from '../comman/comman/ScreenWrapper';

const About = () => {
    const navigation = useNavigation();

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('../assets/images/back.png')} style={styles.backIcon} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>About Somacy</Text>

                </View>

                <View style={styles.mainContainer}>
                    <View style={styles.card}>
                        <Text style={styles.text}>
                            Somacy is the pharmacy app which brings you medicine delivery, lab tests and RGHS facility on one single platform. Get your medications, both OTC and prescription, and healthcare products at affordable. You can conveniently order your medicines from anywhere, at any time.
                        </Text>
                        <Text style={styles.textBold}>
                            Somacy App is owned and operated by Soni Medicals, whose registered office is at lalsot Road, Dausa (303303) Rajasthan, India.
                        </Text>
                    </View>
                    <Image source={require('../assets/images/logo.png')} style={styles.logo} />
                </View>
            </View>
        </ScreenWrapper>
    );
};

export default About;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        height: HWSize.H_Height40,
        backgroundColor: Colors.purpleBtn,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: MarginHW.PaddingW14,
        marginBottom: MarginHW.MarginH12,
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

    backBtn: {
        padding: MarginHW.PaddingW5,
    },
    mainContainer: {
        marginTop: HWSize.H_Height30,
        marginHorizontal: MarginHW.MarginW16,
        position: 'relative',
        alignItems: 'center',
    },
    card: {

        borderRadius: HWSize.H_Height10,
        borderWidth: HWSize.H_Height1,
        borderColor: Colors.tint,
        paddingTop: HWSize.H_Height50,
        paddingBottom: MarginHW.PaddingH20,
        paddingHorizontal: MarginHW.PaddingW20,
        width: '100%',
    },
    logo: {
        position: 'absolute',
        top: -HWSize.H_Height36,
        width: HWSize.W_Width80,
        height: HWSize.H_Height80,
        resizeMode: 'contain',
    },
    text: {
        fontSize: FontsSize.normalize16,
        fontFamily: fonts.Lexend_SemiBold,
        color: Colors.black,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: MarginHW.MarginH10,
    },
    textBold: {
        fontSize: FontsSize.normalize16,
        // fontWeight:400,
        fontFamily: fonts.Lexend_SemiBold,
        color: Colors.black,
        textAlign: 'center',
        lineHeight: 24,

    },
});
