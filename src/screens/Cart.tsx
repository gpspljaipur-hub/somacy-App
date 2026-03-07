import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  Alert,
  StatusBar,
  Modal,
} from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Redux/store/store';
import { RootStackParamList } from '../navigations/AppNavigator';
import ScreenWrapper from '../comman/comman/ScreenWrapper';
import { Colors } from '../comman/comman/Colors';
import FontsSize from '../comman/comman/FontsSize';
import HWSize from '../comman/comman/HWSize';
import MarginHW from '../comman/comman/MarginHW';
import fonts from '../comman/comman/fonts';
import API_CONFIG from '../config/apiConfig';
import { calculateMRP } from '../utils/PriceUtils';
import { removeFromCart, incrementQty, decrementQty } from '../Redux/Slices/cartSlice';
type Language = "en" | "hi";
const Cart = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Cart'>>();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const selectedAddress = useSelector((state: RootState) => state.address.selectedAddress);
  const items = Object.values(cartItems);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isMinOrderModalVisible, setIsMinOrderModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const { lang } = route.params;
  const textData: Record<Language, {
    cartValue: string,
    productDiscount: string,
    couponDiscount: string,
    deliveryCharges: string,
    totalAmount: string,
    applyCoupon: string,
    couponApplied: string,
    remove: string,
    off: string,
    cartEmpty: string,
    continueShopping: string,
    selectAddressLabel: string,
    change: string,
    noAddress: string,
    proceedToBuy: string,
    deliveryNoteTitle: string,
    minOrderMsg1Pre: string,
    minOrderMsg1Highlight: string,
    minOrderMsg1Post: string,
    minOrderMsg2: string,
    ok: string,
    addressReqTitle: string,
    addressReqDesc: string,
    cancel: string,
    selectAddressBtn: string,
    deliveryAddressLabel: string,

  }> = {
    en: {
      cartValue: "Cart Value",
      productDiscount: "Product Discount",
      couponDiscount: "Coupon Discount",
      deliveryCharges: "Delivery Charges",
      totalAmount: "Amount to be Paid",
      applyCoupon: "Apply Coupon",
      couponApplied: "Coupon Applied",
      remove: "Remove",
      off: "OFF",
      cartEmpty: "Your cart is empty!",
      continueShopping: "Continue Shopping",
      selectAddressLabel: "Select Address",
      change: "Change",
      noAddress: "No address selected. Please select an address.",
      proceedToBuy: "Proceed To Buy",
      deliveryNoteTitle: "Delivery Note",
      minOrderMsg1Pre: "When adding items to your cart, please make sure that the total meets or exceeds the ",
      minOrderMsg1Highlight: "Rs 199 minimum",
      minOrderMsg1Post: ".",
      minOrderMsg2: "This will help you enjoy a seamless checkout process without any disruptions.",
      ok: "OK",
      addressReqTitle: "Address Required",
      addressReqDesc: "Please select a delivery address to proceed.",
      cancel: "Cancel",
      selectAddressBtn: "Select Address",
      deliveryAddressLabel: "Delivery Address",
    },
    hi: {
      cartValue: "कार्ट मूल्य",
      productDiscount: "उत्पाद छूट",
      couponDiscount: "कूपन छूट",
      deliveryCharges: "डिलीवरी शुल्क",
      totalAmount: "भुगतान की जाने वाली राशि",
      applyCoupon: "कूपन लागू करें",
      couponApplied: "कूपन लागू किया गया",
      remove: "हटाएं",
      off: "छूट",
      cartEmpty: "आपकी कार्ट खाली है!",
      continueShopping: "खरीदारी जारी रखें",
      selectAddressLabel: "पता चुनें",
      change: "बदलें",
      noAddress: "कोई पता नहीं चुना गया। कृपया एक पता चुनें।",
      proceedToBuy: "खरीदने के लिए आगे बढ़ें",
      deliveryNoteTitle: "डिलीवरी नोट",
      minOrderMsg1Pre: "आइटम को कार्ट में जोड़ते समय, कृपया सुनिश्चित करें कि कुल राशि ",
      minOrderMsg1Highlight: "199 रुपये न्यूनतम",
      minOrderMsg1Post: " या उससे अधिक हो।",
      minOrderMsg2: "यह आपको बिना किसी बाधा के एक सहज चेकआउट प्रक्रिया का आनंद लेने में मदद करेगा।",
      ok: "ओके",
      addressReqTitle: "पता आवश्यक",
      addressReqDesc: "कृपया आगे बढ़ने के लिए डिलीवरी पता चुनें।",
      cancel: "रद्द करें",
      selectAddressBtn: "पता चुनें",
      deliveryAddressLabel: "डिलीवरी पता",
    },
  };

  const {
    cartValue,
    productDiscount,
    couponDiscount: couponDiscountLabel,
    deliveryCharges,
    totalAmount,
    applyCoupon,
    couponApplied,
    remove,
    off,
    cartEmpty,
    continueShopping,
    selectAddressLabel,
    change,
    noAddress,
    proceedToBuy,
    deliveryNoteTitle,
    minOrderMsg1Pre,
    minOrderMsg1Highlight,
    minOrderMsg1Post,
    minOrderMsg2,
    ok,
    addressReqTitle,
    addressReqDesc,
    cancel,
    selectAddressBtn,
  } = textData[lang as keyof typeof textData];


  useEffect(() => {
    if (route.params && (route.params as any).appliedCoupon) {
      setAppliedCoupon((route.params as any).appliedCoupon);
    }
  }, [route.params]);

  const totalSellingPrice = items.reduce(
    (sum: number, item: any) => sum + Number(item.price) * item.quantity,
    0
  );

  const totalMRP = items.reduce(
    (sum: number, item: any) => {
      const mrp = Number(calculateMRP(item.price, item.discount || 0));
      return sum + mrp * item.quantity;
    },
    0
  );

  const productSavings = totalMRP - totalSellingPrice;
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

  const handleNavigate = () => {
    if (finalAmount < 199) {
      setIsMinOrderModalVisible(true);
      return;
    }

    if (!selectedAddress) {
      setAddressModalVisible(true);
      return;
    }

    navigation.navigate('PaymentConfirmScreen', {
      totalAmount: finalAmount,
      coupon: appliedCoupon,
      lang: lang
    } as any);
  };

  const handleAddressChange = () => {
    navigation.navigate('MyAddressData', { lang: lang });
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  if (items.length === 0) {
    return (
      <ScreenWrapper style={styles.screen}>
        <View style={styles.emptyContainer}>
          <Image
            source={require("../assets/images/ic_empty_cart.png")}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}>{cartEmpty}</Text>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => navigation.navigate("MainPageDetailsScrren")}
          >
            <Text style={styles.continueText}>{continueShopping}</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper style={styles.screen} scroll={false}>
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item: any) => (
          <View key={item.id} style={styles.itemCard}>
            {item.discount > 0 && (
              <View style={styles.discountCoupon}>
                <ImageBackground
                  source={require('../assets/images/ic_discount_shape.png')}
                  style={styles.discountIcon}
                  resizeMode="contain"
                >
                  <Text style={styles.discountText}>{item.discount}% {off}</Text>
                </ImageBackground>
              </View>
            )}

            <View style={styles.row}>
              <Image
                source={{ uri: `${API_CONFIG.IMG_URL}/${item.image}` }}
                style={styles.productImage}
              />

              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.product_name}</Text>

                <View style={styles.priceRow}>
                  {item.discount > 0 && (
                    <Text style={[styles.oldPrice, { marginRight: 5, marginLeft: 0 }]}>₹{Number(calculateMRP(item.price, item.discount)).toFixed(2)}</Text>
                  )}
                  <Text style={styles.currentPrice}>₹{Number(item.price).toFixed(2)}</Text>
                </View>

                {/* <Text style={styles.productCategory}>MEDICINE</Text> */}
              </View>

              <View style={styles.rightSection}>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => dispatch(removeFromCart(item.id))}
                >
                  <Image
                    source={require('../assets/images/ic_delete.png')}
                    style={styles.deleteIcon}
                  />
                </TouchableOpacity>

                <View style={styles.quantityBox}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => dispatch(decrementQty(item.id))}
                    style={styles.qtyBtn}
                  >
                    <Text style={styles.qtyBtnText}>-</Text>
                  </TouchableOpacity>

                  <Text style={styles.qtyText}>{item.quantity}</Text>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => dispatch(incrementQty(item.id))}
                    style={styles.qtyBtn}
                  >
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}

        {appliedCoupon ? (
          <View style={styles.appliedCouponSection}>
            <View style={styles.couponInfo}>
              <Image
                source={require('../assets/images/ic_coupon.png')}
                style={styles.couponIconSmall}
              />
              <View style={styles.appliedTextContainer}>
                <Text style={styles.appliedCode}>{appliedCoupon.coupon_code}</Text>
                <Text style={styles.appliedText}>{couponApplied}</Text>
              </View>
              <TouchableOpacity onPress={removeCoupon}>
                <Text style={styles.removeCouponText}>{remove}</Text>
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
            <Text style={styles.couponLabel}>{applyCoupon}</Text>
            <Text style={styles.couponArrow}>➤</Text>
          </TouchableOpacity>
        )}

        <View style={styles.priceDetails}>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>{cartValue}</Text>
            <Text style={styles.priceValue}>₹{totalMRP.toFixed(2)}</Text>
          </View>

          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>{productDiscount}</Text>
            <Text style={[styles.priceValue, { color: Colors.confirm_button }]}>- ₹{productSavings.toFixed(2)}</Text>
          </View>

          {couponDiscount > 0 && (
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>{couponDiscountLabel}</Text>
              <Text style={[styles.priceValue, { color: Colors.confirm_button }]}>- ₹{couponDiscount.toFixed(2)}</Text>
            </View>
          )}

          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>{deliveryCharges}</Text>
            <Text style={[styles.delvPrice, { marginRight: 8, marginLeft: 0, marginTop: 2 }]}>₹ 50</Text>
            <Text style={styles.priceValue}>₹0.00</Text>

          </View>

          <View style={styles.divider} />
          <View style={styles.priceItem}>
            <Text style={styles.totalLabel}>{totalAmount}</Text>
            <Text style={styles.totalText}>₹{finalAmount.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footerContainer}>
        <View style={styles.addressSection}>
          <Image
            source={require('../assets/images/ic_location.png')}
            style={styles.addressIcon}
          />

          <View style={styles.addressCenter}>
            <Text style={styles.addressTitle}>{selectedAddress?.type || selectAddressLabel}</Text>
            <Text style={styles.addressText} numberOfLines={2}>
              {selectedAddress
                ? `${selectedAddress.hno || ''} ${selectedAddress.address}, ${selectedAddress.landmark || ''}`
                : noAddress}
            </Text>
          </View>

          <TouchableOpacity activeOpacity={0.7} onPress={handleAddressChange}>
            <Text style={styles.changeText}>{change}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.checkoutButton} onPress={handleNavigate} activeOpacity={0.9}>
          <Text style={styles.checkoutText}>{proceedToBuy}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isMinOrderModalVisible}
        onRequestClose={() => setIsMinOrderModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.modalIcon}
            />
            <Text style={styles.modalTitle}>{deliveryNoteTitle}</Text>

            <View style={styles.bulletPoint}>
              <View style={styles.dot} />
              <Text style={styles.bulletText}>
                {minOrderMsg1Pre}<Text style={styles.highlightText}>{minOrderMsg1Highlight}</Text>{minOrderMsg1Post}
              </Text>
            </View>

            <View style={styles.bulletPoint}>
              <View style={styles.dot} />
              <Text style={styles.bulletText}>
                {minOrderMsg2}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setIsMinOrderModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>{ok}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={addressModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setAddressModalVisible(false)}
        >
          <View style={styles.alertBox}>
            <Image
              source={require("../assets/images/ic_location.png")}
              style={styles.alertIcon}
            />
            <Text style={styles.alertTitle}>{addressReqTitle}</Text>
            <Text style={styles.alertDesc}>
              {addressReqDesc}
            </Text>

            <View style={styles.alertBtnRow}>
              <TouchableOpacity
                style={styles.alertCancelBtn}
                onPress={() => setAddressModalVisible(false)}
              >
                <Text style={styles.alertCancelText}>{cancel}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.alertConfirmBtn}
                onPress={() => {
                  setAddressModalVisible(false);
                  navigation.navigate("MyAddressData", { lang: lang });
                }}
              >
                <Text style={styles.alertConfirmText}>{selectAddressBtn}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal >
    </ScreenWrapper >
  );
};

