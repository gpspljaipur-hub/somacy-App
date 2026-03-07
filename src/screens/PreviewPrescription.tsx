import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
} from "react-native";
import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { Asset } from "react-native-image-picker";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store/store";
import { uploadPrescription } from "../Service/HomePageService";
import { Alert, ActivityIndicator } from "react-native";
import { RootStackParamList } from "../navigations/AppNavigator";
import HWSize from "../comman/comman/HWSize";
import MarginHW from "../comman/comman/MarginHW";
import { Colors } from "../comman/comman/Colors";
import FontsSize from "../comman/comman/FontsSize";
import fonts from "../comman/comman/fonts";
import ScreenWrapper from "../comman/comman/ScreenWrapper";
import { SafeAreaView } from "react-native-safe-area-context";
import UploadModal from "../modal/UploadModal";

type RouteProps = RouteProp<RootStackParamList, "PreviewPrescription">;

const PreviewPrescription = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProps>();
  const user = useSelector((state: RootState) => state.auth.user);
  const selectedAddress = useSelector((state: RootState) => state.address.selectedAddress);
  const tidNumber = route.params?.tidNumber
  const lange = route.params?.lang
  const initialImages: Asset[] = route.params?.images ?? [];
  const [images, setImages] = useState<Asset[]>(initialImages);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const addMoreImages = () => {
    setShowPicker(true);
  };

  const handelsubmit = async () => {
    if (images.length === 0) {
      Alert.alert("Required", "Please upload at least one prescription image.");
      return;
    }

    if (!selectedAddress) {
      Alert.alert(
        "Address Required",
        "Please select a delivery address to proceed.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Select Address",
            onPress: () => navigation.navigate("MyAddressData", { lang: lange }),
          },
        ]
      );
      return;
    }

    if (!user) {
      Alert.alert("Error", "User details not found. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const fullAddress = `${selectedAddress.hno || ''}, ${selectedAddress.address}, ${selectedAddress.landmark || ''}`;

      const d_charge = (selectedAddress as any).delivery_charge || "0";
      const order_cat = "0";
      const tid = tidNumber

      const res = await uploadPrescription(
        user.id,
        fullAddress,
        d_charge,
        order_cat,
        tid,
        images
      );
      if (res?.ResponseCode === "200") {
        navigation.navigate("CashDeliveryScreen", { lang: lange });
      } else {
        Alert.alert("Error", res?.ResponseMsg || "Failed to upload prescription.");
      }
    } catch (error) {
      console.log("Upload error", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* IMAGES */}
      <FlatList
        data={images}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingVertical: MarginHW.MarginH5, paddingHorizontal: MarginHW.MarginH5 }}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.imageBox}>
            <Image source={{ uri: item.uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => removeImage(index)}
            >
              <Text style={styles.removeText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.moreBtn} onPress={addMoreImages}>
          <Text style={styles.btnText}>{lange === "hi" ? "और अपलोड करें" : "More Upload"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.7 }]}
          onPress={handelsubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} size="small" />
          ) : (
            <Text style={styles.btnText}>{lange === "hi" ? "जमा करें" : "Submit"}</Text>
          )}
        </TouchableOpacity>
      </View>
      <UploadModal
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onImageSelected={(assets) => setImages(prev => [...prev, ...assets])}
      />
    </SafeAreaView >
  );
};

export default PreviewPrescription;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: MarginHW.MarginH10,
  },
  imageBox: {
    width: (Dimensions.get('window').width - MarginHW.MarginH10 * 3) / 2,
    height: HWSize.H_Height180,
    marginBottom: MarginHW.MarginH10,
    marginRight: MarginHW.MarginH8,
    borderRadius: MarginHW.MarginH10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  removeBtn: {
    position: "absolute",
    top: MarginHW.MarginH5,
    right: MarginHW.MarginW5,
    backgroundColor: Colors.black,
    width: HWSize.W_Width20,
    height: HWSize.W_Width20,
    borderRadius: MarginHW.MarginH12,
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: {
    color: Colors.white,
    fontSize: FontsSize.size12,
    fontFamily: fonts.Lexend_SemiBold,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: MarginHW.MarginH10,
  },
  moreBtn: {
    backgroundColor: Colors.primaryBlue,
    padding: MarginHW.MarginH10,
    borderRadius: MarginHW.MarginH12,
    width: "48%",
  },
  submitBtn: {
    backgroundColor: Colors.primaryBlue,
    padding: MarginHW.MarginH10,
    borderRadius: MarginHW.MarginH12,
    width: "48%",
  },
  btnText: {
    color: Colors.white,
    textAlign: "center",
    fontSize: FontsSize.size14,
    fontFamily: fonts.Lexend_SemiBold,
  },

});
