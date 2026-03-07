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
import { useSelector } from 'react-redux';

import ScreenWrapper from '../comman/comman/ScreenWrapper';
import { Colors } from '../comman/comman/Colors';
import MarginHW from '../comman/comman/MarginHW';
import fonts from '../comman/comman/fonts';

import { RootStackParamList } from '../navigations/AppNavigator';
import { RootState } from '../Redux/store/store';
import { ProductOrderDetails } from '../Service/HomePageService';
import API_CONFIG from '../config/apiConfig';
import HWSize from '../comman/comman/HWSize';
import FontsSize from '../comman/comman/FontsSize';
import ImageSize from '../comman/comman/ImageSize';

type Language = "en" | "hi";

type Props = NativeStackScreenProps<
  RootStackParamList,
  'OrderDeatails'
>;

const OrderDeatails = ({ route, navigation }: Props) => {
  const { order, lang } = route.params;
  const user = useSelector((state: RootState) => state.auth.user);

  const [activeTab, setActiveTab] =
    useState<'summary' | 'items'>('summary');
  const [loading, setLoading] = useState<any>(true);
  const [orderDetailsData, setOrderDetailsData] =
    useState<any>(null);

  /* Localization Data */
  const textData: Record<Language, {
    headerTitle: string;
    tabSummary: string;
    tabItems: string;
    lblOrderId: string;
    lblStatus: string;
    lblDate: string;
    lblPayment: string;
    lblItemCount: string;
    lblPrice: string;
    lblDelivery: string;
    lblPaid: string;
    lblAddress: string;
    loadingText: string;
    cod: string;
    online: string;
  }> = {
    en: {
      headerTitle: "Order Details",
      tabSummary: "Order Summary",
      tabItems: "Items",
      lblOrderId: "Order ID",
      lblStatus: "Status",
      lblDate: "Order Date",
      lblPayment: "Payment Method",
      lblItemCount: "Item Count",
      lblPrice: "Price",
      lblDelivery: "Delivery Charge",
      lblPaid: "Paid Amount",
      lblAddress: "Delivery Address",
      loadingText: "Loading order details...",
      cod: "Cash on Delivery",
      online: "Online Payment",
    },
    hi: {
      headerTitle: "ऑर्डर विवरण",
      tabSummary: "ऑर्डर सारांश",
      tabItems: "आइटम्स",
      lblOrderId: "आर्डर आईडी",
      lblStatus: "स्थिति",
      lblDate: "आर्डर की तारीख",
      lblPayment: "भुगतान का तरीका",
      lblItemCount: "आइटम की संख्या",
      lblPrice: "कीमत",
      lblDelivery: "डिलीवरी शुल्क",
      lblPaid: "भुगतान की गई राशि",
      lblAddress: "डिलीवरी पता",
      loadingText: "ऑर्डर विवरण लोड हो रहा है...",
      cod: "Cash On Delivery", // Keeping English as per screenshot or matching user preference often
      online: "Online Payment",
    },
  };

  const {
    headerTitle,
    tabSummary,
    tabItems,
    lblOrderId,
    lblStatus,
    lblDate,
    lblPayment,
    lblItemCount,
    lblPrice,
    lblDelivery,
    lblPaid,
    lblAddress,
    loadingText,
    cod,
    online,
  } = textData[lang as keyof typeof textData];

  const OrderDeatilsHistory = async () => {
    try {
      if (!user) return;

      setLoading(true);

      const res = await ProductOrderDetails(user.id, order);
      setOrderDetailsData(res?.OrderProductList?.[0] ?? null);
    } catch (error) {
      console.log('error on getting details', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    OrderDeatilsHistory();
  }, [user]);

  if (loading) {
    return (
      <ScreenWrapper style={styles.screen}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size="large"
            color={Colors.appName}
          />
          <Text style={styles.loaderText}>
            {loadingText}
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
        <Text style={styles.headerTitle}>{headerTitle}</Text>
      </View>
      <FlatList
        data={
          activeTab === 'items'
            ? orderDetailsData?.Order_Product_Data ?? []
            : []
        }
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) =>
          activeTab === 'items' ? (
            <ItemCard item={item} />
          ) : null
        }
        ListHeaderComponent={
          <>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tabBtn,
                  activeTab === 'summary' &&
                  styles.activeTab,
                ]}
                onPress={() =>
                  setActiveTab('summary')
                }
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'summary' &&
                    styles.activeText,
                  ]}
                >
                  {tabSummary}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tabBtn,
                  activeTab === 'items' &&
                  styles.activeTab,
                ]}
                onPress={() =>
                  setActiveTab('items')
                }
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'items' &&
                    styles.activeText,
                  ]}
                >
                  {tabItems}
                </Text>
              </TouchableOpacity>
            </View>

            {activeTab === 'summary' &&
              orderDetailsData && (
                <>
                  <View style={styles.card}>
                    <Row
                      label={lblOrderId}
                      value={order}
                    />
                    <Row
                      label={lblStatus}
                      value={
                        orderDetailsData.Order_Status
                      }
                    />
                    <Row
                      label={lblDate}
                      value={
                        orderDetailsData.order_date
                      }
                    />
                  </View>

                  <View style={styles.card}>
                    <Row
                      label={lblPayment}
                      value={
                        (orderDetailsData?.transaction_id === "0" || !orderDetailsData?.transaction_id)
                          ? cod
                          : online
                      }
                    />
                    <Row
                      label={lblItemCount}
                      value={
                        orderDetailsData
                          .Order_Product_Data
                          ?.length ?? 0
                      }
                    />
                    <Row
                      label={lblPrice}
                      value={`₹${orderDetailsData.Order_SubTotal}`}
                    />
                    <Row
                      label={lblDelivery}
                      value={`₹${orderDetailsData.Delivery_charge}`}
                    />
                    <Row
                      label={lblPaid}
                      value={`₹${orderDetailsData.Order_Total}`}
                    />
                  </View>

                  <View style={styles.card}>
                    <Text
                      style={styles.cardTitle}
                    >
                      {lblAddress}
                    </Text>
                    <Text
                      style={styles.address}
                    >
                      {
                        orderDetailsData.customer_address
                      }
                    </Text>
                  </View>
                </>
              )}
          </>
        }
      />
    </ScreenWrapper>
  );
};

