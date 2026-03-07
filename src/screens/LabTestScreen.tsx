import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { addToCart, incrementQty, decrementQty } from "../Redux/Slices/cartSlice";
import SearchBar from "../components/SearchBar";
import UploadPrescription from "../components/UploadPrescription";
import API_CONFIG from "../config/apiConfig";
import { RootState } from "../Redux/store/store";
import { Colors } from "../comman/comman/Colors";
import MarginHW from "../comman/comman/MarginHW";
import HWSize from "../comman/comman/HWSize";
import FontsSize from "../comman/comman/FontsSize";
import fonts from "../comman/comman/fonts";
import ScreenWrapper from "../comman/comman/ScreenWrapper";
import CartModal from "../modal/CartModel";
import HeaderAddressSelector from "../components/HeaderAddressSelector";
import { calculateMRP } from "../utils/PriceUtils";
import CartWithBadge from "../components/CartWithBadge";
import AsyncStorage from "@react-native-async-storage/async-storage";
type Props = {
  lang: "en" | "hi";
};


const LabTestScreen: React.FC<Props> = ({ lang }) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const categoryListRef = useRef<FlatList>(null);

  const { categories, homeSections, loading, prescriptionHistory } = useSelector(
    (state: RootState) => state.home
  );
  const cartItems = useSelector(
    (state: RootState) => state.cart.items
  );
  const [activeCategory, setActiveCategory] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      if (categories?.length) {
        const lastIndex = categories.length - 1;
        const lastCategory = categories[lastIndex];

        setActiveCategory(lastCategory);
        setTimeout(() => {
          categoryListRef.current?.scrollToIndex({
            index: lastIndex,
            animated: true,
          });
        }, 200);
      }
    }, [categories])
  );
  const products = useMemo(() => {
    if (!activeCategory) return [];
    const section = homeSections?.find(
      (s: any) => String(s.cat_id) === String(activeCategory.id)
    );
    return section?.Medicine || [];
  }, [activeCategory, homeSections]);

  return (
    <>
      <StatusBar backgroundColor={Colors.backgroundLight} barStyle="dark-content" />
      <ScreenWrapper style={styles.container} useScrollView={false} edges={["top", "left", "right"]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity style={styles.logoRow} onPress={() => navigation.navigate("MainPageDetailsScrren", { screen: "Home", params: { screen: "HomeMain" } })}>
              <Image
                source={require("../assets/images/logo.png")}
                style={styles.brandLogo}
              />
              <Text style={styles.brandName}>Somacy</Text>
            </TouchableOpacity>

            <HeaderAddressSelector style={styles.addressSelector} lang={lang} />
          </View>

          <CartWithBadge lang={lang} />
        </View>

        <View style={styles.searchBarContainer}>
          <SearchBar lang={lang} />
        </View>
        <View style={styles.uploadContainer}>
          <UploadPrescription hideOr={true} lang={lang} />
        </View>
        <View style={styles.categoryWrapper}>
          <FlatList
            ref={categoryListRef}
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item: any) => String(item.id)}
            contentContainerStyle={styles.categoryRow}
            getItemLayout={(_, index) => ({
              length: HWSize.W_Width80 + MarginHW.MarginW8,
              offset: (HWSize.W_Width80 + MarginHW.MarginW8) * index,
              index,
            })}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={styles.categoryItem}
                onPress={() => setActiveCategory(item)}
              >
                <View
                  style={[
                    styles.categoryBoxInner,
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



        {loading ? (
          <ActivityIndicator size="large" color={Colors.purpleBtn} />
        ) : products.length === 0 ? (
          <Text style={styles.empty}>No products found</Text>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item: any) => String(item.id)}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 0,
              paddingHorizontal: MarginHW.MarginW14
            }}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            renderItem={({ item }) => {
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
                        <Text style={styles.discountText}>{Pdiscount}% OFF</Text>
                      </ImageBackground>
                    )}

                    <Image
                      source={{
                        uri: `${API_CONFIG.IMG_URL}/${item.product_image?.[0]}`,
                      }}
                      style={styles.image}
                    />

                    <Text numberOfLines={2} style={styles.name}>
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
                      <Text style={styles.addText}>
                        {lang === "hi" ? "जोड़ें" : "Add"}
                      </Text>
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
            }}

          />
        )}
      </ScreenWrapper>
    </>
  );
};

