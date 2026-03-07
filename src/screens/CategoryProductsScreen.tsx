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
import CartModal from "../modal/CartModel";
import HeaderAddressSelector from "../components/HeaderAddressSelector";
import CartWithBadge from "../components/CartWithBadge";
type Language = "en" | "hi";

const CategoryProductsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { categoryId, categoryName } = route.params;
  const lang = route?.params?.lang
  const dispatch = useDispatch()
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const categoryListRef = useRef<FlatList>(null);
  const { categories, homeSections, loading, prescriptionHistory } = useSelector((state: RootState) => state.home);
  const [cartModalVisible, setCartModalVisible] = useState(false);

  /* Localization Data */

  const textData: Record<Language, {
    off: string;
    add: string;
    orderByCategory: string;
    noProducts: string;

  }> = {
    en: {
      off: "OFF",
      add: "Add",
      orderByCategory: "Order by Category",
      noProducts: "No products found in this category.",
    },
    hi: {
      off: "छूट",
      add: "जोड़ें",
      orderByCategory: "श्रेणी के अनुसार ऑर्डर करें",
      noProducts: "इस श्रेणी में कोई उत्पाद नहीं मिला।",
    },
  };


  const { off, add, orderByCategory, noProducts } = textData[lang as keyof typeof textData];

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

  const selectedHomeSection = homeSections.find((section: any) => String(section.cat_id) === String(activeCategory?.id));

  const cartItems = useSelector(
    (state: RootState) => state.cart.items
  );

  const products = (selectedHomeSection?.Medicine && selectedHomeSection.Medicine.length > 0)
    ? selectedHomeSection.Medicine
    : (activeCategory?.productlist && activeCategory.productlist.length > 0)
      ? activeCategory.productlist
      : [];

  const renderItem = ({ item }: any) => {
    const cartItem = cartItems[item.id];
    const qty = cartItem?.quantity || 0;
    const price = Number(item.product_info?.[0]?.product_price);
    const Pdiscount = item.product_info?.[0]?.product_discount;

    return (
      <View style={styles.card}>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate("ProductInfo", { product: item, lang })
          }
        >
          {Pdiscount > 0 && (
            <ImageBackground
              source={require("../assets/images/ic_discount_shape.png")}
              style={styles.discountImg}
              resizeMode="contain"
            >
              <Text style={styles.discountText}>
                {Pdiscount}% {off}
              </Text>
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
              <Text style={styles.oldPrice}>
                ₹{calculateMRP(price, Pdiscount)}
              </Text>
            )}
          </View>
        </TouchableOpacity>

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
        <View style={styles.searchContainer}>
          <SearchBar lang={lang} />
        </View>
        <UploadPrescription
          lang={lang} />
        <Text style={styles.sectionTitle}>{orderByCategory}</Text>

        <View style={styles.categoryWrapper}>
          <FlatList
            ref={categoryListRef}
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item: any) => String(item.id)}
            contentContainerStyle={styles.categoryRow}
            getItemLayout={(_, index) => ({
              length: HWSize.W_Width100 + MarginHW.MarginH12,
              offset: (HWSize.W_Width100 + MarginHW.MarginH12) * index,
              index,
            })}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{
                  width: HWSize.W_Width100,
                  marginRight: MarginHW.MarginH12,
                  marginTop: MarginHW.MarginH12,
                  alignItems: "center",
                }}
                onPress={() => setActiveCategory(item)}
              >
                <View
                  style={[
                    styles.categoryBoxRow,
                    {
                      backgroundColor:
                        Colors.categoryColors[index % Colors.categoryColors.length],
                      borderWidth: activeCategory?.id === item.id ? HWSize.H_Height2 : 0,
                      borderColor: Colors.purpleBtn,
                    },
                  ]}
                >
                  <Image
                    source={{ uri: `${API_CONFIG.IMG_URL}/${item.catimg}` }}
                    style={styles.categoryIcon}
                  />
                </View>
                <Text style={styles.categoryText} numberOfLines={1}>
                  {lang === "hi"
                    ? item.catnameHindi
                    : item.catname}
                </Text>
              </TouchableOpacity>
            )}
          />

        </View>

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
        <CartModal visible={cartModalVisible} onClose={() => setCartModalVisible(false)} lang={lang} />
      </ScreenWrapper>

    </>
  );
};

export default CategoryProductsScreen;

const { width } = Dimensions.get("window");
const cardWidth = (width - MarginHW.MarginH5 * 2) / 2 - MarginHW.MarginH5 * 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingHorizontal: MarginHW.MarginH5,
    // paddingVertical: MarginHW.PaddingH5,
    backgroundColor: Colors.transparent,
  },
  searchBarContainer: {
    // marginTop: MarginHW.MarginH20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: MarginHW.MarginW10,
    marginTop: MarginHW.MarginH10,
    marginBottom: MarginHW.MarginH10,
  },
  searchContainer: {
    marginTop: MarginHW.MarginH6,
    marginBottom: MarginHW.MarginH10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",

    marginHorizontal: MarginHW.MarginH10,
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

  categoryIcon: {
    width: HWSize.W_Width40,
    height: HWSize.H_Height40,
  },
  categoryText: {
    fontSize: FontsSize.size14,
    fontFamily: fonts.Lexend_SemiBold,
    marginTop: MarginHW.MarginH5,
    textAlign: "center",
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
    marginVertical: MarginHW.MarginH8,

    marginLeft: MarginHW.MarginW12,
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
    // resizeMode: "contain",
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
    marginTop: MarginHW.MarginH1,
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
    marginTop: MarginHW.MarginH3,
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
    marginTop: MarginHW.MarginH8,
    paddingHorizontal: MarginHW.PaddingW8,
    height: HWSize.H_Height36,
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
    height: HWSize.H_Height110,
    marginBottom: MarginHW.MarginH1,
  },
  categoryRow: {
    paddingHorizontal: MarginHW.MarginH10,
  },
  categoryBoxRow: {
    width: HWSize.W_Width100,
    height: HWSize.H_Height70,
    borderRadius: HWSize.H_Height15,
    alignItems: "center",
    justifyContent: "center",
  },
});
