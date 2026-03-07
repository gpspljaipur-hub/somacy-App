import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Keyboard,
} from "react-native";
import ImageSize from "../comman/comman/ImageSize";
import { Asset } from "react-native-image-picker";
import { RootStackParamList } from "../navigations/AppNavigator";
import HWSize from "../comman/comman/HWSize";
import MarginHW from "../comman/comman/MarginHW";
import { Colors } from "../comman/comman/Colors";
import FontsSize from "../comman/comman/FontsSize";
import fonts from "../comman/comman/fonts";
import ScreenWrapper from "../comman/comman/ScreenWrapper";
import UploadModal from "../modal/UploadModal";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const UploadPrescriptionType = () => {
  const [selected, setSelected] = useState<"medicine" | "rghs">("rghs");
  const [tid, setTid] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const navigation = useNavigation<NavigationProp>()
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [infoType, setInfoType] = useState<"valid" | "how" | null>(null);
  const route = useRoute<any>();
  const lange = route?.params?.lang
  const keyboardHeight = new Animated.Value(0);
  const translateY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        Animated.timing(translateY, {
          toValue: -e.endCoordinates.height / 2,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    );

    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleTidChange = (text: string) => {
    const numeric = text.replace(/[^0-9]/g, "");
    if (numeric.length <= 16) {
      setTid(numeric);
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      <Animated.View style={{ flex: 1, transform: [{ translateY }] }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Image
              source={require("../assets/images/back.png")}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{lange === "hi" ? "प्रिस्क्रिप्शन अपलोड करें" : "upload prescription"} </Text>
        </View>
        <View style={styles.contentContainer}>
          <Image
            source={require("../assets/images/ic_upload_prescription_img.png")}
            style={styles.image}
          />

          <Text style={styles.title}>{lange === "hi" ? "प्रिस्क्रिप्शन का प्रकार अपलोड करें" : "Upload Prescription Type"} </Text>
          <TouchableOpacity
            style={[styles.option, selected === "medicine" && styles.active]}
            onPress={() => setSelected("medicine")}
          >
            <View style={styles.radioOuter}>
              {selected === "medicine" && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.optionText}>{lange === "hi" ? "दवाइयां" : "Medicine"} </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, selected === "rghs" && styles.active]}
            onPress={() => setSelected("rghs")}
          >
            <View style={styles.radioOuter}>
              {selected === "rghs" && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.optionText}>{lange === "hi" ? "RGHS दवाइयां" : "RGHS Medicine"} </Text>
          </TouchableOpacity>
          {/* <KeyboardAvoidingView behavior="padding"> */}

          {selected !== "medicine" &&
            <TextInput
              placeholder={lange === "hi" ? "अपना 16 अंकों का TID नंबर दर्ज करें" : "Enter your 16 digit TID number"}
              placeholderTextColor={Colors.lightGreyText}
              keyboardType="number-pad"
              value={tid}
              maxLength={16}
              onChangeText={handleTidChange}
              // editable={selected !== "medicine"}
              style={styles.input}
            />}
          {/* </KeyboardAvoidingView> */}

          <View style={styles.infoRow}>
            <TouchableOpacity
              onPress={() => {
                setInfoType("valid");
                setInfoModalVisible(true);
              }}
            >
              <Text style={styles.link}>{lange === "hi" ? "वैध प्रिस्क्रिप्शन क्या है?" : "What is a valid prescription?"} </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setInfoType("how");
                setInfoModalVisible(true);
              }}
            >
              <Text style={styles.link}>{lange === "hi" ? "यह कैसे काम करता है?" : "How it works?"}</Text>
            </TouchableOpacity>
          </View>


          <TouchableOpacity
            style={[
              styles.uploadBtn,
              selected === "rghs" && tid.length !== 16 && styles.disabledBtn,
            ]}
            disabled={selected === "rghs" && tid.length !== 16}
            onPress={() => setShowPicker(true)}
          >
            <Text style={styles.uploadText}>{lange === "hi" ? "प्रिस्क्रिप्शन अपलोड करें" : "Upload Prescription"}</Text>
          </TouchableOpacity>

          <UploadModal
            visible={showPicker}
            onClose={() => setShowPicker(false)}
            onImageSelected={(assets: Asset[]) => {
              navigation.navigate("PreviewPrescription", {
                images: assets,
                tidNumber: tid,
                lang: lange
              });
            }}
          />
          {/* Modal for valid prescriptiom */}
          {/* ================= INFO MODAL ================= */}
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
                    ? lange === "hi"
                      ? "वैध प्रिस्क्रिप्शन का मार्गदर्शक”"
                      : "Valid Prescription Guide"
                    : lange === "hi"
                      ? "यह कैसे काम करता है"
                      : "How it works"}
                </Text>

                <TouchableOpacity onPress={() => setInfoModalVisible(false)}>
                  <Text style={styles.close}>✕</Text>
                </TouchableOpacity>
              </View>

              {infoType === "valid" ? (
                <>
                  <View style={styles.checkRow}>
                    <Text style={styles.check}>✔</Text>
                    <Text style={styles.checkText}>{lange === "hi" ? "स्पष्ट छवि अपलोड करें" : "Upload Clear Image"}</Text>
                  </View>
                  <View style={styles.checkRow}>
                    <Text style={styles.check}>✔</Text>
                    <Text style={styles.checkText}>{lange === "hi" ? "डॉक्टर की जानकारी आवश्यक है" : "Doctor Details Required"}</Text>
                  </View>
                  <View style={styles.checkRow}>
                    <Text style={styles.check}>✔</Text>
                    <Text style={styles.checkText}>{lange === "hi" ? "प्रिस्क्रिप्शन की तारीख" : "Date of Prescription"}</Text>
                  </View>
                  <View style={styles.checkRow}>
                    <Text style={styles.check}>✔</Text>
                    <Text style={styles.checkText}>{lange === "hi" ? "मरीज की जानकारी" : "Patient Details"}</Text>
                  </View>
                  <View style={styles.checkRow}>
                    <Text style={styles.check}>✔</Text>
                    <Text style={styles.checkText}>{lange === "hi" ? "खुराक की जानकारी" : "Dosage Details"}</Text>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.step}>1. {lange === "hi" ? "प्रिस्क्रिप्शन अपलोड करें पर क्लिक करें" : "Click on upload prescription"}</Text>
                  <Text style={styles.step}>
                    2. {lange === "hi" ? "अपनी प्रिस्क्रिप्शन की फोटो अपलोड करें" : "Upload a photo of your prescription"}
                  </Text>
                  <Text style={styles.step}>
                    3. {lange === "hi" ? "अपनी प्रिस्क्रिप्शन या पता जांचें" : "Check your prescription or address"}
                  </Text>
                  <Text style={styles.step}>4. {lange === "hi" ? "ऑर्डर दें" : "Place the order (submit)"} </Text>
                  <Text style={styles.step}>
                    5.{lange === "hi" ? "हम दवाओं की पुष्टि के लिए आपको कॉल करेंगे।" : "We will call you to confirm the medicines"}
                  </Text>
                </>
              )}
            </View>
          </Modal>


        </View>
      </Animated.View>
    </ScreenWrapper >
  );
};