export default LabTestScreen;

const { width } = Dimensions.get("window");
const cardWidth = (width - (MarginHW.MarginW14 * 2) - MarginHW.MarginW10) / 2;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: Colors.backgroundLight,

  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: MarginHW.MarginH10,

    marginHorizontal: MarginHW.MarginW14 + MarginHW.MarginH3,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: MarginHW.MarginH8,
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
    marginLeft: MarginHW.MarginH8,
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
    // marginRight: MarginHW.MarginH3,
  },

  searchBarContainer: {

    marginHorizontal: MarginHW.MarginW14,
  },
  uploadContainer: {
    marginHorizontal: MarginHW.MarginW14,
  },
  sectionTitle: {
    fontSize: FontsSize.size18,
    marginVertical: MarginHW.MarginH10,
    fontFamily: fonts.Lexend_SemiBold,
    paddingHorizontal: MarginHW.MarginW14,
  },

  loader: {
    height: HWSize.H_Height120,
    justifyContent: "center",
    alignItems: "center",
  },

  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  //   categoryRow: {
  //   paddingVertical: MarginHW.MarginH10,
  // },
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

  categoryList: {
    height: HWSize.H_Height110,
  },

  categoryWrapper: {
    height: HWSize.H_Height110,
    marginVertical: MarginHW.MarginH1,
    // marginHorizontal: MarginHW.MarginH1,
  },

  categoryRow: {
    paddingLeft: MarginHW.MarginH14,
    paddingRight: MarginHW.MarginH1,
  },

  categoryItem: {
    width: HWSize.W_Width80,
    marginRight: MarginHW.MarginW8,
    marginTop: MarginHW.MarginH12,
    alignItems: "center",
  },

  categoryBoxInner: {
    width: HWSize.W_Width80,
    height: HWSize.H_Height60,
    borderRadius: HWSize.H_Height12,
    alignItems: "center",
    justifyContent: "center",
  },

  categoryIcon: {
    width: HWSize.W_Width30,
    height: HWSize.H_Height30,
    resizeMode: "contain",
  },

  categoryText: {
    fontSize: FontsSize.size12,
    fontFamily: fonts.Lexend_SemiBold,
    marginTop: MarginHW.MarginH5,
    // textAlign: "center",
  },

  empty: {
    textAlign: "center",
    marginTop: MarginHW.MarginH20,
    fontSize: FontsSize.size14,
    color: Colors.greyText,
    fontFamily: fonts.Lexend_SemiBold,
  },

  card: {
    width: cardWidth,
    backgroundColor: Colors.white,
    borderRadius: HWSize.H_Height12,
    paddingHorizontal: MarginHW.PaddingH8,
    paddingTop: MarginHW.PaddingH5,
    paddingBottom: MarginHW.PaddingH8,
    marginBottom: MarginHW.MarginH5,
    elevation: 3,
    height: HWSize.H_Height200,
    // justifyContent: "space-between",
  },

  image: {
    width: "100%",
    height: HWSize.H_Height85,
    // resizeMode: "contain",
    marginTop: MarginHW.MarginH2,
    marginBottom: MarginHW.MarginH2,
  },

  name: {
    fontSize: FontsSize.size14,
    fontFamily: fonts.Lexend_SemiBold,
    marginTop: MarginHW.MarginH2,
  },

  price: {
    fontSize: FontsSize.size14,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: MarginHW.MarginH2,
  },
  oldPrice: {
    fontSize: FontsSize.size12,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.greyText,
    textDecorationLine: "line-through",
    marginLeft: MarginHW.MarginW8,
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

  discountText: {
    color: Colors.white,
    fontSize: FontsSize.size10,
    fontFamily: fonts.Lexend_SemiBold,
  },

  addBtn: {
    backgroundColor: Colors.purpleBtn,
    borderRadius: HWSize.H_Height3,
    paddingVertical: MarginHW.PaddingH5,
    marginBottom: MarginHW.MarginH5,
    alignItems: "center",
    marginTop: "auto",
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
  addressSelector: {
    marginLeft: MarginHW.MarginH3,
  },
});
