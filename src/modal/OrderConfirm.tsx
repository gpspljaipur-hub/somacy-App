import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Image,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootStackParamList } from "../navigations/AppNavigator";
import { clearCart } from "../Redux/Slices/cartSlice";

import { Colors } from '../../src/comman/comman/Colors';
import FontsSize from '../comman/comman/FontsSize';
import HWSize from '../comman/comman/HWSize';
import MarginHW from '../comman/comman/MarginHW';
import fonts from '../comman/comman/fonts';
import PhonePePaymentSDK from "react-native-phonepe-pg";
import CryptoJS from 'crypto-js';
import { RootState } from "../Redux/store/store";
import { Buffer } from "buffer";
import axios from "axios";
import { OrderDetailsConfirm } from "../Service/HomePageService";
import AsyncStorage from '@react-native-async-storage/async-storage';

const PHONEPE_ENV = "PRODUCTION"; // "SANDBOX" or "PRODUCTION"

type Language = "en" | "hi";


const PHONEPE_CONFIG = {
  SANDBOX: {
    environment: "SANDBOX",
    merchantId: "PGTESTPAYUAT86",
  },
  PRODUCTION: {
    environment: "PRODUCTION",
    merchantId: "M22T3LSJZZPHD",
  },
};
const PHONEPE_SALT_KEY = {
  SANDBOX: '96434309-7796-489d-8924-ab56988a6076',
  PRODUCTION: 'bd66a1c4-734d-49d7-8133-0d76d19462ac',
};
const PHONEPE_SALT_INDEX = '1';
const PHONEPE_API_PATH = '/pg/v1/pay';


interface OrderProps {
  visible: boolean;
  onClose: () => void;
  selectedPayment: any;
  navigation: any;
  totalAmount: number;
  customItems?: any[];
  customOrderId?: string;
  presType?: any
  lange?: Language
}

export interface ProductItem {
  title: string;
  image: string;
  type: string;
  cost: string;
  qty: string;
  discount: string;
  attribute_id: string;
}

