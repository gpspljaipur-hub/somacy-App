import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
  Image,
  ListRenderItem,
  ActivityIndicator,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenWrapper from "../comman/comman/ScreenWrapper";
import { RootStackParamList } from "../navigations/AppNavigator";
import { RootState } from "../Redux/store/store";
import { DeleteAddressDetails, fetchAddressDetails } from "../Service/HomePageService";
import API_CONFIG from "../config/apiConfig";
import { useDispatch } from "react-redux";
import { setSelectedAddress, clearSelectedAddress } from "../Redux/Slices/addressSlice";

import { Colors } from "../comman/comman/Colors";
import FontsSize from "../comman/comman/FontsSize";
import HWSize from "../comman/comman/HWSize";
import MarginHW from "../comman/comman/MarginHW";
import fonts from "../comman/comman/fonts";
import ImageSize from "../comman/comman/ImageSize";

type Language = "en" | "hi";

type AddressItem = {
  id: string;
  hno?: string;
  address: string;
  landmark?: string;
  type?: "Home" | "Office" | "Other" | string;
  lat_map?: string;
  long_map?: string;
  address_image?: string;
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  "MyAddressData"
>;

const MyAddressData: React.FC<Props> = ({ navigation, route }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { lang } = route.params;

  /* Localization Data */
  const textData: Record<Language, {
    headerTitle: string;
    currentLocation: string;
    deliveryAddressLabel: string;
    menuSelect: string;
    menuEdit: string;
    menuDelete: string;
    loadingText: string;
  }> = {
    en: {
      headerTitle: "My Address",
      currentLocation: "Current Location",
      deliveryAddressLabel: "Delivery Address :",
      menuSelect: "Select",
      menuEdit: "Edit",
      menuDelete: "Delete",
      loadingText: "Loading addresses...",
    },
    hi: {
      headerTitle: "मेरा पता",
      currentLocation: "वर्तमान स्थान",
      deliveryAddressLabel: "डिलीवरी पता :",
      menuSelect: "चुनें",
      menuEdit: "संपादित करें",
      menuDelete: "हटाएं",
      loadingText: "पते लोड हो रहे हैं...",
    },
  };

  const {
    headerTitle,
    currentLocation,
    deliveryAddressLabel,
    menuSelect,
    menuEdit,
    menuDelete,
    loadingText,
  } = textData[lang as keyof typeof textData];

  const openMaps = () => {
    navigation.navigate("MapScreen", { isEdit: false, lang });
  };

  const { selectedAddress } = useSelector((state: RootState) => state.address);
  const fetchUserAddress = async () => {
    try {
      if (!user) return;
      setLoading(true);

      const res = await fetchAddressDetails(user.id);
      const apiAddresses: AddressItem[] = res?.AddressList ?? [];
      setAddresses(apiAddresses);

      if (selectedAddress) {
        const exists = apiAddresses.find((item) => item.id === selectedAddress.id);
        if (!exists) {
          dispatch(clearSelectedAddress());
        }
      }

    } catch (e) {
      console.log("Address API error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAddress();
  }, []);
  const DeleteAddress = async (addressId: string | null) => {
    try {
      const res = await DeleteAddressDetails(addressId || "");
      if (res.status === "true") {
        Alert.alert("Success", res?.ResponseMsg);
        if (selectedAddress?.id === addressId) {
          dispatch(clearSelectedAddress());
        }
      }
      fetchUserAddress();
    } catch (error) {
      console.log("Delete Address error", error);

    }
  }

  // const renderItem: ListRenderItem<AddressItem> = ({ item }) => (
  //   <View style={styles.addressRow}>
  //     <Image
  //       source={require("../assets/images/ic_home.png")}
  //       style={styles.localIcon}
  //     />

  //     <View style={styles.textBox}>
  //       <Text style={styles.addressTitle}>{item.type}</Text>
  //       <Text style={styles.addressText}>
  //         {item.hno} {item.address}
  //       </Text>
  //       {item.landmark && (
  //         <Text style={styles.landmark}>Landmark: {item.landmark}</Text>
  //       )}
  //     </View>

  //     <TouchableOpacity onPress={() => setActiveId(item.id)}>
  //       <Text style={styles.dotsText}>⋮</Text>
  //     </TouchableOpacity>

  //     {activeId === item.id && (
  //       <>
  //         <Pressable
  //           style={styles.backdrop}
  //           onPress={() => setActiveId(null)}
  //         />
  //         <View style={styles.inlineMenu}>
  //           <Text
  //             style={styles.menuItem}
  //             onPress={() => {
  //               setActiveId(null);
  //               // Handle select
  //               dispatch(setSelectedAddress(item));
  //               navigation.goBack();
  //             }}
  //           >
  //             {menuSelect}
  //           </Text>
  //           <Text
  //             style={styles.menuItem}
  //             onPress={() => {
  //               setActiveId(null);
  //               navigation.navigate("MapScreen", {
  //                 address: item,
  //                 isEdit: true,
  //                 lang,
  //               });
  //             }}
  //           >
  //             {menuEdit}
  //           </Text>
  //           <Text
  //             style={[styles.menuItem]}
  //             onPress={() => {
  //               DeleteAddress(item.id);
  //             }}
  //           >
  //             {menuDelete}
  //           </Text>
  //         </View>
  //       </>
  //     )}

  //   </View>
  // );

  const renderItem: ListRenderItem<AddressItem> = ({ item }) => (
    <TouchableOpacity
      style={styles.addressRow}
      activeOpacity={0.8}
      onPress={() => {
        dispatch(setSelectedAddress(item));
        navigation.goBack();
      }}
    >
      <Image
        source={require("../assets/images/ic_home.png")}
        style={styles.localIcon}
      />

      <View style={styles.textBox}>
        <Text style={styles.addressTitle}>{item.type}</Text>
        <Text style={styles.addressText}>
          {item.hno} {item.address}
        </Text>
        {item.landmark && (
          <Text style={styles.landmark}>
            Landmark: {item.landmark}
          </Text>
        )}
      </View>

      <View style={styles.actionBox}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("MapScreen", {
              address: item,
              isEdit: true,
              lang,
            })
          }
        >
          <Image
            source={require("../assets/images/ic_profile_edit.png")}
            style={styles.actionIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => DeleteAddress(item.id)}
        >
          <Image
            source={require("../assets/images/ic_delete.png")}
            style={styles.actionIcon}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );


  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.purpleBtn} />
        <Text style={styles.loaderText}>{loadingText}</Text>
      </View>
    );
  }

  return (
    <ScreenWrapper scroll={false}>
      <View style={styles.container}>
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={
            <>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                  <Image
                    source={require("../assets/images/back.png")}
                    style={styles.backIcon}
                  />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{headerTitle}</Text>
              </View>
              <TouchableOpacity
                style={styles.currentLocation}
                onPress={openMaps}
              >
                <Image
                  source={require("../assets/images/ic_location.png")}
                  style={styles.locationIcon}
                />
                <Text style={styles.currentText}>{currentLocation}</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>{deliveryAddressLabel} </Text>
            </>
          }
        />
      </View>
    </ScreenWrapper>
  );
};

