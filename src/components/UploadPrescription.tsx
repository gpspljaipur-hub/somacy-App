import React, { useState, useEffect } from "react";
import {
  View, TextInput, StyleSheet, Text, TouchableOpacity, Image, PermissionsAndroid,
  Platform,
  Alert,
  Modal
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { launchCamera } from "react-native-image-picker";
import { Colors } from '../comman/comman/Colors';
import FontsSize from '../comman/comman/FontsSize';
import HWSize from '../comman/comman/HWSize';
import MarginHW from '../comman/comman/MarginHW';
import fonts from '../comman/comman/fonts';
import { PERMISSIONS, request } from "react-native-permissions";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigations/AppNavigator";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store/store";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type Language = "en" | "hi";

interface UploadPrescriptionProps {
  hideOr?: boolean;
  transparent?: boolean;
  lang?: Language
}


const UploadPrescription = ({ hideOr = false, transparent = false, lang }: UploadPrescriptionProps) => {
  const navigation = useNavigation<NavigationProp>();
  const selectedAddress = useSelector((state: RootState) => state.address.selectedAddress);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [infoType, setInfoType] = useState('how');
  const safeLang: Language = lang ?? "en";

  console.log(lang, "========38");
  const textData: Record<Language, {
    or: any;
    title: string;
    subText: string;
    upload: string;

    howItWorks: string;

    addressReq: string;

    addressDesc: string;
    cancel: string;

    selectAddress: string;
    validGuide: any;
    steps: any

  }> = {
    en: {
      or: "OR",
      title: "Upload Prescription",
      subText: "We do the rest!",
      upload: "Upload",
      howItWorks: "How it works",
      validGuide: "Valid Prescription Guide",
      steps: [
        "1. Click on upload prescription",
        "2. Upload a photo of your prescription",
        "3. Check your prescription or address",
        "4. Place the order (submit)",
        "5. We will call you to confirm the medicines",
      ],
      addressReq: "Address Required",
      addressDesc: "Please select a delivery address to upload your prescription.",
      cancel: "Cancel",
      selectAddress: "Select Address",
    },
    hi: {
      or: "या",
      title: "प्रिस्क्रिप्शन अपलोड करें",
      subText: "और अपनी दवाइयां घर पर प्राप्त करें",
      upload: "अपलोड करें",
      howItWorks: "यह कैसे काम करता है",
      validGuide: "वैध प्रिस्क्रिप्शन गाइड",
      steps: [
        "1. प्रिस्क्रिप्शन अपलोड करें पर क्लिक करें",
        "2. अपने प्रिस्क्रिप्शन की एक फोटो अपलोड करें",
        "3. अपना प्रिस्क्रिप्शन या पता जांचें",
        "4. ऑर्डर दें (सबमिट करें)",
        "5. दवाओं की पुष्टि के लिए हम आपको कॉल करेंगे",
      ],
      addressReq: "पता आवश्यक",
      addressDesc: "अपना प्रिस्क्रिप्शन अपलोड करने के लिए कृपया डिलीवरी पता चुनें।",
      cancel: "रद्द करें",
      selectAddress: "पता चुनें",
    },
  };
  const {
    or,
    title,
    subText,
    upload,
    howItWorks: howLabel,
    validGuide,
    steps,
    addressReq,
    addressDesc,
    cancel,
    selectAddress,
  } = textData[safeLang];


  const HandlePermission = () => {
    if (!selectedAddress) {
      setAddressModalVisible(true);
      return;
    }
    navigation?.navigate("CameraPermission", {
      lang: lang
    })
  }

  return (
    <View style={[styles.container, transparent && { backgroundColor: 'transparent', marginTop: 0, paddingHorizontal: 0 }]}>
      <View style={styles.prescriptionCard}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            {!hideOr && (
              <View style={styles.logoContainer}>
                <Text style={styles.logo}>{or}</Text>
              </View>
            )}
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subText}>{subText}</Text>

            <TouchableOpacity style={styles.uploadButton} onPress={HandlePermission}>
              <Text style={styles.uploadBtnText}>{upload}</Text>
              <View style={styles.circleArrow}>
                <Text style={styles.arrowIcon}>{'>'}</Text>
              </View>
            </TouchableOpacity>

          </View>
          <View style={styles.prescriptionImgContainer}>
            <Image
              source={require("../assets/images/ic_upload_prescription.png")}
              style={styles.prescriptionImg}
            />
          </View>

        </View>

        <TouchableOpacity style={styles.howItWorks} onPress={() => {
          setInfoType("how");
          setInfoModalVisible(true);
        }}>
          <Text style={styles.linkText}>{howLabel}</Text>
          <Text style={styles.linkArrow}>{'>'}</Text>
        </TouchableOpacity>

      </View>

      <Modal
        visible={infoModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setInfoModalVisible(false)}
        />

        <View style={styles.infoSheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>
              {infoType === "valid"
                ? validGuide
                : howLabel}
            </Text>

            <TouchableOpacity onPress={() => setInfoModalVisible(false)}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          {infoType === "valid" ? (
            <>
              {/* Valid Prescription Content (Placeholder if needed, but primarily for 'how') */}
            </>
          ) : (
            <>
              {steps.map((step: any, index: any) => (
                <Text key={index} style={styles.step}>{step}</Text>
              ))}
            </>
          )}
        </View>
      </Modal>

      {/* Address Check Modal */}
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
            <Text style={styles.alertTitle}>{addressReq}</Text>
            <Text style={styles.alertDesc}>
              {addressDesc}
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
                  navigation.navigate("MyAddressData", {
                    lang: lang
                  });
                }}
              >
                <Text style={styles.alertConfirmText}>{selectAddress}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal >
    </View >
  );
};

