import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, Region } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedAddress } from "../Redux/Slices/addressSlice";
import { RootStackParamList } from "../navigations/AppNavigator";
import { RootState } from "../Redux/store/store";
import { fetchAddressDetails, fetchUserAddressDetails } from "../Service/HomePageService";
import { Colors } from "../comman/comman/Colors";
import ScreenWrapper from "../comman/comman/ScreenWrapper";
import fonts from "../comman/comman/fonts";
import ShowToastMessage from "../components/ToastMessage/ShowToastMessage";

type Language = "en" | "hi";
type AddressItem = {
  id: string;
  hno?: string;
  address: string;
  landmark?: string;
  type?: string;
  lat_map?: string;
  long_map?: string;
};


type Props = NativeStackScreenProps<
  RootStackParamList,
  "MapScreen"
>;

const DEFAULT_REGION: Region = {
  latitude: 28.6139,
  longitude: 77.209,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};


const MapScreen: React.FC<Props> = ({ navigation, route }) => {
  const mapRef = useRef<MapView>(null);
  const { address, isEdit, lang } = route.params || {};

  const user = useSelector((state: RootState) => state.auth.user);
  console.log(user, "useruser");

  const selectedAddress = useSelector((state: RootState) => state.address.selectedAddress);
  const dispatch = useDispatch();
  const [pincode, setPincode] = useState<any>("")
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);

  const [houseNo, setHouseNo] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [landmark, setLandmark] = useState("");

  const [addressType, setAddressType] = useState<string>("Home");
  const [customType, setCustomType] = useState("");

  /* Localization Data */
  const textData: Record<Language, {
    houseNoPlaceholder: string;
    fullAddressPlaceholder: string;
    landmarkPlaceholder: string;
    saveAsLabel: string;
    typeHome: string;
    typeOffice: string;
    typeOther: string;
    customTypePlaceholder: string;
    btnSave: string;
    btnUpdate: string;
    alertError: string;
    alertLocation: string;
    alertService: string;
    alertDausa: string;
    alertRequired: string;
    alertName: string;
    alertSuccessSave: string;
    alertSuccessUpdate: string;
    alertFailed: string;
  }> = {
    en: {
      houseNoPlaceholder: "House No",
      fullAddressPlaceholder: "Full Address",
      landmarkPlaceholder: "Landmark",
      saveAsLabel: "Save As",
      typeHome: "Home",
      typeOffice: "Office",
      typeOther: "Other",
      customTypePlaceholder: "E.g. Parents' Home, Gym, Shop",
      btnSave: "Save Address",
      btnUpdate: "Update Address",
      alertError: "Error",
      alertLocation: "Location not selected. Please select a point on the map.",
      alertService: "Service Unavailable",
      alertDausa: "Our services are currently available only for residents of Dausa, Rajasthan.",
      alertRequired: "Required",
      alertName: "Please enter a name for this address (e.g. Gym, Dad's Home)",
      alertSuccessSave: "Address saved successfully",
      alertSuccessUpdate: "Address updated successfully",
      alertFailed: "Failed to save address",
    },
    hi: {
      houseNoPlaceholder: "मकान नंबर",
      fullAddressPlaceholder: "अपना पूरा पता दर्ज करें",
      landmarkPlaceholder: "लैंडमार्क",
      saveAsLabel: "के रूप में सहेजें",
      typeHome: "घर",
      typeOffice: "कार्यालय",
      typeOther: "अन्य",
      customTypePlaceholder: "उदाहरण: माता-पिता का घर, जिम, दुकान",
      btnSave: "पता सहेजें",
      btnUpdate: "पता अपडेट करें",
      alertError: "त्रुटि",
      alertLocation: "स्थान नहीं चुना गया। कृपया मानचित्र पर एक बिंदु चुनें।",
      alertService: "सेवा अनुपलब्ध",
      alertDausa: "हमारी सेवाएं वर्तमान में केवल दौसा, राजस्थान के निवासियों के लिए उपलब्ध हैं।",
      alertRequired: "आवश्यक",
      alertName: "कृपया इस पते के लिए एक नाम दर्ज करें (उदाहरण: जिम, पिताजी का घर)",
      alertSuccessSave: "पता सफलतापूर्वक सहेजा गया",
      alertSuccessUpdate: "पता सफलतापूर्वक अपडेट किया गया",
      alertFailed: "पता सहेजने में विफल",
    },
  };

  const {
    houseNoPlaceholder,
    fullAddressPlaceholder,
    landmarkPlaceholder,
    saveAsLabel,
    typeHome,
    typeOffice,
    typeOther,
    customTypePlaceholder,
    btnSave,
    btnUpdate,
    alertError,
    alertLocation,
    alertService,
    alertDausa,
    alertRequired,
    alertName,
    alertSuccessSave,
    alertSuccessUpdate,
    alertFailed,
  } = textData[lang as keyof typeof textData];


  useEffect(() => {
    if (isEdit && address) {
      prefillEditAddress(address);
    } else {
      requestLocationPermission();
    }
  }, []);


  const prefillEditAddress = (addr: AddressItem) => {
    setHouseNo(addr.hno || "");
    setFullAddress(addr.address || "");
    setLandmark(addr.landmark || "");

    const type = addr.type || "Home";
    if (type === "Home" || type === "Office") {
      setAddressType(type);
    } else {
      setAddressType("Other");
      setCustomType(type);
    }

    if (addr.lat_map && addr.long_map) {
      const editRegion: Region = {
        latitude: Number(addr.lat_map),
        longitude: Number(addr.long_map),
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setRegion(editRegion);
      mapRef.current?.animateToRegion(editRegion, 1000);
    }

    setLoading(false);
  };

  /* ================= LOCATION ================= */

  const requestLocationPermission = async () => {
    const permission =
      Platform.OS === "ios"
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const result = await request(permission);

    if (result === RESULTS.GRANTED) {
      Geolocation.getCurrentPosition(
        (pos) => {
          const newRegion: Region = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          };
          setRegion(newRegion);
          reverseGeocode(newRegion.latitude, newRegion.longitude);
          mapRef.current?.animateToRegion(newRegion, 1000);
          setLoading(false);
        },
        () => setLoading(false),
        { enableHighAccuracy: true }
      );
    } else {
      setLoading(false);
    }
  };

  /* ================= REVERSE GEOCODE ================= */
  const extractPincode = (address: string): string => {
    // Indian pincode: 6 digits
    const match = address.match(/\b\d{6}\b/);
    return match ? match[0] : "";
  };


  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
        { headers: { "User-Agent": "SomacyApp/1.0" } }
      );

      const data = await res.json();

      const address = data.display_name || "";
      setFullAddress(address);

      if (data.address?.postcode) {
        setPincode(data.address.postcode);
      } else {
        const extracted = extractPincode(address);
        setPincode(extracted);
      }
    } catch (e) {
      console.log("Reverse geocode error", e);
      ShowToastMessage?.showToast("Unable to fetch address for this location");
    }
  };


  console.log(fullAddress, "fulladdresssss");

  const onMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;

    const newRegion: Region = {
      latitude,
      longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };

    setRegion(newRegion);
    reverseGeocode(latitude, longitude);
  };

  const onRegionChangeComplete = (newRegion: Region) => {
    // Optional: Auto-update address when user stops panning
    // For now let's keep it manual by click to avoid too many API calls
    // But we update region so Marker follows center if we wanted.
  };


  const saveAddress = async () => {
    if (!user || !region) {
      Alert.alert(alertError, alertLocation);
      return;
    }

    const isDausa =
      fullAddress.toLowerCase().includes("dausa") ||
      landmark.toLowerCase().includes("dausa") ||
      houseNo.toLowerCase().includes("dausa");

    if (!isDausa) {
      Alert.alert(alertService, alertDausa);
      setLoading(false);
      return;
    }

    let finalType = addressType;
    if (addressType === "Other") {
      if (!customType.trim()) {
        Alert.alert(alertRequired, alertName);
        return;
      }
      finalType = customType.trim();
    }

    setLoading(true);
    try {
      const aid = isEdit && address?.id ? address.id : "0";
      console.log("Saving address:", {
        uid: user.id,
        address: fullAddress,
        pincode,
        houseno: houseNo,
        landmark,
        type: finalType,
        lat: region.latitude,
        lng: region.longitude,
        aid
      });

      const res = await fetchUserAddressDetails(
        user.id,
        fullAddress,
        pincode,
        houseNo,
        landmark,
        finalType,
        region.latitude,
        region.longitude,
        aid
      );

      console.log("Save address response:", res);

      if (res?.Result === "true") {
        // Update Redux
        dispatch(setSelectedAddress({
          id: isEdit && aid !== "0" ? aid : (res.AddressId || "0"),
          hno: houseNo,
          address: fullAddress,
          landmark: landmark,
          type: finalType,
          lat_map: String(region.latitude),
          long_map: String(region.longitude)
        }));

        ShowToastMessage?.showToast(isEdit ? alertSuccessUpdate : alertSuccessSave);
        setTimeout(() => {
          navigation.navigate("MyAddressData", { lang: lang })
        }, 1000);
      } else {
        ShowToastMessage?.showToast(res?.ResponseMsg || alertFailed);
      }
    } catch (error: any) {
      console.log("Save address error:", error);
      Alert.alert(alertError, "Something went wrong while saving: " + error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <ScreenWrapper style={{ flex: 1 }} useScrollView={false}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={region ?? DEFAULT_REGION}
        region={region ?? undefined}
        showsUserLocation
        onPress={onMapPress}
      >
        {region && (
          <Marker
            coordinate={region}
            draggable
            onDragEnd={onMapPress}
          />
        )}
      </MapView>

      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.purpleBtn} />
        </View>
      )}

      <KeyboardAvoidingView behavior="padding" style={styles.sheet}>
        <ScrollView>
          <TextInput
            value={houseNo}
            placeholder={houseNoPlaceholder}
            placeholderTextColor={Colors.lightGreyText}
            style={styles.input}
            onChangeText={setHouseNo}
          />

          <TextInput
            value={fullAddress}
            placeholder={fullAddressPlaceholder}
            placeholderTextColor={Colors.lightGreyText}
            multiline
            style={styles.input}
            onChangeText={setFullAddress}
          />

          <TextInput
            value={landmark}
            placeholder={landmarkPlaceholder}
            placeholderTextColor={Colors.lightGreyText}
            style={styles.input}
            onChangeText={setLandmark}
          />

          <Text style={styles.saveAsLabel}>{saveAsLabel}</Text>

          <View style={styles.typeContainer}>
            {["Home", "Office", "Other"].map((type) => {
              const selected = addressType === type;
              // Map types for display
              let displayType = type;
              if (type === "Home") displayType = typeHome;
              if (type === "Office") displayType = typeOffice;
              if (type === "Other") displayType = typeOther;

              return (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    selected && styles.activeTypeButton,
                  ]}
                  onPress={() => setAddressType(type)}
                >
                  <Text
                    style={[
                      styles.typeText,
                      selected && styles.activeTypeText,
                    ]}
                  >
                    {displayType}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {addressType === "Other" && (
            <TextInput
              value={customType}
              placeholder={customTypePlaceholder}
              placeholderTextColor={Colors.lightGreyText}
              style={styles.input}
              onChangeText={setCustomType}
            />
          )}

          <TouchableOpacity style={styles.btn} onPress={saveAddress}>
            <Text style={styles.btnText}>
              {isEdit ? btnUpdate : btnSave}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default MapScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontFamily: fonts.Lexend_SemiBold,
  },
  saveAsLabel: {
    fontSize: 14,

    marginBottom: 8,
    fontFamily: fonts.Lexend_SemiBold,
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#fff",
  },
  activeTypeButton: {
    backgroundColor: Colors.purpleBtn,
    borderColor: Colors.purpleBtn,
  },
  typeText: {
    color: "#000",

    fontFamily: fonts.Lexend_SemiBold,
  },
  activeTypeText: {
    color: "#fff",

    fontFamily: fonts.Lexend_SemiBold,
  },
  btn: {
    backgroundColor: Colors.purpleBtn,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",

    fontFamily: fonts.Lexend_SemiBold,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
  },
});