export interface OrderNowPayload {
  uid: string;
  p_method_id: string;
  full_address: string;
  d_charge: number;
  cou_id: number;
  cou_amt: number;
  transaction_id: string;
  product_total: string;
  product_subtotal: string;
  wall_amt: number;
  a_note: string;
  fb_token: any;
  ProductData: ProductItem[];
  pres_id?: string;
  presType?: any
  lange?: any

}
const OrderConfirm: React.FC<OrderProps> = ({ visible, onClose, selectedPayment, presType, totalAmount, customItems, customOrderId, lange }) => {

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const reduxCartItems = useSelector((state: RootState) => Object.values(state.cart.items));
  const selectedAddress = useSelector((state: RootState) => state.address.selectedAddress);

  // Use customItems if provided, otherwise fallback to Redux items
  const itemsToProcess = customItems || reduxCartItems;

  const verificationId = useSelector((state: RootState) => state.auth.verificationId);
  const [transactionIdData, setTransactionIdData] = useState("")
  const safeLang: Language = lange ?? "en";

  useEffect(() => {
    initPhonePe();
  }, [])

  /* Localization Data */
  const textData: Record<Language, {
    title: string;
    subtitle: string;
    point1: string;
    point2: string;
    question: string;
    cancel: string;
    confirm: string;
  }> = {
    en: {
      title: "Order Confirmation",
      subtitle: "Please review your order carefully before proceeding.",
      point1: "Verify the medicine name, dosage, and quantity.",
      point2: "Delivery address and Contact details.",
      question: "Would you like to proceed with the order?",
      cancel: "Cancel",
      confirm: "Confirm",
    },
    hi: {
      title: "ऑर्डर कन्फर्मेशन",
      subtitle: "कृपया आगे बढ़ने से पहले अपने ऑर्डर की सावधानीपूर्वक समीक्षा करें।",
      point1: "दवा का नाम, खुराक और मात्रा की पुष्टि",
      point2: "डिलीवरी का पता और संपर्क विवरण।",
      question: "क्या आप ऑर्डर के साथ आगे बढ़ना चाहेंगे?",
      cancel: "रहने दें",
      confirm: "कन्फर्म करें",
    },
  };

  const { title, subtitle, point1, point2, question, cancel, confirm } = textData[safeLang];



  const initPhonePe = async () => {
    try {
      const config = PHONEPE_CONFIG[PHONEPE_ENV as keyof typeof PHONEPE_CONFIG];

      const result = await PhonePePaymentSDK.init(
        config.environment, // environment: "SANDBOX" or "PRODUCTION"
        config.merchantId, // merchantId
        "online.medicine.pharmacy.healthcare.meds.mg.labtest.plus.somacy", // flowId
        true // enableLogging
      );
    } catch (err: any) {
      console.error("PhonePe SDK Init Error:", err.message);
      Alert.alert('SDK Init Error', err.message || 'Failed to initialize PhonePe SDK');
    }
  };

  const startPhonePePayment = async () => {
    // Declare variables outside try block for catch block access
    let payloadBase64: string = '';
    let checksum: string = '';
    let merchantTransactionId: string = '';
    let config: any = null;
    let saltKey: string = '';
    let amount: any = 1;

    try {
      // console.log('Initiating PhonePe payment with SDK...');

      config = PHONEPE_CONFIG[PHONEPE_ENV as keyof typeof PHONEPE_CONFIG];
      saltKey = PHONEPE_SALT_KEY[PHONEPE_ENV as keyof typeof PHONEPE_SALT_KEY];

      // Initialize SDK first
      try {
        const initResult = await PhonePePaymentSDK.init(
          config.environment,
          config.merchantId,
          "", // appId (optional, empty string if not provided)
          true // enableLogging
        );
      } catch (initError: any) {
        console.warn('SDK Init Warning:', initError?.message);
        // Continue even if init fails (might already be initialized)
      }

      // Use user from component level
      const mobile = user?.mobile || '7742817188';
      amount = 1; // Get from cart or props
      merchantTransactionId = `TXN_${Date.now()}`;

      const payload = {
        merchantId: config.merchantId,
        merchantTransactionId: merchantTransactionId,
        merchantUserId: mobile.substring(0, 2) + Date.now(),
        amount: amount * 100,
        redirectUrl: "https://admin.somacy.in/phonepe/redirect",
        redirectMode: "REDIRECT",
        callbackUrl: "https://admin.somacy.in/phonepe/callback",
        mobileNumber: mobile,
        paymentInstrument: {
          type: "PAY_PAGE",
        },
      };

      const payloadString = JSON.stringify(payload);
      payloadBase64 = Buffer.from(payloadString, 'utf8').toString('base64');
      checksum = createPhonePeChecksum(payloadBase64, PHONEPE_API_PATH, saltKey, PHONEPE_SALT_INDEX);
      const appSchema = "online.medicine.pharmacy.healthcare.meds.mg.labtest.plus.somacy";
      const packageName = PHONEPE_ENV === 'PRODUCTION' ? "com.phonepe.app" : "com.phonepe.simulator";


      await PhonePePaymentSDK.startTransaction(
        payloadBase64,
        checksum,
        packageName,
        appSchema
      ).then(async (resp: any) => {
        console.log('PhonePe SDK Transaction Result:', resp);

        if (resp?.status === 'SUCCESS') {
          // Generate status checksum
          const statusChecksum = createStatusChecksum(
            config.merchantId,
            merchantTransactionId,
            saltKey,
            PHONEPE_SALT_INDEX
          );

          // Check payment status
          await paymnetstatus(
            statusChecksum,
            merchantTransactionId,
            config.merchantId,

          );
        } else if (resp?.status === 'FAILURE') {
          Alert.alert('Payment Failed', resp?.error || 'Payment transaction failed');
        } else if (resp?.status === 'INTERRUPTED') {
          Alert.alert('Payment Cancelled', 'Payment was cancelled by user');
        } else {
          Alert.alert('Payment Status', resp?.status || 'Unknown status');
        }
      }).catch((error: any) => {
        throw error; // Re-throw to trigger fallback
      });

    } catch (sdkError: any) {
      // Fallback to direct API call + WebView
      try {
        const phonePeApiUrl = PHONEPE_ENV === 'PRODUCTION'
          ? 'https://api.phonepe.com/apis/hermes/pg/v1/pay'
          : 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay';
        const response = await axios.post(
          phonePeApiUrl,
          { request: payloadBase64 },
          {
            headers: {
              "Content-Type": "application/json",
              "X-VERIFY": checksum,
              "X-MERCHANT-ID": config.merchantId,
            },
            timeout: 30000, // 30 seconds timeout
          }
        );
        const redirectUrl = response?.data?.data?.instrumentResponse?.redirectInfo?.url;
        if (redirectUrl) {
          console.log('Redirecting to PhonePe payment page:', redirectUrl);
          // navigation.navigate('PhonePeWebView', { 
          //   paymentUrl: redirectUrl,
          //   transactionId: merchantTransactionId
          // });
        } else {
          Alert.alert('Payment Error', 'Failed to get payment URL. Please try again.');
        }
      } catch (fallbackError: any) {
        Alert.alert(
          'Payment Error',
          fallbackError?.response?.data?.message || fallbackError?.message || 'Network error. Please check your internet connection and try again.'
        );
      }
    }
  };

  const createPhonePeChecksum = (payloadBase64: string, apiPath: string, saltKey: string, saltIndex: string): string => {
    const stringToSign = payloadBase64 + apiPath + saltKey;
    const hash = CryptoJS.SHA256(stringToSign).toString();
    return `${hash}###${saltIndex}`;
  };

  // Helper function to create status checksum
  const createStatusChecksum = (merchantId: string, merchantTransactionId: string, saltKey: string, saltIndex: string): string => {
    const apiPath = `/pg/v1/status/${merchantId}/${merchantTransactionId}`;
    const stringToSign = apiPath + saltKey;
    const hash = CryptoJS.SHA256(stringToSign).toString();
    return `${hash}###${saltIndex}`;
  };

  // Payment status check function
  const paymnetstatus = async (
    checksum: string,
    merchantTransactionId: string,
    merchantId: string,

  ) => {
    const requestOptions: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': merchantId,
      },
    };

    try {
      const statusUrl = PHONEPE_ENV === 'PRODUCTION'
        ? `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`
        : `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`;

      const response = await fetch(statusUrl, requestOptions);
      const result = await response.json();
      if (result?.code === 'PAYMENT_SUCCESS') {
        // Payment successful - call your APIs
        setTransactionIdData(result?.data?.transactionId);
        PlaceOrder(result?.data?.transactionId)
      } else if (result?.code === 'PAYMENT_ERROR') {
        console.log('Payment Error', result?.message || 'Payment failed');
      } else if (result?.code === 'PAYMENT_PENDING') {
        console.log('Payment Pending', result?.message || 'Payment is pending');
      } else {
        console.log('Payment Status', result?.code || 'Unknown status');
      }
    } catch (error: any) {
      console.error('Payment status check error:', error);
    }
  };
  const mapCartToProductData = (cartItems: any[]) => {

    return cartItems.map(item => ({
      title: item.product_name,
      image: item.image,
      type: item?.type, // or dynamic if you have
      cost: String(item.price),
      qty: String(item.quantity),
      discount: String(item.discount ?? 0),
      attribute_id: String(item.attributeId)
    }));
  };

  const PlaceOrder = async (transId: any) => {
    try {
      if (!user) {
        Alert.alert("Error", "Please login first");
        return;
      }
      if (!selectedAddress?.address) {
        Alert.alert("Error", "Please select delivery address");
        return;
      }
      if (!itemsToProcess || itemsToProcess?.length === 0) {
        Alert.alert("Error", "Cart is empty");
        return;
      }
      if (presType === "presc") {
        if (!customItems) {
          dispatch(clearCart());
        }
        navigation.navigate("CashDeliveryScreen", {
          lang: lange
        });
        return;
      }
      const productData = mapCartToProductData(itemsToProcess);
      const payload: OrderNowPayload = {
        uid: String(user.id),
        p_method_id: selectedPayment?.id ? String(selectedPayment.id) : (transactionIdData ? "4" : "2"),
        full_address: selectedAddress.address,
        d_charge: 0,
        cou_id: 0,
        cou_amt: 0,
        transaction_id: transId ?? "0",
        product_total: String(totalAmount),
        product_subtotal: String(totalAmount),
        wall_amt: 0,
        a_note: "",
        fb_token: verificationId,
        ProductData: productData,
        pres_id: customOrderId
      };


      const response = await OrderDetailsConfirm(payload);
      if (response?.ResponseCode === "200") {
        // Alert.alert("Success", "Order placed successfully");
        if (!customItems) {
          dispatch(clearCart());
        }
        navigation.navigate("CashDeliveryScreen", {
          lang: lange
        })
        // clear cart / navigate
      } else {
        Alert.alert("Error", "Order failed");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  const handlePayment = (title: string) => {
    console.log(title, "title===");
    if (title === "Pay Online") {
      startPhonePePayment()

    } else {
      PlaceOrder("")
      // navigation.navigate("CashDeliveryScreen");  

    }
  }




  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.subtitle}>
            {subtitle}
          </Text>

          {/* Point 1 */}
          <View style={styles.row}>
            <Image
              source={require("../assets/images/thank_you.png")}
              style={styles.tick}
            />
            <Text style={styles.text}>
              {point1}
            </Text>
          </View>

          {/* Point 2 */}
          <View style={styles.row}>
            <Image
              source={require("../assets/images/thank_you.png")}
              style={styles.tick}
            />
            <Text style={styles.text}>
              {point2}
            </Text>
          </View>

          <Text style={styles.question}>
            {question}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>{cancel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => {
                onClose();
                handlePayment(selectedPayment?.title);
              }}
            >
              <Text style={styles.confirmText}>{confirm}</Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OrderConfirm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: Colors.white,
    borderRadius: HWSize.H_Height10,
    padding: MarginHW.PaddingH24,
    width: "85%",
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: MarginHW.MarginH4 },
    shadowOpacity: 0.2,
    shadowRadius: MarginHW.MarginH8,
  },

  title: {
    fontSize: FontsSize.size22,
    fontFamily: fonts.Lexend_SemiBold,
    textAlign: "center",
    color: Colors.background,
    marginBottom: MarginHW.MarginH10,
  },

  subtitle: {
    textAlign: "left",
    color: Colors.greyText,
    fontFamily: fonts.Lexend_SemiBold,
    fontSize: FontsSize.size14,
    marginBottom: MarginHW.MarginH10,
    lineHeight: FontsSize.size20,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: MarginHW.MarginH14,
  },

  tick: {
    width: HWSize.W_Width20,
    height: HWSize.W_Width20,
    marginRight: MarginHW.MarginH12,
    resizeMode: "contain",
  },

  text: {
    flex: 1,
    color: Colors.nearBlack,
    fontFamily: fonts.Lexend_SemiBold,
    fontSize: FontsSize.size14,
  },

  question: {
    marginBottom: MarginHW.MarginH10,
    color: Colors.secondary_button,
    fontFamily: fonts.Lexend_SemiBold,
    fontSize: FontsSize.size14,
    textAlign: "left",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginTop: MarginHW.MarginH10,
  },

  cancelBtn: {
    backgroundColor: Colors.greyText,
    paddingVertical: MarginHW.PaddingH8,
    paddingHorizontal: MarginHW.PaddingH35,
    borderRadius: HWSize.H_Height10,
    flex: 1,
    marginRight: MarginHW.MarginH10,
    alignItems: 'center',
  },

  cancelText: {
    color: Colors.white,
    fontFamily: fonts.Lexend_SemiBold,
    fontSize: FontsSize.size12,
  },

  confirmBtn: {
    backgroundColor: Colors.background,
    paddingVertical: MarginHW.PaddingH8,
    paddingHorizontal: MarginHW.PaddingH35,
    borderRadius: HWSize.H_Height10,
    flex: 1,
    alignItems: 'center',
  },

  confirmText: {
    color: Colors.white,
    fontFamily: fonts.Lexend_SemiBold,
    fontSize: FontsSize.size12,

  },
});
