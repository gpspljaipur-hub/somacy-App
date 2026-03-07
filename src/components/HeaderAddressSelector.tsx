import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { RootState } from "../Redux/store/store";
import { Colors } from "../comman/comman/Colors";
import FontsSize from "../comman/comman/FontsSize";
import HWSize from "../comman/comman/HWSize";
import MarginHW from "../comman/comman/MarginHW";
import fonts from "../comman/comman/fonts";

type Language = "en" | "hi";

const HeaderAddressSelector = ({ style, lang }: { style?: any, lang?: Language }) => {
    const navigation = useNavigation<any>();
    const selectedAddress = useSelector((state: RootState) => state.address.selectedAddress);

    const textData: Record<Language, {
        deliverTo: string;
        selectLocation: string;
        selectAddress: string;
    }> = {
        en: {
            deliverTo: "Deliver to ",
            selectLocation: "Select Location",
            selectAddress: "Select Address",
        },
        hi: {
            deliverTo: "डिलीवर करें ",
            selectLocation: "स्थान चुनें",
            selectAddress: "पता चुनें",
        },
    };

    const { deliverTo, selectLocation, selectAddress } = textData[lang as keyof typeof textData];
    // console.log(selectedAddress, "selectedAddressselectedAddress");
    const getAddressText = () => {
        if (!selectedAddress) return selectLocation;

        let fullAddress = "";
        if (selectedAddress.hno) fullAddress += `${selectedAddress.hno}, `;
        fullAddress += selectedAddress.address;
        if (selectedAddress.landmark) fullAddress += `, ${selectedAddress.landmark}`;
        return fullAddress;
    };

    return (
        <TouchableOpacity
            style={[styles.addressRow, style]}
            onPress={() => navigation.navigate("MyAddressData", { lang: lang })}
        >
            <Image
                source={require("../assets/images/address.png")}
                style={styles.locationIcon}
            />
            <View style={{ flex: 1, marginLeft: MarginHW.MarginW5 }}>
                {selectedAddress ? (
                    <Text style={styles.addressLabel} numberOfLines={1} ellipsizeMode="tail">
                        <Text style={{ color: Colors.black, textDecorationLine: "underline" }}>{deliverTo}</Text>
                        {getAddressText()}
                    </Text>
                ) : (
                    <Text style={styles.addressLabel}>{selectAddress}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    addressRow: {
        flexDirection: "row",
        alignItems: "center",

        maxWidth: HWSize.W_Width250,
    },
    locationIcon: {
        width: HWSize.W_Width12,
        height: HWSize.H_Height12,
        tintColor: Colors.black,

    },
    addressLabel: {
        fontSize: FontsSize.size13,
        fontFamily: fonts.Lexend_SemiBold,
        color: Colors.black,
    },
});

export default HeaderAddressSelector;
