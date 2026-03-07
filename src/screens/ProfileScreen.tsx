import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,

  Alert,

} from "react-native";
import { deleteAccount } from "../Service/HomePageService";
import { CommonActions, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../comman/comman/Colors";
import FontsSize from "../comman/comman/FontsSize";
import HWSize from "../comman/comman/HWSize";
import ImageSize from "../comman/comman/ImageSize";
import MarginHW from "../comman/comman/MarginHW";
import fonts from "../comman/comman/fonts";
import ScreenWrapper from "../comman/comman/ScreenWrapper";
import LanguageModal from "../modal/LanguageModal";
import { clearCart } from "../Redux/Slices/cartSlice";
import { clearCategory } from "../Redux/Slices/categorySlice";
import { clearHome } from "../Redux/Slices/homePageSlice";
import { clearVerificationId, logout } from "../Redux/Slices/authSlice";
import { clearSelectedAddress } from "../Redux/Slices/addressSlice";
import { useDispatch, useSelector } from "react-redux";
import { persistor, RootState } from "../Redux/store/store";
type Language = "en" | "hi";
const ProfileScreen = ({ lang }: { lang?: Language }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const selectedAddress = useSelector((state: RootState) => state.address.selectedAddress);
  const navigation = useNavigation<any>();
  const [showLangModal, setShowLangModal] = useState(false);

  const textData: Record<Language, {
    MY_ORDERS: string;
    MY_PRESCRIPTIONS: string;
    MY_ADDRESS: string;
    ABOUT: string;
    APP_LANGUAGE: string;
    PRIVACY: string;
    REFUND: string;
    SHIPPING: string;
    TERMS: string;
    LOGOUT: string;
    DELETE: string;
    HEADER_TITLE: string;
    LOGOUT_ALERT_TITLE: string;
    LOGOUT_ALERT_MSG: string;
    DELETE_ALERT_TITLE: string;
    DELETE_ALERT_MSG: string;
    CANCEL: string;
    YES_LOGOUT: string;
    YES_DELETE: string;
  }> = {
    en: {
      MY_ORDERS: "My Orders",
      MY_PRESCRIPTIONS: "My Prescriptions Orders",
      MY_ADDRESS: "My Addresses",
      ABOUT: "About Somacy",
      APP_LANGUAGE: "App Language",
      PRIVACY: "Privacy Policy",
      REFUND: "Return & Refund Policy",
      SHIPPING: "Shipping Policy",
      TERMS: "Terms & Condition",
      LOGOUT: "Logout",
      DELETE: "Delete Account",
      HEADER_TITLE: " Account ",
      LOGOUT_ALERT_TITLE: "Logout",
      LOGOUT_ALERT_MSG: "Are you sure you want to logout?",
      DELETE_ALERT_TITLE: "Delete Account",
      DELETE_ALERT_MSG: "Are you sure you want to delete your account?",
      CANCEL: "Cancel",
      YES_LOGOUT: "Logout",
      YES_DELETE: "Delete",
    },
    hi: {
      MY_ORDERS: "मेरे ऑर्डर",
      MY_PRESCRIPTIONS: "मेरे प्रिस्क्रिप्शन ऑर्डर",
      MY_ADDRESS: "मेरा पता",
      ABOUT: "सोमासी के बारे में",
      APP_LANGUAGE: "ऐप भाषा",
      PRIVACY: "गोपनीयता नीति",
      REFUND: "वापसी और धनवापसी नीति",
      SHIPPING: "शिपिंग नीति",
      TERMS: "नियम और शर्तें",
      LOGOUT: "लॉगआउट",
      DELETE: "खाता हटाएं",
      HEADER_TITLE: " खाता ",
      LOGOUT_ALERT_TITLE: "लॉग आउट",
      LOGOUT_ALERT_MSG: "क्या आप वाकई लॉगआउट करना चाहते हैं?",
      DELETE_ALERT_TITLE: "खाता हटाएं",
      DELETE_ALERT_MSG: "क्या आप वाकई अपना खाता हटाना चाहते हैं?",
      CANCEL: "रद्द करें",
      YES_LOGOUT: "लॉगआउट",
      YES_DELETE: "हटाएं",
    },
  };

  const {
    MY_ORDERS, MY_PRESCRIPTIONS, MY_ADDRESS, ABOUT, APP_LANGUAGE, PRIVACY,
    REFUND, SHIPPING, TERMS, LOGOUT, DELETE, HEADER_TITLE,
    LOGOUT_ALERT_TITLE, LOGOUT_ALERT_MSG, DELETE_ALERT_TITLE, DELETE_ALERT_MSG,
    CANCEL, YES_LOGOUT, YES_DELETE
  } = textData[lang as keyof typeof textData];

  const dispatch = useDispatch();

  const handleLogout = async () => {
    Alert.alert(
      LOGOUT_ALERT_TITLE,
      LOGOUT_ALERT_MSG,
      [
        { text: CANCEL, style: "cancel" },
        {
          text: YES_LOGOUT,
          style: "destructive",
          onPress: async () => {
            try {
              if (user?.id) {
                // Save all user data before clearing
                const userData = {
                  cart: cartItems,
                  address: selectedAddress,
                };
                await AsyncStorage.setItem(
                  `user_profile_data_${user.id}`,
                  JSON.stringify(userData)
                );
              }

              dispatch(logout());
              dispatch(clearCart());
              dispatch(clearHome());
              dispatch(clearCategory());
              dispatch(clearSelectedAddress());
              await AsyncStorage.removeItem("hasSeenWelcome");
              await AsyncStorage.removeItem("CONFIRMED_ORDER_");
              await AsyncStorage.setItem('APP_LAUNCHED', 'true');
              await AsyncStorage.removeItem('APP_CONFIRM_MODAL_SHOWN');
              dispatch(clearVerificationId());

              navigation.dispatch(
                CommonActions?.reset({
                  index: 0,
                  routes: [{ name: "Login" }],
                })
              );
            } catch (e) {
              console.log("Logout error:", e);
              Alert.alert("Error", "Something went wrong");
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      DELETE_ALERT_TITLE,
      DELETE_ALERT_MSG,
      [
        { text: CANCEL, style: "cancel" },
        {
          text: YES_DELETE,
          style: "destructive",
          onPress: async () => {
            try {
              let res;
              try {
                if (!user) {
                  Alert.alert("Error", "User not found. Please log in again.");
                  return;
                }
                console.log("Calling deleteAccount for UID:", user.id);
                res = await deleteAccount(user.id);
                console.log("API Response received:", res);
              } catch (apiError: any) {
                console.log("API Call Error:", apiError);
                Alert.alert("API Error", "Failed to connect to server: " + apiError.message);
                return;
              }

              if (res?.Result === "true") {
                try {
                  console.log("Starting cleanup...");
                  await AsyncStorage.multiRemove([
                    "app_user",
                    "token",
                    "app_lang",
                    "hasSeenWelcome",
                    `user_cart_${user.id}`,
                    `user_profile_data_${user.id}`,
                  ]);

                  dispatch(logout());
                  dispatch(clearHome());
                  dispatch(clearCategory());
                  dispatch(clearVerificationId());

                  if (persistor) {
                    await persistor.purge();
                  }

                  Alert.alert(
                    "Success",
                    "Account deleted successfully",
                    [
                      {
                        text: "OK",
                        onPress: () => {
                          navigation.dispatch(
                            CommonActions?.reset({
                              index: 0,
                              routes: [{ name: "Login" }],
                            })
                          );
                        }
                      }
                    ]
                  );
                } catch (cleanupError: any) {
                  console.log("Cleanup Error:", cleanupError);
                  Alert.alert("Cleanup Error", "Storage cleanup failed: " + cleanupError.message);
                }
              } else {
                console.log("Delete account failed by server:", res);
                Alert.alert(
                  "Error",
                  (res?.ResponseMsg || "Server rejected account deletion") + "\n(ID: " + user.id + ")"
                );
              }
            } catch (generalError: any) {
              console.log("General Delete Error:", generalError);
              Alert.alert(
                "Error",
                "An unexpected error occurred: " + generalError.message + "\n(ID: " + user?.id + ")"
              );
            }
            // Alert.alert("Success", "Account deleted from device (Backend pending)");
          },
        },
      ]
    );
  };


  const options = [
    { key: "MY_ORDERS", icon: require("../assets/images/ic_orders.png") },
    {
      key: "MY_PRESCRIPTIONS",
      icon: require("../assets/images/ic_prescription_orders.png"),
    },
    {
      key: "MY_ADDRESS",
      icon: require("../assets/images/ic_address_list.png"),
    },
    { key: "ABOUT", icon: require("../assets/images/ic_about.png") },
    { key: "APP_LANGUAGE", icon: require("../assets/images/language_img.png") },
    { key: "PRIVACY", icon: require("../assets/images/refund.png") },
    { key: "REFUND", icon: require("../assets/images/refund.png") },
    {
      key: "SHIPPING",
      icon: require("../assets/images/ic_shipping_policy.png"),
    },
    { key: "TERMS", icon: require("../assets/images/ic_terms.png") },
    { key: "LOGOUT", icon: require("../assets/images/ic_logout.png") },
    { key: "DELETE", icon: require("../assets/images/delete_account.png") },
  ];

  const handlePress = (key: string) => {
    switch (key) {
      case "MY_ORDERS":
        navigation.navigate("MyOrder", { lang });
        break;

      case "MY_PRESCRIPTIONS":
        navigation.navigate("MyPrescription", { lang });
        break;

      case "MY_ADDRESS":
        navigation.navigate("MyAddressData", { lang });
        break;

      case "ABOUT":
        navigation.navigate("About", { lang });
        break;

      case "PRIVACY":
        openUrl("https://somacy.in/pp.html", PRIVACY);
        break;

      case "REFUND":
        openUrl("https://somacy.in/refund_policy.html", REFUND);
        break;

      case "SHIPPING":
        openUrl("https://somacy.in/shipping_policy.html", SHIPPING);
        break;

      case "TERMS":
        openUrl("https://somacy.in/term.html", TERMS);
        break;

      case "APP_LANGUAGE":
        setShowLangModal(true);
        break;

      case "LOGOUT":
        handleLogout();
        break;

      case "DELETE":
        handleDeleteAccount();
        break;

      default:
        break;
    }
  };

  const openUrl = (url: string, title: string) => {
    navigation.navigate("WebViewScreen", { url, title });
  };
  const handleEditProfile = () => {
    navigation.navigate("EditProfile", { lang });
  }
  const avatarText = user?.fname ? user?.fname?.trim()?.charAt(0).toUpperCase() : "";

  return (
    <ScreenWrapper style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header
      }>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Image
            source={require("../assets/images/back.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{HEADER_TITLE}</Text>
      </View>
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.profileBox}>
          <View style={styles.leftSection}>
            <View style={styles.pic}>
              <Text style={styles.avatarText}>{avatarText}</Text>
            </View>
            <View>
              <Text style={styles.name}>{user?.fname}</Text>
              <Text style={styles.number}>{user?.mobile}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={handleEditProfile}>
            <Image
              source={require("../assets/images/ic_profile_edit.png")}
              style={styles.Profileedit}
            />
          </TouchableOpacity>
        </View>

        {/* Options */}
        {options.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.row}
            onPress={() => handlePress(item.key)}
          >
            <View style={styles.rowLeft}>
              <Image source={item.icon} style={styles.icon} />
              <Text
                style={[
                  styles.text,
                  item.key === "LOGOUT" && { color: "red" },
                ]}
              >
                {textData[lang as keyof typeof textData][item.key as keyof typeof textData.en]}
              </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Language Modal */}
      <LanguageModal
        visible={showLangModal}
        onClose={() => setShowLangModal(false)}
        navigation={navigation}
      />
    </ScreenWrapper>
  );
};

export default ProfileScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingHorizontal: MarginHW.PaddingH10,
    paddingBottom: MarginHW.PaddingH10,
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
  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pic: {
    width: ImageSize.ImageW40,
    height: ImageSize.ImageH40,
    borderRadius: HWSize.H_Height12,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: MarginHW.MarginH10,
    marginRight: MarginHW.MarginH10,
  },
  avatarText: {
    color: Colors.text,
    fontSize: FontsSize.size20,
    fontFamily: fonts.Lexend_SemiBold,
  },
  name: {
    fontSize: FontsSize.size20,
    fontFamily: fonts.Lexend_SemiBold,
  },
  number: {
    color: Colors.sign,
    marginTop: MarginHW.MarginH2,
  },
  Profileedit: {
    width: ImageSize.ImageH20,
    height: ImageSize.ImageW20,
    resizeMode: 'contain',
    marginRight: MarginHW.MarginH12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: MarginHW.PaddingH14,
    borderBottomWidth: 0.2,
    borderBottomColor: Colors.sign,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: ImageSize.ImageW30,
    height: ImageSize.ImageH30,
    marginRight: MarginHW.MarginH12,
    marginLeft: MarginHW.MarginH12,
  },
  text: {
    fontSize: FontsSize.size16,
    fontFamily: fonts.Lexend_SemiBold,
  },
  arrow: {
    fontSize: FontsSize.size18,
    color: Colors.sign,
    paddingRight: MarginHW.PaddingH12,
  },
});
