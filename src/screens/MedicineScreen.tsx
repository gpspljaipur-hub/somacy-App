import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Colors } from '../../src/comman/comman/Colors';
import FontsSize from '../comman/comman/FontsSize';
import HWSize from '../comman/comman/HWSize';
import MarginHW from '../comman/comman/MarginHW';
import fonts from '../comman/comman/fonts';
import ScreenWrapper from '../comman/comman/ScreenWrapper';

import { RootState } from "../Redux/store/store";
import API_CONFIG from "../config/apiConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';

import SearchBar from "../components/SearchBar";
import UploadPrescription from "../components/UploadPrescription";

import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const CATEGORY_COLORS = [
  "#90f8ff8a",
  "#f3ea6aa1",
  "#c5f37aa8",
  "#ecee6ec5",
  "#92c9f09a",
  "#f8ce7f94",
];

const BANNER_GAP = 0;
const SLIDE_WIDTH = wp("100%");
const BANNER_ITEM_WIDTH = wp("100%");

import CartModal from "../modal/CartModel";
import HeaderAddressSelector from "../components/HeaderAddressSelector";
import CartWithBadge from "../components/CartWithBadge";
type Language = "en" | "hi";


const MedicineScreen = ({ lang: propLang }: { lang?: Language }) => {
  const navigation = useNavigation<any>();
  const categories = useSelector((state: RootState) => state.home.categories);
  const bannerData = useSelector((state: RootState) => state.home.banner);
  const route = useRoute<any>()
  const lang: Language = propLang || route.params?.lang;
  const flatRef = useRef<FlatList>(null);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [cartModalVisible, setCartModalVisible] = useState(false);
  /* Localization Data */
  const textData: Record<Language, {
    orderByCategory: any;
  }> = {
    en: {
      orderByCategory: "Order by category",

    },
    hi: {
      orderByCategory: "श्रेणी के अनुसार ऑर्डर करें",
    },
  };

  const { orderByCategory } = textData[lang as keyof typeof textData];

  useEffect(() => {
    if (!bannerData?.length) return;

    const slider = setInterval(() => {
      const next = bannerIndex + 1 < bannerData.length ? bannerIndex + 1 : 0;
      flatRef.current?.scrollToIndex({ index: next, animated: true });
      setBannerIndex(next);
    }, 2500);

    return () => clearInterval(slider);
  }, [bannerIndex, bannerData]);

  const handleBannerPress = (index: number) => {
    switch (index) {
      case 0:
        navigation.navigate("Medicine", {
          screen: "MedicineHome",
        });
        break;
      case 1:
        navigation.navigate("CameraPermission", { lang });
        break;
      case 2:
        navigation.navigate("LabTest", {
          screen: "LabTestScreen",
        });
        break;
      default:
        console.log("Banner pressed:", index);
        break;
    }
  };

  return (
    <ScreenWrapper style={styles.container} edges={["top", "left", "right"]} scroll={false}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity style={styles.logoRow} onPress={() => navigation.navigate("MainPageDetailsScrren", { screen: "Home", params: { screen: "HomeMain" } })}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.brandLogo}
            />
            <Text style={styles.brandName}>Somacy</Text>
          </TouchableOpacity>

          <HeaderAddressSelector style={{}} lang={lang} />
        </View>

        <CartWithBadge lang={lang} />
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

        <View style={{}}>
          <SearchBar lang={lang} />
          <UploadPrescription hideOr={true} lang={lang} />

          <Text style={styles.sectionTitle}>{orderByCategory}</Text>

          <View style={styles.categoryContainer}>
            {categories?.map((item: any, index: number) => (
              <TouchableOpacity
                key={item.id}
                style={styles.categoryItem}
                onPress={() =>
                  navigation.navigate("CategoryProducts", {
                    categoryId: item.id,
                    categoryName: item.catname,
                    lang: lang
                  })
                }
              >
                <View
                  style={[
                    styles.categoryBox,
                    { backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] },
                  ]}
                >
                  <Image
                    source={{ uri: `${API_CONFIG.IMG_URL}/${item.catimg}` }}
                    style={styles.categoryIcon}
                  />
                </View>
                {/* <Text style={styles.categoryText}>{item.catname}</Text> */}
                <Text style={styles.categoryText}>
                  {lang === "hi"
                    ? item.catnameHindi
                    : item.catname}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <FlatList
          ref={flatRef}
          data={bannerData}
          keyExtractor={(item: any) => String(item.id)}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={SLIDE_WIDTH}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: BANNER_GAP / 2 }}
          ItemSeparatorComponent={() => <View style={{ width: BANNER_GAP }} />}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handleBannerPress(index)}
            >
              <View style={styles.bannerItem}>
                {
                  lang == "hi" ?
                    <Image
                      source={{ uri: `${API_CONFIG?.IMG_URL}/${item.img_hindi}` }}
                      style={styles.bannerCarousel}
                      resizeMode="cover"
                    />
                    :
                    <Image
                      source={{ uri: `${API_CONFIG?.IMG_URL}/${item.img}` }}
                      style={styles.bannerCarousel}
                      resizeMode="cover"
                    />
                }

              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>

      <CartModal visible={cartModalVisible} onClose={() => setCartModalVisible(false)} lang={lang} />
    </ScreenWrapper>
  );
};

