import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "../navigations/AppNavigator";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store/store";
import { fetchOrderHistory, fetchPresHistory, cancelPrescription } from "../Service/HomePageService";
import HWSize from "../comman/comman/HWSize";
import MarginHW from "../comman/comman/MarginHW";
import FontsSize from "../comman/comman/FontsSize";
import { Colors } from "../comman/comman/Colors";
import fonts from "../comman/comman/fonts";
import ImageSize from "../comman/comman/ImageSize";

type Language = "en" | "hi";
type Props = NativeStackScreenProps<RootStackParamList, "MyPrescription">;

const MyPrescription = ({ navigation, route }: Props) => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [orderData, setOrderData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"ORDER" | "DELIVERED">("ORDER");
  const { lang } = route.params;
  const limit = 8;
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  /* Localization Data */
  const textData: Record<Language, {
    headerTitle: string;
    tabOrder: string;
    tabDelivered: string;
    idLabel: string;
    cancelBtn: string;
    viewBtn: string;
    confirmBtn: string;
    pendingBtn: string;
    processingBtn: string;
    emptyText: string;
    alertTitle: string;
    alertMsg: string;
    yes: string;
    no: string;
    successTitle: string;
    successMsg: string;
    errorTitle: string;
    failedMsg: string;
  }> = {
    en: {
      headerTitle: "My Prescriptions Order",
      tabOrder: "Your Order",
      tabDelivered: "Delivered Orders",
      idLabel: "Order ID: ",
      cancelBtn: "Cancel",
      viewBtn: "View",
      confirmBtn: "Confirm",
      pendingBtn: "View",
      processingBtn: "Processing",
      emptyText: "No orders found",
      alertTitle: "Cancel Order",
      alertMsg: "Are you sure you want to cancel this prescription order?",
      yes: "Yes",
      no: "No",
      successTitle: "Success",
      successMsg: "Order cancelled successfully",
      errorTitle: "Error",
      failedMsg: "Failed",
    },
    hi: {
      headerTitle: "मेरे प्रिस्क्रिप्शन ऑर्डर",
      tabOrder: "आपके ऑर्डर",
      tabDelivered: "डिलीवर किए गए आर्डर",
      idLabel: "आर्डर आईडी : ",
      cancelBtn: "रद्द करें",
      viewBtn: "देखें",
      confirmBtn: "कन्फर्म करें",
      pendingBtn: "देखें",
      processingBtn: "प्रक्रिया में",
      emptyText: "कोई ऑर्डर नहीं मिला",
      alertTitle: "ऑर्डर रद्द करें",
      alertMsg: "क्या आप वाकई यह प्रिस्क्रिप्शन ऑर्डर रद्द करना चाहते हैं?",
      yes: "हाँ",
      no: "नहीं",
      successTitle: "सफलता",
      successMsg: "ऑर्डर सफलतापूर्वक रद्द कर दिया गया",
      errorTitle: "त्रुटि",
      failedMsg: "विफल",
    },
  };

  const {
    headerTitle,
    tabOrder,
    tabDelivered,
    idLabel,
    cancelBtn,
    viewBtn,
    confirmBtn,
    pendingBtn,
    processingBtn,
    emptyText,
    alertTitle,
    alertMsg,
    yes,
    no,
    successTitle,
    successMsg,
    errorTitle,
    failedMsg
  } = textData[lang as keyof typeof textData];

  const getStatusText = (status: string, setcart: any, cusStatus: any) => {
    let finalStatus = status;
    if (status === "Pending" && setcart === "1" && cusStatus === "0") {
      finalStatus = "Confirmed";
    }

    if (status === "Pending" && setcart === "1" && cusStatus === "1") {
      finalStatus = "Processing";
    }
    if (lang === "en") return finalStatus;
    const statusMap: { [key: string]: string } = {
      Pending: "लंबित",
      Processing: "प्रक्रिया में",
      Confirmed: "पुष्टि की गई",
      Delivered: "डिलीवर किया गया",
      Cancelled: "रद्द किया गया",
      "Order Placed": "ऑर्डर दिया गया",
    };

    return statusMap[finalStatus] || finalStatus;
  };

  /*  Fetch orders Details*/
  const getPrescription = async (pageNumber = 1) => {
    try {
      if (!user) return;
      const res = await fetchPresHistory(user.id, pageNumber, limit);
      // setOrderData(res?.PrescriptionHistory || []);
      const newOrders = res?.PrescriptionHistory || [];
      console.log(res, "newOrdersnewOrdersnewOrders");

      if (pageNumber === 1) {
        setOrderData(newOrders);
      } else {
        setOrderData(prev => [...prev, ...newOrders]);
      }
    } catch (error) {
      console.log("Order history error", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setPage(1);
      getPrescription(1);
    }, [user])
  );
  console.log(orderData, "orderdata");
  const loadMoreOrders = () => {
    if (loadingMore) return;

    setLoadingMore(true);

    const nextPage = page + 1;
    setPage(nextPage);

    getPrescription(nextPage);

    setLoadingMore(false);
  };

  // const getOrders = async (pageNumber = 1) => {
  //   try {
  //     if (!user) return;

  //     const res = await fetchOrderHistory(user.id, pageNumber, limit);
  //     console.log(res, "bkdscjzjbb");

  //     const newOrders = res?.OrderHistory || [];
  //     console.log(newOrders, "newOrdersnewOrdersnewOrders");

  //     if (pageNumber === 1) {
  //       setOrderData(newOrders);
  //     } else {
  //       setOrderData(prev => [...prev, ...newOrders]);
  //     }

  //   } catch (error) {
  //     console.log("Order history error", error);
  //   }
  // };

  // useEffect(() => {
  //   setPage(1);
  //   getOrders(1);
  // }, [user]);

  const handleCancelOrder = async (orderId: string) => {
    if (!user) return;
    Alert.alert(
      alertTitle,
      alertMsg,
      [
        {
          text: no,
          style: "cancel",
        },
        {
          text: yes,
          onPress: async () => {
            try {
              const res = await cancelPrescription(user.id, orderId);
              console.log("Cancel Response in UI:", res);
              if (res?.status === true || res?.ResponseCode === "200" || res?.Result === "true") {
                Alert.alert(successTitle, successMsg);
                getPrescription(); // Refresh the list
              } else {
                Alert.alert(errorTitle, res?.message || failedMsg);
              }
            } catch (error) {
              console.log("Cancel order error", error);
              Alert.alert(errorTitle, "Something went wrong. Please try again.");
            }
          },
        },
      ]
    );
  };

  const filteredOrders = orderData.filter((item: any) => {
    if (activeTab === "ORDER") {
      return item.status !== "Delivered";
    }
    if (activeTab === "DELIVERED") {
      return item.status === "Delivered";
    }
    return true;
  });

  /*  order card */
  const renderOrder = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.lefttext}>
          {idLabel}<Text style={styles.id}>{item.id}</Text>
        </Text>
        <Text
          style={[
            styles.status,
            item.status === "Delivered" && { color: Colors.featureCardGreenB },
            item.status === 'Pending' && { color: Colors.noteTitle },
            (item.status === 'Confirmed' || item.status === 'Processing') && { color: Colors.confirm_button },
          ]}
        >
          {getStatusText(item.status, item?.setcart, item?.cus_status)}
        </Text>
        <Text style={styles.date}>{item.order_date}</Text>
      </View>

      <View style={styles.right}>
        {item.status === "Pending" && (
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => handleCancelOrder(item.id)}
          >
            <Text style={styles.btnText}>{cancelBtn}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          //  style={styles.viewBtn} 
          style={[
            styles.viewBtn,
            item?.status === "Pending" && item?.setcart == "1" ? { backgroundColor: Colors.confirm_button } : { backgroundColor: Colors.primaryBlue }
          ]}
          onPress={() =>
            navigation.navigate("PrescriptionDetails", { order: item.id, lang: lang })
          }
        >
          {/* <Text style={styles.btnText}>View</Text> */}
          <Text style={styles.btnText}>
            {
              item?.status === "Pending" && item?.setcart == "1" && item?.cus_status === "0"
                ? confirmBtn
                : item?.status === "Pending" && item?.setcart == "1" && item?.cus_status === "1"
                  ? processingBtn
                  : item?.status === "Pending"
                    ? pendingBtn
                    : item?.status === "Confirmed"
                      ? processingBtn
                      : viewBtn
            }
          </Text>
        </TouchableOpacity>
      </View>
    </View >
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Image
            source={require("../assets/images/back.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{headerTitle} </Text>
      </View>
      {/*  Tabs */}
      <View style={styles.headbtn}>
        <TouchableOpacity
          style={[
            styles.tabBtn,
            activeTab === "ORDER" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("ORDER")}
        >
          <Text style={[styles.tabText, activeTab === "ORDER" && styles.activeText]}>{tabOrder}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabBtn,
            activeTab === "DELIVERED" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("DELIVERED")}
        >
          <Text style={[styles.tabText, activeTab === "DELIVERED" && styles.activeText]}>{tabDelivered}</Text>
        </TouchableOpacity>
      </View>


      {filteredOrders.length > 0 ? (
        // <FlatList
        //   data={filteredOrders}
        //   keyExtractor={(item, index) => index.toString()}
        //   renderItem={renderOrder}
        //   contentContainerStyle={{ paddingBottom: MarginHW.PaddingH20 }}
        // />
        <FlatList
          data={filteredOrders}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderOrder}
          contentContainerStyle={{ paddingBottom: MarginHW.PaddingH20 }}

          onEndReached={loadMoreOrders}
          onEndReachedThreshold={0.5}

          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator size="small" color="gray" style={{ marginVertical: 10 }} />
            ) : null
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Image
            source={require("../assets/images/ic_empty_cart.png")}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}>{emptyText}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default MyPrescription;

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

  /* Tabs */
  headbtn: {
    flexDirection: "row",
    borderRadius: HWSize.H_Height15,
    padding: MarginHW.PaddingW5,
    marginBottom: MarginHW.MarginW10,
    gap: MarginHW.MarginW10,
  },
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
  activeText: {
    color: Colors.white
  },

  /* Card */
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: MarginHW.PaddingW14,
    backgroundColor: Colors.white,
    marginHorizontal: MarginHW.MarginW16,
    borderRadius: HWSize.H_Height10,
    marginBottom: MarginHW.MarginH12,
    borderWidth: HWSize.H_Height1,
    borderColor: Colors.lightBorder,
  },
  left: {
    justifyContent: "center",
  },
  lefttext: {
    fontSize: FontsSize.normalize16,
    color: Colors.black,
    fontFamily: fonts.Lexend_SemiBold,
  },
  id: {
    color: Colors.purpleBtn,
    fontSize: FontsSize.normalize16,
    fontFamily: fonts.Lexend_SemiBold,
  },
  status: {
    marginVertical: MarginHW.MarginH3,
    fontSize: FontsSize.normalize16,
    color: Colors.purpleBtn,
    fontFamily: fonts.Lexend_SemiBold,
  },
  date: {
    color: Colors.black,
    fontSize: FontsSize.normalize14,
    fontFamily: fonts.Lexend_SemiBold,
  },

  right: {
    justifyContent: "center",
    alignItems: "flex-end",
  },

  cancelBtn: {
    backgroundColor: Colors.lightGreyText,
    paddingVertical: MarginHW.PaddingH5,
    width: HWSize.H_Height100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: HWSize.H_Height10,
    marginBottom: MarginHW.MarginH8,
  },
  viewBtn: {
    backgroundColor: Colors.purpleBtn,
    paddingVertical: MarginHW.PaddingH5,
    width: HWSize.H_Height100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: HWSize.H_Height10,
  },
  btnText: {
    color: Colors.white,
    fontSize: FontsSize.normalize14,
    fontFamily: fonts.Lexend_SemiBold,
  },

  /* Empty State */
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: MarginHW.MarginH60,
  },
  emptyImage: {
    width: HWSize.W_Width160,
    height: HWSize.H_Height160,
    resizeMode: "contain",
    marginBottom: MarginHW.MarginH12,
  },
  emptyText: {
    fontSize: FontsSize.normalize16,
    color: Colors.sign,
    fontFamily: fonts.Lexend_SemiBold,
  },
});
