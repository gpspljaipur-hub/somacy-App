import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, Image, TouchableOpacity, Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Added
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../comman/comman/Colors';
import FontsSize from '../comman/comman/FontsSize';
import HWSize from '../comman/comman/HWSize';
import MarginHW from '../comman/comman/MarginHW';
import fonts from '../comman/comman/fonts';

interface WelcommodelProps {
    visible: boolean;
    onClose: () => void;
}

const Welcommodel = ({ visible, onClose }: WelcommodelProps) => {
    const navigation = useNavigation<any>();
    const [lang, setLang] = useState<"en" | "hi">("en");

    useEffect(() => {
        const checkLang = async () => {
            const stored = await AsyncStorage.getItem("app_lang");
            if (stored === "en" || stored === "hi") {
                setLang(stored);
            }
        };
        checkLang();
    }, []);

    /* Localization Data */
    const textData = {
        en: {
            head: "Welcome to Somacy",
            bullets: [
                "The convenient way to shop and pay only when your order arrives at your doorstep. No upfront payments required!",
                "When adding items to your cart, please make sure that the total meets or exceeds the Rs 199 minimum.",
                "This will help you enjoy a seamless checkout process without any disruptions.",
            ],
            policyText: "By clicking continue, you agree with our ",
            policyLink: "Terms & Condition",
            acceptBtn: "Accept",
        },
        hi: {
            head: "सोमसी में आपका स्वागत है",
            bullets: [
                "खरीदारी का सुविधाजनक तरीका और भुगतान केवल तभी करें जब आपका ऑर्डर आपके दरवाजे पर पहुंचे। कोई अग्रिम भुगतान आवश्यक नहीं!",
                "आइटम को कार्ट में जोड़ते समय, कृपया सुनिश्चित करें कि कुल राशि 199 रुपये या उससे अधिक हो।",
                "यह आपको बिना किसी बाधा के एक सहज चेकआउट प्रक्रिया का आनंद लेने में मदद करेगा।",
            ],
            policyText: "जारी रखने पर, आप हमारी ",
            policyLink: "नियम और शर्तों से सहमत होते हैं",
            acceptBtn: "स्वीकार करें",
        },
    };

    const { head, bullets, policyText, policyLink, acceptBtn } = textData[lang];

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    <Image
                        source={require('../assets/images/logo.png')}
                        style={styles.logo}
                    />

                    <Text style={styles.head}>{head}</Text>

                    <View style={styles.contentContainer}>
                        {bullets.map((point, index) => (
                            <View key={index} style={styles.bulletItem}>
                                <View style={styles.bulletDot} />
                                <Text style={styles.bulletText}>{point}</Text>
                            </View>
                        ))}

                        <View style={styles.bulletItem}>
                            <View style={styles.bulletDot} />
                            <Text style={styles.bulletText}>
                                {policyText}
                                <TouchableOpacity onPress={() => navigation.navigate('WebViewScreen', { url: 'https://somacy.in/term.html', title: 'Terms & Condition' })}>
                                    <Text style={styles.linkText}>{policyLink}</Text>
                                </TouchableOpacity>
                            </Text>
                        </View>
                    </View>


                    <TouchableOpacity
                        style={styles.button}
                        onPress={onClose}
                    >
                        <Text style={styles.buttonText}>{acceptBtn}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal >
    );
};

export default Welcommodel;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: Colors.overlayMuted,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        width: '90%',
        backgroundColor: Colors.white,
        borderRadius: HWSize.H_Height12,
        padding: MarginHW.PaddingH20,
        alignItems: 'center',
        elevation: 10,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    logo: {
        width: HWSize.W_Width60,
        height: HWSize.H_Height60,
        resizeMode: 'contain',
        marginBottom: MarginHW.MarginH10,
    },
    head: {
        fontSize: FontsSize.size22,
        fontFamily: fonts.Lexend_SemiBold,
        color: Colors.black,
        marginBottom: MarginHW.MarginH20,
    },
    contentContainer: {
        width: '100%',
        marginBottom: MarginHW.MarginH24,
    },
    bulletItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: MarginHW.MarginH14,
    },
    bulletDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.accentBlue,
        marginTop: 6,
        marginRight: MarginHW.MarginW12,
    },
    bulletText: {
        flex: 1,
        fontSize: FontsSize.size14,
        fontFamily: fonts.Lexend_Medium,
        color: Colors.nearBlack,
        lineHeight: 20,
    },
    linkText: {
        color: Colors.accentBlue,
        fontFamily: fonts.Lexend_SemiBold,
    },
    button: {
        backgroundColor: Colors.confirm_button,
        width: '50%',
        paddingVertical: MarginHW.PaddingH10,
        borderRadius: HWSize.H_Height10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: Colors.white,
        fontSize: FontsSize.size18,
        fontFamily: fonts.Lexend_SemiBold,
    },
});