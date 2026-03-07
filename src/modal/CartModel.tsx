import React, { useState } from 'react';
import {
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import HWSize from '../comman/comman/HWSize';
import MarginHW from '../comman/comman/MarginHW';
import { Colors } from '../comman/comman/Colors';
import FontsSize from '../comman/comman/FontsSize';
import fonts from '../comman/comman/fonts';

interface CartModalProps {
    visible: boolean;
    onClose: () => void;
    lang?: any
}
type Language = "en" | "hi";

const CartModal = ({ visible, onClose, lang }: CartModalProps) => {
    const navigation = useNavigation<any>();

    const safeLang: Language = lang ?? "en";

    const textData: Record<Language, {
        title: string;
        prescriptionCart: string;
        appCart: string;
        cancel: string;

    }> = {
        en: {
            title: "Choose Your Cart",
            prescriptionCart: "Prescription Cart",
            appCart: "App Cart",
            cancel: "Cancel",
        },
        hi: {
            title: "अपनी कार्ट चुनें",
            prescriptionCart: "प्रिस्क्रिप्शन कार्ट",
            appCart: "ऐप कार्ट",
            cancel: "रद्द करें",
        },
    };
    const { title, prescriptionCart, appCart, cancel } = textData[safeLang];

    const handleNavigate = (screen: string) => {
        onClose();
        if (screen === 'Cart') {
            navigation.navigate(screen, { lang: lang });
        } else {
            navigation.navigate(screen, { lang: lang });
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>

                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/images/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>

                    <Text style={styles.title}>{title}</Text>

                    <View style={styles.optionsContainer}>

                        <TouchableOpacity
                            style={styles.optionCard}
                            onPress={() => handleNavigate('MyPrescription')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.iconCircle}>
                                <Image
                                    source={require('../assets/images/ic_prescription_orders.png')}
                                    style={styles.optionIcon}
                                    resizeMode="contain"
                                />
                            </View>
                            <Text style={styles.optionText}>{prescriptionCart}</Text>
                        </TouchableOpacity>


                        <TouchableOpacity
                            style={styles.optionCard}
                            onPress={() => handleNavigate('Cart')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.iconCircle}>
                                <Image
                                    source={require('../assets/images/ic_cart.png')}
                                    style={styles.optionIcon}
                                    resizeMode="contain"
                                />
                            </View>
                            <Text style={styles.optionText}>{appCart}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Cancel Button */}
                    <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                        <Text style={styles.cancelText}>{cancel}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default CartModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: Colors.overlay,

        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: Colors.white,
        width: HWSize.W_Width375,
        height: HWSize.H_Height250,
        borderRadius: HWSize.H_Height10,
        paddingHorizontal: MarginHW.PaddingW20,
        alignItems: 'center',
        elevation: 5,
    },
    logoContainer: {
        marginVertical: MarginHW.MarginH10,
    },
    logo: {
        width: HWSize.W_Width50,
        height: HWSize.H_Height40,
        resizeMode: 'contain',
    },
    title: {
        fontSize: FontsSize.size22,
        fontFamily: fonts.Lexend_SemiBold,

        color: Colors.black,
        marginBottom: MarginHW.MarginH10,
        textAlign: 'center',
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: MarginHW.MarginH20,
    },
    optionCard: {
        width: '48%',
        borderWidth: HWSize.H_Height2,
        borderColor: Colors.couponSection,
        paddingVertical: MarginHW.PaddingH16,
        borderRadius: HWSize.H_Height12,
        alignItems: 'center',

    },
    iconCircle: {
        width: HWSize.W_Width60,
        height: HWSize.W_Width60,
        borderRadius: HWSize.W_Width60 / 2,

        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: MarginHW.MarginH10,
    },
    optionIcon: {
        width: HWSize.W_Width40,
        height: HWSize.H_Height40,

    },
    optionText: {
        fontSize: FontsSize.size14,
        fontFamily: fonts.Lexend_SemiBold,

        color: Colors.black,
        textAlign: 'center',
    },
    cancelButton: {
        marginTop: MarginHW.MarginH10,
        paddingVertical: MarginHW.PaddingH10,
        backgroundColor: Colors.sign,
        borderRadius: HWSize.H_Height10,
        width: '100%',
        alignItems: 'center',
    },
    cancelText: {
        fontSize: FontsSize.size16,
        fontFamily: fonts.Lexend_SemiBold,
        color: Colors.white,
    },
});