export default MyAddressData;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },

  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  loaderText: {
    marginTop: MarginHW.MarginH10,
    color: Colors.lightGreyText,
    fontFamily: fonts.Lexend_SemiBold,
    fontSize: FontsSize.normalize14
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

  currentLocation: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: MarginHW.PaddingW10,
    paddingBottom: MarginHW.MarginH10,
  },
  locationIcon: {
    width: ImageSize.ImageW32,
    height: ImageSize.ImageH32,
    marginRight: MarginHW.MarginW12,
    resizeMode: 'contain'
  },
  currentText: {
    fontSize: FontsSize.normalize16,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black
  },

  divider: {
    height: HWSize.H_Height1,
    backgroundColor: Colors.couponSection
  },
  sectionTitle: {
    fontSize: FontsSize.normalize14,
    padding: MarginHW.PaddingW16,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black
  },

  addressRow: {
    flexDirection: "row",
    paddingHorizontal: MarginHW.PaddingW16,
    paddingVertical: MarginHW.PaddingH14,
    backgroundColor: Colors.white,
  },
  iconContainer: {
    width: ImageSize.ImageW32,
    height: ImageSize.ImageH32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressIcon: {
    width: ImageSize.ImageW28,
    height: ImageSize.ImageH28,
    borderRadius: HWSize.H_Height3,
    resizeMode: 'cover'
  },
  localIcon: {
    width: ImageSize.ImageW28,
    height: ImageSize.ImageH28,
    resizeMode: 'contain',
    tintColor: Colors.black
  },
  textBox: { flex: 1, marginLeft: MarginHW.MarginW12 },
  addressTitle: {
    fontSize: FontsSize.size16,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black
  },
  addressText: {
    fontSize: FontsSize.size14,
    color: Colors.greyText,
    marginTop: MarginHW.MarginH2,
    fontFamily: fonts.Lexend_SemiBold
  },
  landmark: {
    fontSize: FontsSize.normalize12,
    color: Colors.lightGreyText,
    marginTop: MarginHW.MarginH2,
    fontFamily: fonts.Lexend_SemiBold
  },

  dotsText: {
    fontSize: FontsSize.normalize24,
    paddingHorizontal: MarginHW.PaddingW8,
    color: Colors.black
  },

  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  inlineMenu: {
    position: "absolute",
    top: HWSize.H_Height36,
    right: MarginHW.MarginW16,
    width: HWSize.W_Width150,
    backgroundColor: Colors.white,
    borderRadius: HWSize.H_Height10,
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 100,
  },
  menuItem: {
    padding: MarginHW.PaddingW12,
    fontSize: FontsSize.size16,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black
  },


  emptyText: {
    textAlign: "center",
    marginTop: MarginHW.MarginH40,
    color: Colors.lightGreyText,
    fontFamily: fonts.Lexend_SemiBold,
    fontSize: FontsSize.normalize14
  },
  actionBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  actionIcon: {
    width: ImageSize.ImageW20,
    height: ImageSize.ImageH20,
    marginLeft: MarginHW.MarginW12,
    tintColor: Colors.black,
    resizeMode: 'contain',
  },
});
