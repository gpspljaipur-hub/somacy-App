import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store/store";
import API_CONFIG from "../config/apiConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "../components/SearchBar";
import UploadPrescription from "../components/UploadPrescription";
import { addToCart, incrementQty, decrementQty, } from "../Redux/Slices/cartSlice";
import { Colors } from "../comman/comman/Colors";
import FontsSize from "../comman/comman/FontsSize";
import HWSize from "../comman/comman/HWSize";
import MarginHW from "../comman/comman/MarginHW";
import fonts from "../comman/comman/fonts";
import ScreenWrapper from "../comman/comman/ScreenWrapper";
import { useNavigation } from "@react-navigation/native";
import { calculateMRP } from "../utils/PriceUtils";
import HeaderAddressSelector from "../components/HeaderAddressSelector";
import CartWithBadge from "../components/CartWithBadge";
type Language = "en" | "hi";


const AllProductScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { categoryId, data: sectionData, lang } = route.params || {};
  const dispatch = useDispatch()
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const categoryListRef = useRef<FlatList>(null);
  const { categories, loading } = useSelector((state: RootState) => state.home);


  /* Localization Data */
  const textData:
    Record<Language, {
      off: string,
      add: string,
      noProducts: string,
    }> = {
    en: {
      off: "OFF",
      add: "Add",
      noProducts: "No products found in this category.",
    },
    hi: {
      off: "छूट",
      add: "जोड़ें",
      noProducts: "इस श्रेणी में कोई उत्पाद नहीं मिला।",
    },
  };

  const { off, add, noProducts } = textData[lang as keyof typeof textData];

  useEffect(() => {
    if (categories.length > 0 && categoryId) {
      const current = categories.find((c: any) => String(c.id) === String(categoryId));
      if (current) {
        setActiveCategory(current);
        const index = categories.findIndex((c: any) => String(c.id) === String(categoryId));
        if (index !== -1) {
          setTimeout(() => {
            categoryListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
          }, 500);
        }
      }
    }
  }, [categoryId, categories]);

  const cartItems = useSelector(
    (state: RootState) => state.cart.items
  );
  const products =
    sectionData && sectionData.length > 0
      ? sectionData
      : activeCategory?.productlist && activeCategory.productlist.length > 0
        ? activeCategory.productlist
        : [];
  const renderItem = ({ item }: any) => {
    const cartItem = cartItems[item.id];
    const qty = cartItem?.quantity || 0;
    const price = Number(item.product_info?.[0]?.product_price);
    const Pdiscount = item.product_info?.[0]?.product_discount

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate("ProductInfo", { product: item, lang })}
      >
        <View style={styles.card}>
          {Pdiscount > 0 && (
            <ImageBackground
              source={require("../assets/images/ic_discount_shape.png")}
              style={styles.discountImg}
              resizeMode="contain"
            >
              <Text style={styles.discountText}>{Pdiscount}% {off}</Text>
            </ImageBackground>
          )}
          <Image
            source={{ uri: `${API_CONFIG.IMG_URL}/${item.product_image?.[0]}` }}
            style={styles.image}
          />

          <Text style={styles.title} numberOfLines={2}>
            {item.product_name}
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{price}</Text>
            {Pdiscount > 0 && (
              <Text style={styles.oldPrice}>₹{calculateMRP(price, Pdiscount)}</Text>
            )}
          </View>
          {qty === 0 ? (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() =>
                dispatch(
                  addToCart({
                    id: item.id,
                    product_name: item.product_name,
                    price,
                    image: item.product_image?.[0],
                    quantity: 1,
                    discount: Number(Pdiscount || 0),
                  })
                )
              }
            >
              <Text style={styles.addText}>{add}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.qtyContainer}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => dispatch(decrementQty(item.id))}
              >
                <Text style={styles.qtyText}>−</Text>
              </TouchableOpacity>

              <Text style={styles.qty}>{qty}</Text>

              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => dispatch(incrementQty(item.id))}
              >
                <Text style={styles.qtyText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };


  return (
    <>
      <StatusBar backgroundColor={Colors.backgroundLight} barStyle="dark-content" />
      <ScreenWrapper style={styles.container} useScrollView={false} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity style={styles.logoRow} onPress={() => navigation.navigate("MainPageDetailsScrren", { screen: "Home", params: { screen: "HomeMain" } })}>
              <Image
                source={require("../assets/images/logo.png")}
                style={styles.brandLogo}
              />
              <Text style={styles.brandName}>Somacy</Text>
            </TouchableOpacity>

            <HeaderAddressSelector lang={lang} />
          </View>

          <CartWithBadge style={styles.cartIcon} lang={lang} />
        </View>
        <View style={styles.searchBarContainer}>
          <SearchBar
            lang={lang} />
        </View>
        <UploadPrescription
          lang={lang} />

        {/* <FlatList
            ref={categoryListRef}
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item: any) => String(item.id)}
            contentContainerStyle={styles.categoryRow}
            getItemLayout={(_, index) => ({
              length: HWSize.W_Width95 + MarginHW.MarginH12,
              offset: (HWSize.W_Width95 + MarginHW.MarginH12) * index,
              index,
            })}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.categoryBoxRow,
                  {
                    backgroundColor:
                      Colors.categoryColors[index % Colors.categoryColors.length],
                    borderWidth: activeCategory?.id === item.id ? HWSize.H_Height2 : 0,
                    borderColor: Colors.purpleBtn,
                  },
                ]}
                onPress={() => setActiveCategory(item)}
              >
                <Image
                  source={{ uri: `${API_CONFIG.IMG_URL}/${item.catimg}` }}
                  style={styles.categoryIcon}
                />
                <Text style={styles.categoryText} numberOfLines={1}>
                  {item.catname}
                </Text>
              </TouchableOpacity>
            )}
          /> */}


        <View style={{ flex: 1 }}>

          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={Colors.purpleBtn} />
            </View>
          ) : products.length > 0 ? (
            <FlatList
              data={products}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderItem}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.list}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{noProducts}</Text>
            </View>
          )}
        </View>
      </ScreenWrapper>

    </>
  );
};

