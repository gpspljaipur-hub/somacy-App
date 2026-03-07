import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../Redux/Slices/cartSlice';


import ScreenWrapper from '../comman/comman/ScreenWrapper';
import { Colors } from '../comman/comman/Colors';
import MarginHW from '../comman/comman/MarginHW';
import fonts from '../comman/comman/fonts';
import ImageSize from '../comman/comman/ImageSize';

import { RootStackParamList } from '../navigations/AppNavigator';
import { RootState } from '../Redux/store/store';
import { PresOrderDetails } from '../Service/HomePageService';
import API_CONFIG from '../config/apiConfig';
import HWSize from '../comman/comman/HWSize';
import FontsSize from '../comman/comman/FontsSize';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'PrescriptionDetails'
>;

const PrescriptionDetails = ({ route, navigation }: Props) => {
  const { order, lang } = route.params;
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeTab, setActiveTab] = useState<'summary' | 'items'>('summary');
  const [loading, setLoading] = useState(true);
  const [orderDetailsData, setOrderDetailsData] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchDetails = async () => {
    try {
      if (!user) return;
      setLoading(true);
      const res = await PresOrderDetails(user.id, order);
      setOrderDetailsData(
        res?.PrescriptionOrderProductList ?? null
      );
    } catch (e) {
      console.log('API error', e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchDetails();
    }, [user])
  );

  if (loading) {
    return (
      <ScreenWrapper style={styles.screen}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.appName} />
          <Text style={styles.loaderText}>
            {lang === "hi" ? "आर्डर विवरण लोड हो रहा है..." : "Loading order details..."}
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={styles.screen} scroll={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Image
            source={require("../assets/images/back.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{lang === "hi" ? "प्रिस्क्रिप्शन आर्डर विवरण" : "Prescriptions Order Details "}</Text>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'summary' && styles.activeTab]}
          onPress={() => setActiveTab('summary')}
        >
          <Text style={[styles.tabText, activeTab === 'summary' && styles.activeText]}>
            {lang === "hi" ? "आर्डर सारांश" : "Order Summary"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'items' && styles.activeTab]}
          onPress={() => setActiveTab('items')}
        >
          <Text style={[styles.tabText, activeTab === 'items' && styles.activeText]}>
            {lang === "hi" ? "प्रिस्क्रिप्शन" : "Prescription"}
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'summary' && (
        <FlatList
          data={[]}
          keyExtractor={(_, i) => i.toString()}
          renderItem={() => null}
          ListHeaderComponent={
            <>
              <View style={styles.card}>
                <Row label={lang === "hi" ? "आर्डर आईडी" : "Order ID"} value={order} />
                <Row label={lang === "hi" ? "स्थिति" : "Status"} value={orderDetailsData?.Order_Status} />
                <Row label={lang === "hi" ? "आर्डर दिनांक" : "Order Date"} value={orderDetailsData?.order_date} />

              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>
                  {lang === "hi" ? "डिलीवरी पता" : "Delivery Address"}
                </Text>
                <Text style={styles.address}>
                  {orderDetailsData?.customer_address}
                </Text>
              </View>

              {/* View Cart Button - Only for Pending Orders */}
              {orderDetailsData?.Order_Status === 'Pending' && (
                <TouchableOpacity
                  style={styles.viewCartBtn}
                  onPress={() => {
                    const cartItems = orderDetailsData?.Order_Product_Data?.map((item: any) => {
                      const qty = Number(item.Product_quantity) > 0 ? Number(item.Product_quantity) : 1;
                      const mrp = Number(item.Product_price);
                      const total = Number(item.Product_total);
                      const unitPrice = total / qty; // Selling Price per unit

                      let discount = 0;
                      if (mrp > unitPrice) {
                        discount = ((mrp - unitPrice) / mrp) * 100;
                      }

                      return {
                        id: item.Product_id || item.id,
                        product_name: item.Product_name,
                        price: unitPrice.toFixed(2), // Pass Selling Price
                        image: item.Product_image,
                        quantity: qty,
                        discount: discount.toFixed(2),
                        unit: item.unit || "Unit: 1"
                      };
                    }) || [];

                    navigation.navigate('PrescriptionCart', { items: cartItems, presId: order, presType: "presc", lang: lang });
                  }}
                >
                  <Text style={styles.viewCartText}>{lang === "hi" ? "कार्ट देखें" : "View Cart"}</Text>
                </TouchableOpacity>
              )}
            </>
          }
        />
      )}

      {activeTab === 'items' && (
        <FlatList
          data={orderDetailsData?.Prescription_image_list ?? []}
          keyExtractor={(_, i) => i.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.prescriptionImageCard}
              onPress={() =>
                setPreviewImage(`${API_CONFIG.IMG_URL}/${item}`)
              }
            >
              <Image
                source={{ uri: `${API_CONFIG.IMG_URL}/${item}` }}
                style={styles.prescriptionImage}
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.noDataContainer}>
              <Image
                source={require('../assets/images/ic_empty_cart.png')}
                style={styles.noDataImage}
              />
              <Text style={styles.noDataText}>
                {lang === "hi" ? "कोई प्रिस्क्रिप्शन इमेज नहीं" : "No prescription images"}
              </Text>
            </View>
          }
        />
      )}

      {previewImage && (
        <View style={styles.previewOverlay}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setPreviewImage(null)}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <Image
            source={{ uri: previewImage }}
            style={styles.previewImage}
            resizeMode="contain"
          />
        </View>
      )}
    </ScreenWrapper>
  );
};

