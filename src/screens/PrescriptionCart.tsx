import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    StatusBar,
    Modal,
    Alert,
} from 'react-native';
import ImageSize from "../comman/comman/ImageSize";
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from "react-redux";
import { RootStackParamList } from '../navigations/AppNavigator';
import { RootState } from "../Redux/store/store";
import API_CONFIG from "../config/apiConfig";

import HWSize from "../comman/comman/HWSize";
import MarginHW from "../comman/comman/MarginHW";
import { Colors } from "../comman/comman/Colors";
import FontsSize from "../comman/comman/FontsSize";
import fonts from "../comman/comman/fonts";
import ScreenWrapper from "../comman/comman/ScreenWrapper";
import OrderConfirm from "../modal/OrderConfirm";
import { fetchPresHistory, paymentGatewayImage, prescriptionPayment } from "../Service/HomePageService";
import { calculateMRP } from "../utils/PriceUtils";

const PrescriptionCart = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'PrescriptionCart'>>();
    const user = useSelector((state: RootState) => state.auth.user);
    const selectedAddress = useSelector((state: RootState) => state.address.selectedAddress);
    const routeItems = route.params?.items;
    console.log("routeItems", routeItems);
    const presId = route.params?.presId;
    const presType = route?.params?.presType
    const lang = route.params?.lang;
    const items = (routeItems && routeItems.length > 0) ? routeItems : [];
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showOrderConfirm, setShowOrderConfirm] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<any>(null);
    const [paymentImg, setPaymentImg] = useState<any>([]);
    const [orderData, setOrderData] = useState([])

    useEffect(() => {
        if (route.params && (route.params as any).appliedCoupon) {
            setAppliedCoupon((route.params as any).appliedCoupon);
        }
    }, [route.params]);

    const removeCoupon = () => {
        setAppliedCoupon(null);
    };
    const totalSellingPrice = items.reduce(
        (sum: number, item: any) => sum + Number(item.price) * (item.quantity || 1),
        0
    );

    const totalMRP = items.reduce(
        (sum: number, item: any) => {
            const price = Number(item.price || 0);
            const discount = Number(item.discount || 0);
            const mrp = Number(calculateMRP(price, discount));
            return sum + mrp * (item.quantity || 1);
        },
        0
    );
    const totalMRPValue = Number.isNaN(totalMRP) ? 0 : totalMRP;
    const productSavings = totalMRP - totalSellingPrice;
    const productSavingValue = Number.isNaN(productSavings) ? 0 : productSavings;

    const getDiscountAmount = () => {
        if (!appliedCoupon) return 0;
        const discountVal = parseInt(appliedCoupon.coupon_title) || parseInt(appliedCoupon.coupon_code.match(/\d+/)?.[0]) || 0;
        const isPercentage = appliedCoupon.coupon_title?.includes('%') || appliedCoupon.coupon_code?.includes('%');

        if (isPercentage) {
            return (totalSellingPrice * discountVal) / 100;
        }
        return discountVal;
    };

    const couponDiscount = getDiscountAmount();
    const finalAmount = totalSellingPrice - couponDiscount;

    // Fetch Payment Images
    useEffect(() => {
        const fetchPaymentImages = async () => {
            try {
                const res = await paymentGatewayImage();
                if (res.Result === "true") {
                    setPaymentImg(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchPaymentImages();
        getPrescription()
    }, []);
    const getPrescription = async () => {
        try {
            if (!user) return;
            const res = await fetchPresHistory(user.id);
            setOrderData(res?.PrescriptionHistory || []);
        } catch (error) {
            console.log("Order history error", error);
        }
    };

    const displayPayments = paymentImg?.length > 0 ? paymentImg : [
        {
            title: "Cash on Delivery",
            subtitle: "Pay when you receive your order",
            img: "ic_cash.png"
        },
        {
            title: "Online Payment",
            subtitle: "Pay via UPI, Cards or Netbanking",
            img: "ic_online_payment.png"
        }
    ];

    const orderPrescription = async (stat: any, pay_method: any) => {

        const payment_method = pay_method ?? "0"
        await prescriptionPayment(user?.id, presId, stat, "0", "0", "0", finalAmount, "0", "0", ",", payment_method)
    }

    const handleReject = (status: any, p_method: any) => {
        orderPrescription(status, p_method)
        // navigation.goBack();
    };

    const handleProceed = () => {
        if (!selectedAddress) {
            Alert.alert("Please select an address to proceed.");
            return;
        }
        setShowPaymentModal(true);
    };

    const onSelectPaymentMethod = (item: any) => {
        setSelectedPayment(item);
        setShowPaymentModal(false);
        orderPrescription("accept", item?.id)
        setTimeout(() => {
            setShowOrderConfirm(true);
        }, 300);
    };
    const orderConfirm = orderData.find(
        (o: any) =>
            String(o?.id) === String(presId) &&
            o?.status === "Pending" &&
            String(o?.setcart) === "1" &&
            String(o?.cus_status) === "1"
    );


    return (
        <ScreenWrapper style={styles.screen} scroll={false}>
            <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Image
                        source={require("../assets/images/back.png")}
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cart</Text>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {items.length > 0 ? (
                    items.map((item: any) => (
                        <View key={item.id || Math.random()} style={styles.itemCard}>
                            <View style={styles.row}>

                                <Image
                                    source={item.image === 'default_medicine.png'
                                        ? require('../assets/images/ic_medicine.png')
                                        : { uri: `${API_CONFIG.IMG_URL}/${item.image}` }}
                                    style={styles.productImage}
                                    resizeMode="contain"
                                />

                                <View style={styles.productInfo}>
                                    <Text style={styles.productName}>{item.product_name}</Text>
                                    <Text style={styles.unitText}>Unit:{item.quantity || 1}</Text>

                                    <View style={styles.priceRow}>
                                        <Text style={styles.currentPrice}>₹{Number(item.price).toFixed(2)}</Text>
                                        {Number(item.price) < Number(calculateMRP(item.price, item.discount || 0)) && (
                                            <>
                                                <Text style={styles.oldPrice}>₹{Number(calculateMRP(item.price, item.discount || 0)).toFixed(2)}</Text>
                                                <Text style={styles.perQtyText}>Per Qty</Text>
                                            </>
                                        )}
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No items in prescription cart</Text>
                    </View>
                )}

                {/* Coupon Section */}
                {appliedCoupon ? (
                    <View style={styles.appliedCouponSection}>
                        <View style={styles.couponInfo}>
                            <Image
                                source={require('../assets/images/ic_coupon.png')}
                                style={styles.couponIconSmall}
                            />
                            <View style={styles.appliedTextContainer}>
                                <Text style={styles.appliedCode}>{appliedCoupon.coupon_code}</Text>
                                <Text style={styles.appliedText}>Coupon Applied</Text>
                            </View>
                            <TouchableOpacity onPress={removeCoupon}>
                                <Text style={styles.removeCouponText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.couponSection}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('CouponScreen', { lang: lang })}
                    >
                        <Image
                            source={require('../assets/images/ic_coupon.png')}
                        />
                        <Text style={styles.couponLabel}>Apply Coupon</Text>
                        <Text style={styles.couponArrow}>➤</Text>
                    </TouchableOpacity>
                )}

                {/* Price Details */}
                <View style={styles.priceDetails}>
                    <View style={styles.priceItem}>
                        <Text style={styles.priceLabel}>Cart Value (Total MRP)</Text>
                        <Text style={styles.priceValue}>₹{totalMRPValue.toFixed(2)}</Text>
                    </View>

                    <View style={styles.priceItem}>
                        <Text style={styles.priceLabel}>Product Discount</Text>
                        <Text style={[styles.priceValue, { color: Colors.confirm_button }]}>- ₹{productSavingValue.toFixed(2)}</Text>
                    </View>

                    {couponDiscount > 0 && (
                        <View style={styles.priceItem}>
                            <Text style={styles.priceLabel}>Coupon Discount</Text>
                            <Text style={[styles.priceValue, { color: Colors.confirm_button }]}>- ₹{couponDiscount.toFixed(2)}</Text>
                        </View>
                    )}

                    <View style={styles.priceItem}>
                        <Text style={styles.priceLabel}>Delivery Charges</Text>
                        <Text style={styles.priceValue}>₹0.00</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.priceItem}>
                        <Text style={styles.totalLabel}>Total Amount to Pay</Text>
                        <Text style={styles.totalText}>₹{finalAmount.toFixed(2)}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Footer Buttons */}
            <View style={styles.footerContainer}>
                <View style={styles.addressSection}>
                    <Image
                        source={require('../assets/images/ic_location.png')}
                        style={styles.addressIcon}
                    />

                    <View style={styles.addressCenter}>
                        <Text style={styles.addressTitle}>{selectedAddress?.type || "Select Address"}</Text>
                        <Text style={styles.addressText} numberOfLines={2}>
                            {selectedAddress
                                ? `${selectedAddress.hno || ''} ${selectedAddress.address}, ${selectedAddress.landmark || ''}`
                                : "No address selected. Please select an address."}
                        </Text>
                    </View>

                    <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('MyAddressData', { lang: lang })}>
                        <Text style={styles.changeText}>Change</Text>
                    </TouchableOpacity>
                </View>

                {!orderConfirm && <View style={styles.btnRow}>
                    <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject("reject", "")} activeOpacity={0.8}>
                        <Text style={styles.buttonText}>Reject</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.proceedButton} onPress={handleProceed} activeOpacity={0.8}>
                        <Text style={styles.buttonText}>Proceed To Buy</Text>
                    </TouchableOpacity>
                </View>}
            </View>

            {/* Payment Selection Modal */}
            <Modal
                visible={showPaymentModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowPaymentModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowPaymentModal(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Payment Method</Text>
                        <Text style={styles.modalSubtitle}>item total ₹{finalAmount.toFixed(2)}</Text>

                        {displayPayments.map((item: any, index: number) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.paymentOption}
                                onPress={() => onSelectPaymentMethod(item)}
                            >
                                <View style={styles.paymentLeft}>
                                    <Image
                                        source={item?.img?.startsWith('ic_')
                                            ? (item.img === 'ic_cash.png' ? require('../assets/images/delivery_img.png') : require('../assets/images/ic_wallet.png'))
                                            : { uri: `${API_CONFIG?.IMG_URL}/${item?.img}` }
                                        }
                                        style={styles.paymentIcon}
                                        resizeMode="contain"
                                    />
                                    <View>
                                        <Text style={styles.paymentTitle}>{item.title}</Text>
                                        <Text style={styles.paymentSubtitle}>{item.subtitle}</Text>
                                    </View>
                                </View>
                                <Image
                                    source={require('../assets/images/back.png')}
                                    style={[styles.arrowIcon, { transform: [{ rotate: '180deg' }] }]}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Order Confirm Modal */}
            <OrderConfirm
                visible={showOrderConfirm}
                onClose={() => setShowOrderConfirm(false)}
                selectedPayment={selectedPayment}
                navigation={navigation}
                totalAmount={finalAmount}
                customItems={items}
                customOrderId={presId}
                presType={presType}
            />

        </ScreenWrapper>
    );
};

export default PrescriptionCart;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.white,
    },

    header: {
        height: HWSize.H_Height40,
        backgroundColor: Colors.purpleBtn,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: MarginHW.PaddingW14,

    },

    backBtn: {
        padding: MarginHW.PaddingW5,
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
    scrollContent: {
        paddingBottom: HWSize.H_Height100,
    },
    itemCard: {
        backgroundColor: Colors.white,
        paddingVertical: MarginHW.PaddingH10,
        paddingHorizontal: MarginHW.PaddingH14,
        borderBottomWidth: 0.2,
        borderBottomColor: Colors.borderColor,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productImage: {
        width: HWSize.W_Width60,
        height: HWSize.H_Height60,
        resizeMode: 'contain',
        marginRight: MarginHW.MarginW10,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: FontsSize.size16,
        color: Colors.black,
        fontFamily: fonts.Lexend_SemiBold,
    },
    unitText: {
        fontSize: FontsSize.size10,
        color: Colors.greyText,
        fontFamily: fonts.Lexend_Regular,
        marginTop: 2,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginTop: MarginHW.MarginH4,
    },
    currentPrice: {
        fontSize: FontsSize.size12,
        color: Colors.purpleBtn,
        fontFamily: fonts.Lexend_SemiBold,
        marginRight: 4,
    },
    oldPrice: {
        fontSize: FontsSize.size12,
        color: Colors.greyText,
        textDecorationLine: 'line-through',
        // marginRight: 4,
    },
    perQtyText: {
        fontSize: FontsSize.size10,
        color: Colors.greyText,
        fontFamily: fonts.Lexend_Regular,
    },
    couponSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: MarginHW.MarginH14,
        marginVertical: MarginHW.MarginH10,
        paddingHorizontal: MarginHW.PaddingH16,
        paddingVertical: MarginHW.PaddingH10,
        backgroundColor: Colors.backgroundColor,
        borderRadius: HWSize.H_Height10,
    },
    couponLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    couponIconSm: {
        width: HWSize.W_Width20,
        height: HWSize.H_Height20,
        marginRight: 10,
        resizeMode: 'contain'
    },
    couponLabel: {
        fontSize: FontsSize.size16,
        fontFamily: fonts.Lexend_SemiBold,
        color: Colors.black,
    },
    arrowIcon: {
        width: HWSize.W_Width15,
        height: HWSize.H_Height15,
        resizeMode: 'contain',
        tintColor: Colors.purpleBtn
    },
    priceDetails: {
        paddingHorizontal: MarginHW.PaddingH20,
        marginTop: MarginHW.MarginH10,
    },
    priceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: MarginHW.MarginH8,
    },
    priceLabel: {
        fontSize: FontsSize.size16,
        color: Colors.greyText,
        fontFamily: fonts.Lexend_Regular,
    },
    priceValue: {
        fontSize: FontsSize.size16,
        color: Colors.black,
        fontFamily: fonts.Lexend_SemiBold,
    },
    divider: {
        borderBottomWidth: 1,
        borderColor: Colors.borderColor,
        borderStyle: 'dashed',
        marginVertical: MarginHW.MarginH10,
    },
    totalLabel: {
        fontSize: FontsSize.size18,
        fontFamily: fonts.Lexend_SemiBold,
        color: Colors.black,
    },
    totalText: {
        fontSize: FontsSize.size18,
        fontFamily: fonts.Lexend_SemiBold,
        color: Colors.black,
    },

    footerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.white,
        paddingBottom: MarginHW.PaddingH20,
        borderTopWidth: 0.2,
        borderTopColor: Colors.borderColor,
    },
    btnRow: {
        flexDirection: 'row',
        paddingHorizontal: MarginHW.PaddingH16,
        gap: 15,
        marginTop: 10,
    },
    addressSection: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: MarginHW.PaddingH12,
        backgroundColor: Colors.white,
    },
    addressIcon: {
        width: HWSize.W_Width30,
        height: HWSize.H_Height30,
        resizeMode: 'contain',
        tintColor: Colors.background,
    },
    addressCenter: {
        flex: 1,
        marginLeft: MarginHW.MarginH2,
    },
    addressTitle: {
        fontSize: FontsSize.size16,
        fontFamily: fonts.Lexend_SemiBold,
        color: Colors.black,
    },
    addressText: {
        fontSize: FontsSize.size14,
        fontFamily: fonts.Lexend_SemiBold,
        color: Colors.greyText,
        marginTop: MarginHW.MarginH2,
    },
    changeText: {
        fontSize: FontsSize.size16,
        fontFamily: fonts.Lexend_SemiBold,
        color: Colors.background,
    },
    rejectButton: {
        flex: 1,
        backgroundColor: Colors.red,
        paddingVertical: MarginHW.PaddingH14,
        borderRadius: HWSize.H_Height10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    proceedButton: {
        flex: 1,
        backgroundColor: Colors.purpleBtn,
        paddingVertical: MarginHW.PaddingH14,
        borderRadius: HWSize.H_Height10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: Colors.white,
        fontSize: FontsSize.size16,
        fontFamily: fonts.Lexend_SemiBold,
    },
    appliedCouponSection: {
        marginTop: MarginHW.MarginH20,
        padding: MarginHW.PaddingH16,
        borderRadius: HWSize.H_Height12,
        marginHorizontal: MarginHW.MarginH16,
        backgroundColor: Colors.white,
        borderWidth: 0.2,
        borderColor: Colors.background,
        borderStyle: 'dashed',
    },
    couponInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    appliedTextContainer: {
        marginLeft: 10,
        flex: 1,
        justifyContent: 'center',
    },
    couponIconSmall: {
        width: HWSize.W_Width20,
        height: HWSize.H_Height20,
        resizeMode: 'contain',
    },
    appliedCode: {
        fontSize: FontsSize.size16,
        fontFamily: fonts.Lexend_SemiBold,
        color: Colors.black,
    },
    appliedText: {
        fontSize: FontsSize.size12,
        fontFamily: fonts.Lexend_Regular,
        color: Colors.confirm_button,
    },
    removeCouponText: {
        fontSize: FontsSize.size14,
        fontFamily: fonts.Lexend_SemiBold,
        color: Colors.red,
    },
    couponArrow: {
        fontSize: FontsSize.size18,
        marginLeft: 'auto',
        color: Colors.nearBlack,
    },
    emptyContainer: {
        padding: 50,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: Colors.greyText,
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        minHeight: 300,
    },
    modalTitle: {
        fontSize: FontsSize.size18,
        fontFamily: fonts.Lexend_SemiBold,
        color: Colors.purpleBtn,
        marginBottom: 5,
    },
    modalSubtitle: {
        fontSize: FontsSize.size14,
        fontFamily: fonts.Lexend_Regular,
        color: Colors.black,
        marginBottom: 20,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: Colors.white,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colors.borderColor,
        elevation: 2,
    },
    paymentLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paymentIcon: {
        width: 40,
        height: 40,
        marginRight: 15,
    },
    paymentTitle: {
        fontSize: FontsSize.size16,
        fontFamily: fonts.Lexend_SemiBold,
        color: Colors.black,
    },
    paymentSubtitle: {
        fontSize: FontsSize.size12,
        fontFamily: fonts.Lexend_Regular,
        color: Colors.greyText,
    },

});
