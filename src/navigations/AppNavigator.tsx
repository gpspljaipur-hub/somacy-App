import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import LanguageSelect from "../screens/LanguageSelect";
import SplashScreen from "../screens/SplashScreen";
import Login from "../screens/Login";
import OtpScreen from "../screens/OtpScreen";
import PasswordScreen from "../screens/PasswordScreen";
import SignupDetailsScreen from "../screens/SignupDetailsScreen";
import MainPageDetailsScrren from "../screens/MainPageDetailsScrren";
import BottomTabNavigation from "./BottomTabNavigation";
import ProductInfoScreen from "../screens/ProductInfoScreen";
import SelectAddress from "../screens/SelectAddress";
import MapScreen from "../screens/MapScreen";
import Cart from "../screens/Cart";
import CategoryProductsScreen from "../screens/CategoryProductsScreen";
import MyOrder from "../screens/MyOrder";
import SearchScreen from "../components/SearchScreen";
import OrderDeatails from "../screens/OrderDeatails";
import MyPrescription from "../screens/MyPrescription";
import PrescriptionDetails from "../screens/PrescriptionDetails";
import MyAddressData from "../screens/MyAddressData";
import PaymentConfirmScreen from "../screens/PaymentConfirmScreen";
import CashDeliveryScreen from "../screens/CashDeliveryScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ForgotPassword from "../screens/ForgotPassword";
import About from "../screens/About";
import EditProfile from "../screens/EditProfile";
import CameraPermission from "../screens/CameraPermission";
import { Asset } from "react-native-image-picker";
import PreviewPrescription from "../screens/PreviewPrescription";
import AllProductScreen from "../screens/AllProductScreen";
import CouponScreen from "../screens/CouponScreen";
import ConfirmPasswordScreen from "../screens/ConfirmPasswordScreen";
import PhonePeWebView from "../screens/PhonePeWebView";
import PrescriptionCart from "../screens/PrescriptionCart";
import WebViewScreen from "../screens/WebViewScreen";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../Redux/Slices/loaderSlice";
import GlobalLoader from "../components/GlobalLoader";

type AddressItem = {
  id: string;
  uid?: string;

  hno?: string;
  address: string;
  landmark?: string;

  type?: "Home" | "Office" | "Other" | string;

  lat_map?: string;
  long_map?: string;

  delivery_charge?: string;
  address_image?: string;
};


export type RootStackParamList = {
  Home: { lang?: any };
  About: { lang?: any };
  LanguageSelect: undefined;
  SplashScreen: undefined
  Login: { lang?: any };
  OtpScreen: {
    mobile: string
    confirmation: any
    isForgotPassword?: boolean
    lang?: any
  }
  PasswordScreen: {
    mobile: string
    lang?: any
  }
  SignupDetailsScreen: { mobile: string; lang?: any }
  MainPageDetailsScrren: undefined
  ProductInfo: { product: any; lang?: any }
  SelectAddress: { lang?: any }
  CategoryProducts: { categoryId: any; categoryName: any }
  MapScreen: {
    address?: AddressItem;
    isEdit?: boolean;
    lang?: any;
  };
  Cart: { appliedCoupon?: any; lang: any };
  MyOrder: { lang?: any }
  SearchScreen: { lang?: any }
  OrderDeatails: {
    order: any;
    lang?: any;
  };
  MyPrescription: { lang?: any }
  PrescriptionDetails: {
    order: any;
    lang: any;
  };
  MyAddressData: { lang?: any }
  PaymentConfirmScreen: { totalAmount?: number; coupon?: any; lang?: any } | undefined;
  CashDeliveryScreen: { lang?: any }
  ForgotPassword: { mobile: string; lang?: any }
  EditProfile: { lang?: any }
  CameraPermission: {
    lang: any
  }
  PreviewPrescription: {
    images: Asset[];
    tidNumber: any;
    lang: any
  };
  AllProducts: { categoryId?: any; data?: any; lang?: any };
  CouponScreen: { lang?: any };
  ConfirmPasswordScreen: { mobile: string; lang?: any }
  PhonePeWebView: { paymentUrl: string; transactionId: string };
  PrescriptionCart: { items: any[]; prefillAmount?: number; presId?: string, presType?: string, lang?: any } | undefined;
  WebViewScreen: { url: string; title?: string };
};


const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const dispatch = useDispatch();

  return (
    <>
      <NavigationContainer
        onStateChange={() => {
          dispatch(showLoader());
          setTimeout(() => {
            dispatch(hideLoader());
          }, 300);
        }}
      >
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="LanguageSelect" component={LanguageSelect} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="OtpScreen" component={OtpScreen} />
          <Stack.Screen name="PasswordScreen" component={PasswordScreen} />
          <Stack.Screen name="SignupDetailsScreen" component={SignupDetailsScreen} />
          <Stack.Screen name="MainPageDetailsScrren" component={BottomTabNavigation} />
          <Stack.Screen name="ProductInfo" component={ProductInfoScreen} />
          <Stack.Screen name="CategoryProducts" component={CategoryProductsScreen} />

          <Stack.Screen name="SelectAddress" component={SelectAddress} />
          <Stack.Screen name="MapScreen" component={MapScreen} />
          <Stack.Screen name="Cart" component={Cart} />
          <Stack.Screen name="MyOrder" component={MyOrder} />
          <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OrderDeatails" component={OrderDeatails} />
          <Stack.Screen name="MyPrescription" component={MyPrescription} />
          <Stack.Screen name="PrescriptionDetails" component={PrescriptionDetails} />
          <Stack.Screen name="MyAddressData" component={MyAddressData} />
          <Stack.Screen name="PaymentConfirmScreen" component={PaymentConfirmScreen} />
          <Stack.Screen name="CashDeliveryScreen" component={CashDeliveryScreen} />
          <Stack.Screen name="About" component={About} />

          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="ConfirmPasswordScreen" component={ConfirmPasswordScreen} />

          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="CameraPermission" component={CameraPermission} />
          <Stack.Screen name="PreviewPrescription" component={PreviewPrescription} />
          <Stack.Screen name="AllProducts" component={AllProductScreen} />
          <Stack.Screen name="CouponScreen" component={CouponScreen} />
          <Stack.Screen name="PhonePeWebView" component={PhonePeWebView} />
          <Stack.Screen name="PrescriptionCart" component={PrescriptionCart} />
          <Stack.Screen name="WebViewScreen" component={WebViewScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <GlobalLoader />
    </>
  );
};

export default AppNavigator;