export default OrderDeatails;

const ItemCard = ({ item }: any) => (
  <View style={styles.itemCard}>
    <Image
      source={{
        uri: `${API_CONFIG.IMG_URL}/${item.Product_image}`,
      }}
      style={styles.itemImage}
    />

    <View style={styles.itemInfo}>
      <Text style={styles.itemTitle}>
        {item.Product_name}
      </Text>
      <Text style={styles.itemSub}>
        {item.Product_variation}
      </Text>
      <Text style={styles.qty}>
        Qty {item.Product_quantity}
      </Text>
    </View>

    <View style={styles.priceBox}>
      <Text style={styles.price}>
        ₹{item.Product_price}
      </Text>
      <Text style={styles.perQty}>
        Per Qty
      </Text>
    </View>
  </View>
);

const Row = ({ label, value }: any) => (
  <View style={styles.row}>
    <Text style={styles.label}>
      {label} :
    </Text>
    <Text style={styles.value}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.transparent,
  },

  /* Loader */
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: MarginHW.MarginH10,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.darkText,
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

  /* Tabs */

  tabBtn: {
    flex: 1,
    paddingVertical: MarginHW.PaddingH10,
    borderRadius: HWSize.H_Height15,
    alignItems: "center",

    backgroundColor: Colors.white,
  },
  activeTab: {
    backgroundColor: Colors.purpleBtn,

  },
  tabText: {
    color: Colors.black,
    fontFamily: fonts.Lexend_SemiBold,
    fontSize: FontsSize.normalize14,
  },
  tabContainer: {
    flexDirection: "row",
    borderRadius: HWSize.H_Height15,
    padding: MarginHW.PaddingW5,
    marginBottom: MarginHW.MarginW10,
    gap: MarginHW.MarginW10,
  },

  activeText: {
    color: Colors.white
  },

  card: {
    backgroundColor: Colors.white,
    marginHorizontal: MarginHW.MarginH10,
    marginBottom: MarginHW.MarginH10,
    padding: MarginHW.PaddingH12,
    borderRadius: HWSize.H_Height18,
    borderWidth: HWSize.H_Height1,
    borderColor: Colors.lightBorder,
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
    color: Colors.black,
    fontSize: FontsSize.normalize16,
  },
  address: {
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black,
    lineHeight: HWSize.H_Height20,
    fontSize: FontsSize.normalize16,
  },

  /* Items */
  itemCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    margin: MarginHW.MarginH10,
    padding: MarginHW.PaddingH10,
    borderRadius: HWSize.H_Height12,
    borderWidth: HWSize.H_Height1,
    borderColor: Colors.couponSection,
    alignItems: 'center',
  },
  itemImage: {
    width: ImageSize.ImageW60,
    height: ImageSize.ImageH60,
    borderRadius: HWSize.H_Height10,
  },
  itemInfo: {
    flex: 1,
    marginLeft: MarginHW.MarginW10,
  },
  itemTitle: {
    fontFamily: fonts.Lexend_SemiBold,
  },
  itemSub: {
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.lightGreyText
  },
  qty: {
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.sign,
  },
  priceBox: {
    alignItems: 'flex-end',
  },
  price: {
    fontFamily: fonts.Lexend_SemiBold,
    fontSize: FontsSize.size16,
  },
  perQty: {
    fontFamily: fonts.Lexend_SemiBold,
    fontSize: FontsSize.size16,
    color: Colors.lightGreyText,
  },
});