export default UploadPrescriptionType;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {

    backgroundColor: Colors.white,

  },
  contentContainer: {
    paddingHorizontal: MarginHW.MarginW35,
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
  image: {
    width: "98%",
    height: HWSize.H_Height220,
    resizeMode: "contain",
    marginVertical: MarginHW.MarginH10,
  },
  title: {
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,
    marginBottom: MarginHW.MarginH16,
    color: Colors.black,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: MarginHW.MarginH16,
    borderRadius: MarginHW.MarginH12,
    backgroundColor: Colors.lightBlue,
    marginBottom: MarginHW.MarginH12,
  },
  active: {
    borderWidth: HWSize.H_Height2,
    borderColor: Colors.primaryBlue,
  },
  optionText: {
    marginLeft: MarginHW.MarginW12,
    fontSize: FontsSize.size14,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black,
  },
  radioOuter: {
    width: HWSize.W_Width15,
    height: HWSize.W_Width15,
    borderRadius: HWSize.W_Width10,
    borderWidth: HWSize.H_Height2,
    borderColor: Colors.primaryBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: HWSize.W_Width10,
    height: HWSize.W_Width10,
    borderRadius: HWSize.W_Width10,
    backgroundColor: Colors.primaryBlue,
  },
  input: {
    height: HWSize.H_Height55,
    borderWidth: HWSize.H_Height2,
    borderColor: Colors.primaryBlue,
    borderRadius: MarginHW.MarginH10,
    paddingHorizontal: MarginHW.MarginW16,
    fontSize: FontsSize.size14,
    marginTop: MarginHW.MarginH10,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: MarginHW.MarginH12,
  },
  link: {
    fontSize: FontsSize.size13,
    textDecorationLine: "underline",
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black,
  },
  uploadBtn: {
    backgroundColor: Colors.primaryBlue,
    paddingVertical: MarginHW.MarginH16,
    borderRadius: MarginHW.MarginH12,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: MarginHW.MarginH20,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  uploadText: {
    color: Colors.white,
    fontSize: FontsSize.size16,
    fontFamily: fonts.Lexend_SemiBold,
  },
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  infoSheet: {
    backgroundColor: Colors.white,
    padding: MarginHW.MarginH20,
    borderTopLeftRadius: MarginHW.MarginH20,
    borderTopRightRadius: MarginHW.MarginH20,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: MarginHW.MarginH12,
  },
  check: {
    color: Colors.primaryBlue,
    fontSize: FontsSize.size18,
    marginRight: MarginHW.MarginW10,
  },
  checkText: {
    fontSize: FontsSize.size14,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black,
  },
  step: {
    fontSize: FontsSize.size14,
    marginBottom: MarginHW.MarginH10,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black,
  },

});
