import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store/store";
import { RootStackParamList } from '../navigations/AppNavigator';
import { Colors } from '../comman/comman/Colors';
import MarginHW from '../comman/comman/MarginHW';
import ImageSize from '../comman/comman/ImageSize';
import FontsSize from '../comman/comman/FontsSize';
import fonts from '../comman/comman/fonts';
import HWSize from '../comman/comman/HWSize';
import ScreenWrapper from '../comman/comman/ScreenWrapper';
import { fetchCouponList } from '../Service/HomePageService';
import API_CONFIG from '../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CouponScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const user = useSelector((state: RootState) => state.auth.user);
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [lang, setLang] = useState<"en" | "hi">("en");

    useEffect(() => {
        getCoupons();
        const checkLang = async () => {
            const stored = await AsyncStorage.getItem("app_lang");
            if (stored === "en" || stored === "hi") {
                setLang(stored);
            }
        };
        checkLang();
    }, []);

    const textData = {
        en: {
            headerTitle: "Coupon Code",
            apply: "Apply",
            seeMore: "See More",
            noCoupon: "No Coupon Found.",
        },
        hi: {
            headerTitle: "कूपन कोड",
            apply: "लागू करें",
            seeMore: "और देखें",
            noCoupon: "कोई कूपन नहीं मिला।",
        },
    };

    const { headerTitle, apply, seeMore, noCoupon } = textData[lang];

    const getCoupons = async () => {

        setLoading(true);

        try {
            if (!user) {
                console.log('No user found, cannot fetch coupons');
                setLoading(false);
                return;
            }
            console.log('Fetching coupons for UID:', user.id);
            const res = await fetchCouponList(user.id);
            console.log('Coupon API Response RAW:', JSON.stringify(res, null, 2));
            if (res?.Result === 'true') {
                setCoupons(res.couponlist || []);
            }
        } catch (error) {

            console.log('Error fetching coupons', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApplyCoupon = (item: any) => {
        navigation.navigate('Cart', { appliedCoupon: item, lang: lang });
    };

    const renderCoupon = ({ item }: { item: any }) => (
        <View style={styles.couponCard}>
            <View style={styles.cardHeader}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: `${API_CONFIG.IMG_URL}/${item.c_img}` }}
                        style={styles.couponImage}
                    />
                    <Text style={styles.separator}>|</Text>
                    <Text style={styles.discountText}>{item.coupon_title}</Text>
                </View>

                <View style={styles.headerContent}>
                    <TouchableOpacity
                        style={styles.applyButton}
                        activeOpacity={0.7}
                        onPress={() => handleApplyCoupon(item)}
                    >
                        <Text style={styles.applyBtnText}>{apply}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.couponCode}>{item.coupon_code}</Text>
            <Text style={styles.couponDesc}>{item.c_desc}
                <Text> </Text>
                <Text style={styles.couponDesc1}>{seeMore}</Text>
            </Text>

        </View>
    );

    return (
        <ScreenWrapper style={styles.container} scroll={false}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Image
                        source={require('../assets/images/back.png')}
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}> {headerTitle} </Text>
            </View>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={Colors.appName} />
                </View>
            ) : coupons.length > 0 ? (
                <FlatList
                    data={coupons}
                    keyExtractor={(item) => item.id}
                    renderItem={renderCoupon}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.noCuponText}> {noCoupon}</Text>
                </View>
            )}
        </ScreenWrapper>
    );
};

export default CouponScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
    },
    header: {
        height: HWSize.H_Height40,
        backgroundColor: Colors.purpleBtn,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: MarginHW.PaddingW14,
        marginBottom: MarginHW.MarginH2,
    },
    backBtn: {
        padding: MarginHW.PaddingW5,
    },
    backIcon: {
        width: ImageSize.ImageW20,
        height: ImageSize.ImageH20,
        tintColor: Colors.white,
        resizeMode: 'contain',
    },
    headerTitle: {
        color: Colors.white,
        fontSize: FontsSize.size18,
        marginLeft: MarginHW.MarginW12,
        fontFamily: fonts.Lexend_SemiBold,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: MarginHW.PaddingH14,
        paddingTop: MarginHW.PaddingH5,
    },

    // Coupon Card Styles
    couponCard: {
        backgroundColor: Colors.white,
        borderRadius: HWSize.H_Height12,
        padding: MarginHW.PaddingH8,
        marginBottom: MarginHW.MarginH5,
        elevation: 2,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: Colors.lightBorder,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 0,
    },
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.backHandler,
        padding: MarginHW.PaddingH3,
        borderRadius: HWSize.H_Height10,
        marginRight: MarginHW.MarginW5,
        width: '50%',
        justifyContent: 'center',
    },
    couponImage: {
        width: HWSize.W_Width30,
        height: HWSize.H_Height30,
        resizeMode: 'contain',
    },
    separator: {
        width: 0.9,
        height: '100%',
        backgroundColor: Colors.greyText,
        marginLeft: MarginHW.MarginW2,
        marginRight: MarginHW.MarginW10,
    },
    headerContent: {
        flexDirection: 'row',
        marginTop: MarginHW.MarginH5,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    },
    discountText: {
        fontSize: FontsSize.size12,
        fontFamily: fonts.LexendBold,
        color: Colors.black,
        flex: 1,
    },
    applyButton: {
        paddingVertical: MarginHW.PaddingH3,
        paddingHorizontal: MarginHW.PaddingW12,
        borderRadius: HWSize.H_Height10,
        borderWidth: 1,
        borderColor: Colors.borderColor,
    },
    applyBtnText: {
        fontSize: FontsSize.size12,
        fontFamily: fonts.Lexend_SemiBold,
        color: Colors.greyText,
    },

    // couponBody: {
    //     marginTop: 0,
    // },
    couponCode: {
        fontSize: FontsSize.size12,
        fontFamily: fonts.LexendBold,
        color: Colors.black,
        marginBottom: MarginHW.MarginH2,
    },
    couponDesc: {
        fontSize: FontsSize.size12,
        fontFamily: fonts.Lexend_Regular,

    },

    couponDesc1: {

        fontSize: FontsSize.size12,
        fontFamily: fonts.Lexend_Regular,
        color: Colors.noteTitle,

    },


    // Empty State
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noCuponText: {
        color: Colors.appName,
        fontSize: FontsSize.normalize20,
        fontFamily: fonts.Lexend_SemiBold,
        textAlign: 'center',
    },
});