export default AllProductScreen;

const { width } = Dimensions.get("window");
const cardWidth = (width - MarginHW.PaddingW12 * 2) / 2 - MarginHW.MarginH5 * 2;

const styles = StyleSheet.create({
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
    marginBottom: MarginHW.MarginH5,
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

  cartIcon: {
    width: HWSize.W_Width15,
    height: HWSize.H_Height15,
    resizeMode: "contain",
  },
  container: {
    // flex: 1,
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: MarginHW.PaddingW12,
  },
  searchBarContainer: {
    // marginTop: MarginHW.MarginH20,
  },

  categoryIcon: {
    width: HWSize.W_Width40,
    height: HWSize.H_Height40,
  },
  categoryText: {
    fontSize: FontsSize.size12,
    fontFamily: fonts.Lexend_SemiBold,
  },


  list: {
    paddingBottom: MarginHW.MarginH20,
  },

  card: {
    width: cardWidth,
    backgroundColor: Colors.white,
    borderRadius: HWSize.H_Height12,
    padding: MarginHW.PaddingH10,
    margin: MarginHW.MarginH5,
    height: HWSize.H_Height235,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: FontsSize.size18,
    marginTop: MarginHW.MarginH8,
    marginBottom: MarginHW.MarginH8,
    fontFamily: fonts.Lexend_SemiBold,
  },
  discount: {
    position: "absolute",
    top: MarginHW.MarginH8,
    left: MarginHW.MarginW8,
    backgroundColor: Colors.softRed,
    borderRadius: HWSize.H_Height3,
    paddingHorizontal: MarginHW.PaddingW5,
    paddingVertical: MarginHW.PaddingH3,
    zIndex: 1,
  },
  discountImg: {
    position: "absolute",
    // top: MarginHW.MarginH8,
    // left: -MarginHW.MarginW8,
    width: HWSize.W_Width70,
    height: HWSize.H_Height30,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  discountText: {
    color: Colors.white,
    fontSize: FontsSize.size10,
    fontFamily: fonts.Lexend_SemiBold,
  },

  image: {
    height: HWSize.H_Height90,
    width: "100%",
    marginTop: MarginHW.MarginH20,
  },

  title: {
    fontSize: FontsSize.size16,
    fontFamily: fonts.Lexend_SemiBold,
    marginTop: MarginHW.MarginH8,
    color: Colors.darkText,
  },

  price: {
    fontSize: FontsSize.size14,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: MarginHW.MarginH4,
  },
  oldPrice: {
    fontSize: FontsSize.size12,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.greyText,
    textDecorationLine: "line-through",
    marginLeft: MarginHW.MarginW8,
  },

  addBtn: {
    backgroundColor: Colors.purpleBtn,
    borderRadius: HWSize.H_Height3,
    paddingVertical: MarginHW.PaddingH8,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: MarginHW.MarginH5,
  },

  addText: {
    color: Colors.white,
    fontSize: FontsSize.size14,
    fontFamily: fonts.Lexend_SemiBold,
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.purpleBtn,
    borderRadius: HWSize.H_Height3,
    marginTop: "auto",
    paddingHorizontal: MarginHW.PaddingW8,
    height: HWSize.H_Height36,
    marginBottom: MarginHW.MarginH5,
  },

  qtyBtn: {
    width: HWSize.W_Width30,
    alignItems: "center",
  },

  qtyText: {
    color: Colors.white,
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,
  },

  qty: {
    color: Colors.white,
    fontSize: FontsSize.size14,
    fontFamily: fonts.Lexend_SemiBold,
  },
  loaderContainer: {
    height: HWSize.H_Height400,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: HWSize.H_Height200,
  },
  emptyText: {
    fontSize: FontsSize.size16,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.greyText,
  },
  categoryWrapper: {
    height: HWSize.H_Height120,
    marginBottom: MarginHW.MarginH20,
  },
  categoryRow: {
    paddingHorizontal: MarginHW.MarginH10,
  },
  categoryBoxRow: {
    width: HWSize.W_Width100,
    height: HWSize.H_Height100,
    borderRadius: HWSize.H_Height15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: MarginHW.MarginH12,
    marginTop: MarginHW.MarginH12,

  },
});