export default MedicineScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: MarginHW.PaddingH10,


  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: MarginHW.MarginH8,

    marginHorizontal: MarginHW.MarginH3,
  },


  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: MarginHW.MarginH8,
    // marginLeft: MarginHW.PaddingH10 + MarginHW.MarginH3,
  },


  brandLogo: {
    width: HWSize.W_Width15,
    height: HWSize.H_Height15,
    resizeMode: "contain",
    marginRight: MarginHW.MarginH5,
    marginLeft: MarginHW.MarginH1,


  },

  brandName: {
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black,

  },

  addressRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  locationIcon: {
    width: HWSize.W_Width20,
    height: HWSize.H_Height20,
    // marginLeft: MarginHW.MarginH1,
    tintColor: Colors.black,
  },

  addressLabel: {
    fontSize: FontsSize.size14,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black,
  },

  cartIcon: {
    width: HWSize.W_Width15,
    height: HWSize.H_Height15,
    resizeMode: "contain",
    // marginRight: MarginHW.PaddingH10 + MarginHW.MarginH5,
  },
  sectionTitle: {
    fontSize: FontsSize.size16,
    fontFamily: fonts.Lexend_SemiBold,
    marginTop: MarginHW.MarginH10,
    marginHorizontal: MarginHW.MarginH12,
    color: Colors.black,
  },

  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: MarginHW.MarginH8,
    // marginHorizontal: MarginHW.MarginH10,
  },

  categoryItem: {
    width: HWSize.W_Width110,
    marginBottom: MarginHW.MarginH10,
    alignItems: "center",
  },

  categoryBox: {
    width: "100%",
    borderRadius: HWSize.H_Height12,
    paddingVertical: MarginHW.PaddingH10,
    alignItems: "center",
  },

  categoryIcon: {
    width: HWSize.W_Width40,
    height: HWSize.H_Height40,
    // marginBottom: MarginHW.MarginH8, // removed inner margin
  },

  categoryText: {
    fontSize: FontsSize.size14,
    fontFamily: fonts.Lexend_SemiBold,
    textAlign: "center",
    marginTop: MarginHW.MarginH5,
  },

  bannerItem: {
    width: BANNER_ITEM_WIDTH,
    alignItems: "center",

  },

  bannerCarousel: {
    width: "100%",
    height: HWSize.H_Height120,
    borderRadius: HWSize.H_Height1,
    paddingHorizontal: MarginHW.PaddingH10,
  },
  addressSelector: {
    marginLeft: MarginHW.MarginH18,
  },
});
