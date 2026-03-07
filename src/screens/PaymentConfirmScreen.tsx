import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
} from "react-native";
import { useNavigation, NavigationProp, useRoute, RouteProp } from "@react-navigation/native";
import OrderConfirm from "../modal/OrderConfirm";
import { paymentGatewayImage } from "../Service/HomePageService";
import API_CONFIG from "../config/apiConfig";
import ImageSize from "../comman/comman/ImageSize";
import { Colors } from "../comman/comman/Colors";
import FontsSize from "../comman/comman/FontsSize";
import HWSize from "../comman/comman/HWSize";
import MarginHW from "../comman/comman/MarginHW";
import fonts from "../comman/comman/fonts";
import ScreenWrapper from "../comman/comman/ScreenWrapper";
import { RootStackParamList } from '../navigations/AppNavigator';


type Language = "en" | "hi";

const PaymentConfirmScreen: React.FC = () => {
  const [showOrder, setShowOrder] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [paymentImg, setPaymentImg] = useState<any>([]);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'PaymentConfirmScreen'>>();
  const totalAmount = route.params?.totalAmount || 0;
  const customItems = (route.params as any)?.items;
  const lang = route?.params?.lang
  const PaymentDetailsImg = async () => {
    try {
      const res = await paymentGatewayImage();
      if (res.Result === "true") {
        setPaymentImg(res.data);
      } else {
        setPaymentImg([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    PaymentDetailsImg();
  }, []);
  // console.log(paymentImg,"paymentImgpaymentImg");


  const textData: Record<Language, {
    headerTitle: string;
    codTitle: string;
    codSubtitle: string;
    onlineTitle: string;
    onlineSubtitle: string;
  }> = {
    en: {
      headerTitle: "Payment Option",
      codTitle: "Cash on Delivery",
      codSubtitle: "Pay when you receive your order",
      onlineTitle: "Online Payment",
      onlineSubtitle: "Pay via UPI, Cards or Netbanking",
    },
    hi: {
      headerTitle: "भुगतान विकल्प",
      codTitle: "कैश ऑन डिलीवरी",
      codSubtitle: "ऑर्डर प्राप्त होने पर भुगतान करें",
      onlineTitle: "ऑनलाइन भुगतान",
      onlineSubtitle: "UPI, कार्ड या नेटबैंकिंग के माध्यम से भुगतान करें",
    },
  };

  const { headerTitle, codTitle, codSubtitle, onlineTitle, onlineSubtitle } = textData[lang as keyof typeof textData];


  const displayPayments = paymentImg?.length > 0 ? paymentImg : [
    {
      title: codTitle,
      subtitle: codSubtitle,
      img: "ic_cash.png"
    },
    {
      title: onlineTitle,
      subtitle: onlineSubtitle,
      img: "ic_online_payment.png"
    }
  ];

  return (
    <ScreenWrapper style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Image
            source={require("../assets/images/back.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
      </View>


      <View style={styles.photoContainer}>
        <Image
          source={{
            uri: "https://as2.ftcdn.net/jpg/15/73/42/95/1000_F_1573429536_U3VIS8wm4te9IC9UoPXhCBNvhUH0UIU8.jpg",
          }}
          style={styles.heroImage}
        />
      </View>

      {displayPayments.map((item: any, index: number) => (
        <TouchableOpacity
          key={index}
          style={styles.optionBox}
          activeOpacity={0.8}
          onPress={() => {
            setSelectedPayment(item);
            setShowOrder(true);
          }}
        >
          <Image
            source={item?.img?.startsWith('ic_')
              ? require('../assets/images/ic_medicine.png')
              : { uri: `${API_CONFIG?.IMG_URL}/${item?.img}` }
            }
            style={styles.optionIcon}
          />

          <View style={styles.optionInfo}>
            <Text style={styles.optionText}>{item?.title}</Text>
            <Text style={styles.optionSub}>{item?.subtitle}</Text>
          </View>

          <View style={styles.arrowBtn}>
            <Text style={styles.btnText}>›</Text>
          </View>
        </TouchableOpacity>
      ))}


      <OrderConfirm
        visible={showOrder}
        onClose={() => setShowOrder(false)}
        selectedPayment={selectedPayment}
        navigation={navigation}
        totalAmount={totalAmount}
        customItems={customItems}
        lange={lang}
      />
    </ScreenWrapper>
  );
};

export default PaymentConfirmScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundLight,
    flex: 1,
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

  backArrow: {
    fontSize: FontsSize.size30,
    color: Colors.white,
  },
  title: {
    fontSize: FontsSize.size20,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.white,
    textAlign: 'center',
  },

  photoContainer: {
    alignItems: "center",


  },
  heroImage: {
    width: "80%",
    height: HWSize.H_Height220,
    resizeMode: "contain",
  },

  optionBox: {
    backgroundColor: Colors.white,
    marginHorizontal: MarginHW.MarginH16,
    marginBottom: MarginHW.MarginH14,
    borderRadius: HWSize.H_Height10,
    paddingHorizontal: MarginHW.PaddingH16,
    paddingVertical: MarginHW.PaddingH5,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  optionIcon: {
    width: HWSize.W_Width45,
    height: HWSize.H_Height45,
    resizeMode: "contain",
  },
  optionInfo: {
    flex: 1,
    marginLeft: MarginHW.MarginH16,
    justifyContent: 'center',
  },
  optionText: {
    fontSize: FontsSize.size16,
    color: Colors.nearBlack,
    fontFamily: fonts.Lexend_SemiBold,
  },
  optionSub: {
    fontSize: FontsSize.size13,
    color: Colors.greyText,
    fontFamily: fonts.Lexend_SemiBold,
    marginTop: MarginHW.MarginH4,
  },

  arrowBtn: {
    width: HWSize.W_Width20,
    height: HWSize.W_Width20,
    borderRadius: HWSize.H_Height20,
    borderWidth: HWSize.H_Height2,
    borderColor: Colors.background,

    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: FontsSize.size20,
    color: Colors.background,
    fontFamily: fonts.Lexend_SemiBold,
    lineHeight: FontsSize.size24,
    textAlign: 'center',
    marginTop: -2,
  },
});
