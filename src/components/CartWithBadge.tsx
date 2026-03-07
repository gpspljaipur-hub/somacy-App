import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { RootState } from "../Redux/store/store";
import { Colors } from "../comman/comman/Colors";
import HWSize from "../comman/comman/HWSize";
import FontsSize from "../comman/comman/FontsSize";
import fonts from "../comman/comman/fonts";

import CartModal from "../modal/CartModel";

const CartWithBadge = ({ style, lang }: { style?: any; lang?: any }) => {
    const navigation = useNavigation<any>();
    const [cartModalVisible, setCartModalVisible] = useState(false);

    const cartItems = useSelector((state: RootState) => state.cart.items);
    const prescriptionHistory = useSelector(
        (state: RootState) => state.home.prescriptionHistory
    );

    const cartCount = Object.keys(cartItems).length;

    const handlePress = () => {
        const hasActivePrescriptions = prescriptionHistory?.some(
            (item: any) =>
                // item.status === "Pending" ||
                // item.status === "Confirmed" ||
                (item.status !== "Delivered" && item.status !== "Cancelled")
        );

        if (hasActivePrescriptions) {
            setCartModalVisible(true);
        } else {
            navigation.navigate("Cart", { lang: lang });
        }
    };

    return (
        <>
            <TouchableOpacity onPress={handlePress} style={[styles.container, style]}>
                <Image
                    source={require("../assets/images/ic_cart.png")}
                    style={styles.cartIcon}
                />
                {cartCount > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {cartCount > 9 ? "9+" : cartCount}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
            <CartModal
                visible={cartModalVisible}
                onClose={() => setCartModalVisible(false)}
                lang={lang}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
    },
    cartIcon: {
        width: HWSize.W_Width15,
        height: HWSize.H_Height15,
        resizeMode: "contain",
    },
    badge: {
        position: "absolute",
        // right: -HWSize.W_Width,
        top: -HWSize.H_Height3,
        backgroundColor: Colors.red,
        borderRadius: HWSize.H_Height10,
        minWidth: HWSize.W_Width15,
        height: HWSize.W_Width15,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.white,
    },
    badgeText: {
        color: Colors.white,
        fontSize: FontsSize.size10,
        fontFamily: fonts.LexendBold,
        textAlign: "center",
    },
});

export default CartWithBadge;