export default Cart;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingBottom: MarginHW.PaddingH100 * 3,
  },
  itemCard: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingVertical: MarginHW.PaddingH16,
    paddingHorizontal: MarginHW.PaddingH14,
    marginHorizontal: MarginHW.MarginH16,
    marginTop: MarginHW.MarginH16,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: MarginHW.MarginH10,
  },

  discountCoupon: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 10,
  },

  discountIcon: {

    width: HWSize.W_Width70,
    height: HWSize.H_Height20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountText: {
    color: Colors.white,
    fontSize: FontsSize.size10,
    fontFamily: fonts.Lexend_SemiBold,
  },

  productImage: {
    width: HWSize.W_Width60,
    height: HWSize.H_Height60,
    resizeMode: 'contain',
  },

  productInfo: {
    flex: 1,
    marginLeft: MarginHW.MarginH14,
  },

  productName: {
    fontSize: FontsSize.size18,
    color: Colors.black,
    fontFamily: fonts.Lexend_SemiBold,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: MarginHW.MarginH4,
    flexWrap: 'wrap',
  },

  currentPrice: {
    fontSize: FontsSize.size16,
    color: Colors.black,
    fontFamily: fonts.Lexend_SemiBold,
  },

  oldPrice: {
    fontSize: FontsSize.size12,
    color: Colors.greyText,
    textDecorationLine: 'line-through',
    marginLeft: MarginHW.MarginH5,
    // includeFontPadding: false, // Removed to prevent clipping
  },
  delvPrice: {
    fontSize: FontsSize.size16,
    color: Colors.greyText,
    textDecorationLine: 'line-through',
    marginLeft: MarginHW.MarginH10,
    fontFamily: fonts.Lexend_SemiBold,

    // includeFontPadding: false, // Removed to prevent clipping
  },

  productCategory: {
    fontSize: FontsSize.size14,
    color: Colors.background,
    marginTop: MarginHW.MarginH4,
    fontFamily: fonts.Lexend_SemiBold,
  },

  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: HWSize.H_Height70,
  },

  deleteBtn: {
    padding: MarginHW.PaddingH3,
  },
  deleteIcon: {
    width: HWSize.W_Width20,
    height: HWSize.H_Height20,
    tintColor: Colors.nearBlack,
  },

  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  qtyBtn: {
    backgroundColor: Colors.background,
    width: HWSize.W_Width30,
    height: HWSize.H_Height30,
    borderRadius: HWSize.H_Height12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    fontSize: FontsSize.size20,
    color: Colors.white,
    fontFamily: fonts.Lexend_SemiBold,
    includeFontPadding: false,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  qtyText: {
    paddingHorizontal: MarginHW.PaddingH12,

    fontSize: FontsSize.size16,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black,
  },

  couponSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: MarginHW.MarginH20,
    padding: MarginHW.PaddingH16,
    borderRadius: HWSize.H_Height12,
    marginHorizontal: MarginHW.MarginH16,
    backgroundColor: Colors.backgroundColor,
  },

  appliedCouponSection: {
    marginTop: MarginHW.MarginH20,
    padding: MarginHW.PaddingH16,
    borderRadius: HWSize.H_Height12,
    marginHorizontal: MarginHW.MarginH16,
    backgroundColor: Colors.white,
    borderWidth: 1,
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
    fontFamily: fonts.LexendBold,
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

  couponLabel: {
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,
    marginLeft: MarginHW.MarginH10,
    color: Colors.nearBlack,
  },

  couponArrow: {
    fontSize: FontsSize.size18,
    marginLeft: 'auto',
    color: Colors.nearBlack,
  },

  priceDetails: {
    paddingHorizontal: MarginHW.PaddingH20,
    marginTop: MarginHW.MarginH30,
  },

  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: MarginHW.MarginH5,
  },

  priceLabel: {
    flex: 1,
    color: Colors.greyText,
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,
  },

  priceValue: {
    color: Colors.black,
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,
  },

  divider: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.borderColor,
    marginVertical: MarginHW.MarginH16,
  },
  totalLabel: {
    flex: 1,
    fontSize: FontsSize.size20,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black,
  },
  totalText: {
    fontSize: FontsSize.size20,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.background,
  },

  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingBottom: MarginHW.PaddingH8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
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

  checkoutButton: {
    marginHorizontal: MarginHW.MarginH10,
    backgroundColor: Colors.background,
    paddingVertical: MarginHW.PaddingH14,
    borderRadius: HWSize.H_Height12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  checkoutText: {
    color: Colors.white,
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: MarginHW.MarginH100,
  },
  emptyImage: {
    width: HWSize.W_Width250,
    height: HWSize.H_Height250,
    resizeMode: "contain",
  },
  emptyText: {
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.greyText,
    marginTop: MarginHW.MarginH20,
  },
  continueBtn: {
    marginTop: MarginHW.MarginH30,
    backgroundColor: Colors.background,
    paddingVertical: MarginHW.PaddingH12,
    paddingHorizontal: MarginHW.PaddingW20,
    borderRadius: HWSize.H_Height10,
  },
  continueText: {
    color: Colors.white,
    fontSize: FontsSize.size16,
    fontFamily: fonts.Lexend_SemiBold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    width: '95%',

    paddingHorizontal: HWSize.W_Width10,
    paddingVertical: HWSize.H_Height10,
    alignItems: 'center',
    elevation: 5,
  },
  modalIcon: {
    width: HWSize.W_Width50,
    height: HWSize.H_Height50,
    resizeMode: 'contain',

  },
  modalTitle: {
    fontSize: FontsSize.size18,
    color: Colors.discountRed,
    fontFamily: fonts.Lexend_SemiBold,
    marginBottom: MarginHW.MarginH5,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: MarginHW.MarginH10,
    alignItems: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accentBlue,
    marginTop: MarginHW.MarginH14,
    marginRight: MarginHW.MarginW10,
  },
  bulletText: {
    flex: 1,
    fontSize: FontsSize.size14,
    color: Colors.black,
    fontFamily: fonts.Lexend_Regular,
    lineHeight: 20,
  },
  highlightText: {
    color: Colors.accentBlue,
    fontFamily: fonts.Lexend_SemiBold,
  },
  modalButton: {
    backgroundColor: Colors.featureCardGreenB,
    paddingVertical: MarginHW.PaddingH10,
    paddingHorizontal: MarginHW.PaddingW20 * 2,
    borderRadius: 10,
    marginTop: MarginHW.MarginH10,
  },
  modalButtonText: {
    color: Colors.white,
    fontSize: FontsSize.size16,
    fontFamily: fonts.Lexend_SemiBold,
  },
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
  },
  alertBox: {
    backgroundColor: Colors.white,
    width: '95%',
    alignSelf: 'center',
    borderRadius: HWSize.H_Height10,
    padding: MarginHW.PaddingH20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  alertIcon: {
    width: HWSize.W_Width50,
    height: HWSize.H_Height50,
    resizeMode: 'contain',
    tintColor: Colors.background,
    marginBottom: MarginHW.MarginH10,
  },
  alertTitle: {
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black,
    marginBottom: MarginHW.MarginH5,
  },
  alertDesc: {
    fontSize: FontsSize.size14,
    fontFamily: fonts.Lexend_Regular,
    color: Colors.greyText,
    textAlign: 'center',
    marginBottom: MarginHW.MarginH20,
  },
  alertBtnRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  alertCancelBtn: {
    flex: 1,
    paddingVertical: MarginHW.PaddingH10,
    borderRadius: HWSize.H_Height10,
    borderWidth: 1,
    borderColor: Colors.greyText,
    alignItems: 'center',
  },
  alertCancelText: {
    color: Colors.greyText,
    fontFamily: fonts.Lexend_SemiBold,
    fontSize: FontsSize.size14,
  },
  alertConfirmBtn: {
    flex: 1,
    paddingVertical: MarginHW.PaddingH10,
    borderRadius: HWSize.H_Height10,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  alertConfirmText: {
    color: Colors.white,
    fontFamily: fonts.Lexend_SemiBold,
    fontSize: FontsSize.size14,
  },
});