export default UploadPrescription;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.uploadColor,
    paddingTop: HWSize.H_Height20,
    paddingHorizontal: MarginHW.PaddingH14,
    marginTop: MarginHW.MarginH10,
    borderRadius: HWSize.H_Height12,

  },
  prescriptionCard: {
    backgroundColor: Colors.background,
    borderRadius: HWSize.H_Height12,
    padding: MarginHW.PaddingH14,
    marginBottom: MarginHW.MarginH14
  },
  logoContainer: {
    position: 'absolute',
    top: -HWSize.H_Height50,
    left: HWSize.W_Width120,
    alignSelf: 'center',
    width: HWSize.W_Width33,
    height: HWSize.H_Height33,
    borderRadius: HWSize.H_Height20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,


  },
  logo: {
    color: Colors.background,
    fontSize: FontsSize.size16,
    fontFamily: fonts.Lexend_SemiBold,
    textAlign: 'center',

  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: Colors.white,
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,
    marginBottom: MarginHW.MarginH5
  },
  subText: {
    color: Colors.white,
    fontFamily: fonts.Lexend_SemiBold,
    fontSize: FontsSize.size14,
    marginBottom: MarginHW.MarginH10
  },
  uploadButton: {
    backgroundColor: Colors.white,
    paddingVertical: MarginHW.PaddingH8,
    paddingHorizontal: MarginHW.PaddingH12,
    borderRadius: HWSize.H_Height20,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: MarginHW.MarginW8,
  },
  uploadBtnText: {
    color: Colors.background,
    fontSize: FontsSize.size14,
    fontFamily: fonts.Lexend_SemiBold,
  },
  circleArrow: {
    backgroundColor: Colors.background,
    borderRadius: 100,
    width: HWSize.W_Width15,
    height: HWSize.W_Width15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  arrowIcon: {
    color: Colors.white,
    fontSize: FontsSize.size10,

    fontFamily: fonts.Lexend_SemiBold,
  },
  howItWorks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: MarginHW.MarginH10,
    borderTopWidth: HWSize.H_Height1,
    borderTopColor: Colors.lightBorder,
    paddingTop: MarginHW.PaddingH8,
    width: '100%'
  },
  linkText: {
    color: Colors.white,
    fontFamily: fonts.Lexend_SemiBold,
    fontSize: FontsSize.size14
  },
  linkArrow: {
    color: Colors.white,
    fontSize: FontsSize.size14,
    fontFamily: fonts.Lexend_SemiBold,
  },
  prescriptionImgContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  prescriptionImg: {
    width: HWSize.W_Width80,
    height: HWSize.H_Height80,
    marginRight: MarginHW.MarginH20,
    resizeMode: "contain",

  },
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
  },
  infoSheet: {
    backgroundColor: Colors.white,
    padding: MarginHW.MarginH20,
    borderTopLeftRadius: MarginHW.MarginH20,
    borderTopRightRadius: MarginHW.MarginH20,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: MarginHW.MarginH20,
  },
  sheetTitle: {
    fontSize: FontsSize.size16,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black,
  },
  close: {
    fontSize: FontsSize.size18,
    color: Colors.red,
    fontFamily: fonts.Lexend_SemiBold,
  },
  step: {
    fontSize: FontsSize.size14,
    marginBottom: MarginHW.MarginH10,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black,
  },

  // Alert Modal Styles
  alertBox: {
    backgroundColor: Colors.white,
    width: '80%',
    alignSelf: 'center',
    borderRadius: HWSize.H_Height15,
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