export default PrescriptionDetails;

const Row = ({ label, value }: any) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label} :</Text>
    <Text style={styles.value}>{value ?? '--'}</Text>
  </View>
);

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.white },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: MarginHW.MarginH10,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.lightGreyText,
    fontSize: FontsSize.normalize16,
  },
  header: {
    height: HWSize.H_Height40,
    backgroundColor: Colors.purpleBtn,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: MarginHW.PaddingW14,
    marginBottom: MarginHW.MarginH12,
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
  tabContainer: {
    flexDirection: 'row',
    borderRadius: HWSize.H_Height15,
    padding: MarginHW.PaddingW5,
    marginBottom: MarginHW.MarginW10,
    gap: MarginHW.MarginW10,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: MarginHW.PaddingH10,
    borderRadius: HWSize.H_Height15,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  activeTab: { backgroundColor: Colors.purpleBtn, },
  tabText: {
    fontFamily: fonts.Lexend_SemiBold,
    fontSize: FontsSize.normalize16,
    color: Colors.black,
  },
  activeText: { color: Colors.white },

  card: {
    backgroundColor: Colors.white,
    marginHorizontal: MarginHW.MarginH10,
    marginBottom: MarginHW.MarginH10,
    padding: MarginHW.PaddingH12,
    borderRadius: HWSize.H_Height15,
    borderWidth: HWSize.H_Height1,
    borderColor: Colors.couponSection,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: MarginHW.MarginH5,
  },
  label: {
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black,
    fontSize: FontsSize.normalize16,
  },
  value: {
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black,
    fontSize: FontsSize.normalize16,
  },

  cardTitle: {
    fontFamily: fonts.Lexend_SemiBold,
    marginBottom: MarginHW.MarginH5,
    fontSize: FontsSize.normalize16,
    color: Colors.black,
  },
  address: {
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black,
    lineHeight: HWSize.H_Height20,
    fontSize: FontsSize.normalize16,
  },

  orderedItemRow: {
    flexDirection: 'row',
    marginVertical: MarginHW.MarginH8,
    marginHorizontal: MarginHW.MarginH10,
    padding: MarginHW.PaddingH10,
    backgroundColor: Colors.white,
    borderRadius: HWSize.H_Height12,
    borderWidth: HWSize.H_Height1,
    borderColor: Colors.couponSection,
    alignItems: 'center',
  },
  orderedItemImage: {
    width: ImageSize.ImageW60,
    height: ImageSize.ImageH60,
    borderRadius: HWSize.H_Height10,
  },
  orderedItemInfo: {
    flex: 1,
    marginLeft: MarginHW.MarginW10,
  },
  orderedItemName: {
    fontFamily: fonts.Lexend_SemiBold,
    fontSize: FontsSize.normalize14,
    color: Colors.black,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: MarginHW.MarginH4,
  },
  finalPrice: {
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.appName,
    marginRight: MarginHW.MarginH5,
    fontSize: FontsSize.normalize16,
  },
  originalPrice: {
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.lightGreyText,
    textDecorationLine: 'line-through',
    marginRight: MarginHW.MarginH5,
    fontSize: FontsSize.normalize14,
  },
  perQtyText: {
    fontFamily: fonts.Lexend_SemiBold,
    fontSize: FontsSize.size12,
    color: Colors.lightGreyText,
  },
  orderedItemQty: {
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.darkText,
    fontSize: FontsSize.normalize14,
    marginTop: MarginHW.MarginH2,
  },

  prescriptionImageCard: {
    width: '46%',
    height: HWSize.H_Height180,
    borderRadius: HWSize.H_Height12,
    overflow: 'hidden',
    borderWidth: HWSize.H_Height1,
    borderColor: Colors.couponSection,
    marginBottom: MarginHW.MarginH16,
    marginHorizontal: '2%',
    backgroundColor: Colors.white,
  },
  prescriptionImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  previewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  previewImage: {
    width: '95%',
    height: '85%',
  },
  closeBtn: {
    position: 'absolute',
    top: HWSize.H_Height40,
    right: HWSize.W_Width20,
    backgroundColor: Colors.tabIconDefault,
    padding: MarginHW.PaddingH10,
    borderRadius: HWSize.H_Height30,
  },
  closeText: {
    color: Colors.white,
    fontSize: FontsSize.size20,
    fontFamily: fonts.Lexend_SemiBold,
  },

  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: MarginHW.MarginH100,
    width: '100%',
  },
  noDataImage: {
    width: HWSize.W_Width180,
    height: HWSize.H_Height180,
    resizeMode: 'contain',
  },
  noDataText: {
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.sign,
    fontSize: FontsSize.normalize16,
    marginTop: MarginHW.MarginH16,
  },
  viewCartBtn: {
    backgroundColor: Colors.purpleBtn,
    marginHorizontal: MarginHW.MarginH10,
    marginTop: MarginHW.MarginH20,
    paddingVertical: MarginHW.PaddingH5,
    width: HWSize.H_Height100,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: HWSize.H_Height10,
  },
  viewCartText: {
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.white,
    fontSize: FontsSize.normalize16,
  },
});
