import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store/store";
import { addToCart, incrementQty, decrementQty } from "../Redux/Slices/cartSlice";
import API_CONFIG from "../config/apiConfig";
import { normalizeProduct } from "../utils/normalizeProduct";
import { Colors } from '../comman/comman/Colors';
import FontsSize from '../comman/comman/FontsSize';
import HWSize from '../comman/comman/HWSize';
import MarginHW from '../comman/comman/MarginHW';
import fonts from '../comman/comman/fonts';
import ImageSize from '../comman/comman/ImageSize';
import ScreenWrapper from "../comman/comman/ScreenWrapper";
import { calculateMRP } from "../utils/PriceUtils";
type Language = "en" | "hi";

const ProductInfoScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const product = normalizeProduct(route?.params?.product);
  const { lang } = route.params || {};
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const qty = product ? (cartItems[product.id]?.quantity || 0) : 0;

  const safeLang: Language = lang === "hi" ? "hi" : "en";

  /* Localization Data */
  const textData: Record<Language, {
    loadingMsg: any;
    headerTitle: string;
    by: string;
    off: string;
    add: string;
    goToCart: string;
  }> = {
    en: {
      loadingMsg: "Loading product details...",
      headerTitle: "Product Info",
      by: "By",
      off: "OFF",
      add: "ADD",
      goToCart: "Go To Cart",
    },
    hi: {
      loadingMsg: "उत्पाद विवरण लोड हो रहा है...",
      headerTitle: "उत्पाद जानकारी",
      by: "द्वारा",
      off: "छूट",
      add: "जोड़ें",
      goToCart: "कार्ट पर जाएं",
    },
  };


  const { loadingMsg, headerTitle, by, off, add, goToCart } = textData[safeLang];

  if (!product) {
    return (
      <View style={styles.loaderContainer}>
        <Text>{loadingMsg}</Text>
      </View>
    );
  }

  const imgPath = product.product_image?.[0];
  const priceInfo = product.product_info?.[0];

  const handleAdd = () => {
    if (product) {
      dispatch(
        addToCart({
          id: product.id,
          product_name: product.product_name,
          price: Number(priceInfo?.product_price),
          image: imgPath,
          quantity: 1,
          discount: Number(priceInfo?.product_discount || 0),
          attributeId: priceInfo?.attribute_id || "",
        })
      );
    }
  };
  const increaseQty = () => {
    if (product) dispatch(incrementQty(product.id));
  };
  const decreaseQty = () => {
    if (product) dispatch(decrementQty(product.id));
  };

  return (
    <>
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      <ScreenWrapper style={styles.container} useScrollView={false} edges={["top", "left", "right", "bottom",]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require("../assets/images/back.png")}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
          <View style={styles.emptyView} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: imgPath
                  ? `${API_CONFIG.IMG_URL}/${imgPath}`
                  : "",
              }}
              style={styles.image}
            />
          </View>

          <View style={styles.content}>
            <Text style={styles.productName}>
              {product.product_name}
            </Text>

            <Text style={styles.brand}>
              {by} {product.Brand_name}
            </Text>

            <View style={styles.priceRow}>
              <Text style={styles.price}>
                ₹{priceInfo?.product_price}
              </Text>

              {priceInfo?.product_discount &&
                priceInfo.product_discount !== "0" && (
                  <>
                    <Text style={styles.oldPrice}>
                      ₹{calculateMRP(priceInfo.product_price, priceInfo.product_discount)}
                    </Text>

                    {/* <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>
                      {priceInfo.product_discount}% OFF
                    </Text>
                  </View> */}

                    {priceInfo.product_discount > 0 && (
                      <ImageBackground
                        source={require("../assets/images/ic_discount_shape.png")}
                        style={styles.discountBadge}
                        resizeMode="contain"
                      >
                        <Text style={styles.discountText}>{priceInfo.product_discount}% {off}</Text>
                      </ImageBackground>
                    )}
                  </>
                )}
            </View>

            <View style={{ marginTop: MarginHW.MarginH20 }}>
              {qty === 0 ? (
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={handleAdd}
                >
                  <Text style={styles.addText}>{add}</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.qtyRow}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={decreaseQty}
                  >
                    <Text style={styles.qtyText}>−</Text>
                  </TouchableOpacity>

                  <Text style={styles.qtyValue}>{qty}</Text>

                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={increaseQty}
                  >
                    <Text style={styles.qtyText}>+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <Text style={styles.description}>
              {product.short_desc}
            </Text>
          </View>
        </ScrollView>

        {qty > 0 && (
          <TouchableOpacity
            style={styles.cartBtn}
            onPress={() => navigation.navigate("Cart", { lang })}
          >
            <Text style={styles.cartText}>{goToCart}</Text>
          </TouchableOpacity>
        )}
      </ScreenWrapper>
    </>
  );
};

export default ProductInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    // paddingTop removed
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

  emptyView: {
    width: HWSize.W_Width30,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: MarginHW.PaddingW16,
    paddingVertical: MarginHW.PaddingH10,
    width: "100%",
  },
  image: {
    width: '100%',
    height: 350,
    resizeMode: "contain",
  },
  content: {
    padding: MarginHW.PaddingH16,
  },
  productName: {
    fontSize: FontsSize.size20,
    fontFamily: fonts.Lexend_SemiBold,
  },
  brand: {
    color: Colors.greyText,
    marginVertical: MarginHW.MarginH4,
    fontFamily: fonts.Lexend_SemiBold,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: MarginHW.MarginH10,
  },
  price: {
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,
  },
  oldPrice: {
    textDecorationLine: "line-through",
    color: Colors.lightGreyText,
    marginLeft: MarginHW.MarginH10,
    fontFamily: fonts.Lexend_SemiBold,
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
  discountBadge: {
    // backgroundColor: Colors.discountRed,
    paddingHorizontal: MarginHW.PaddingW8,
    paddingVertical: MarginHW.PaddingH3,
    borderRadius: HWSize.H_Height3,
    marginLeft: MarginHW.MarginH10,
  },
  discountText: {
    color: Colors.white,
    fontSize: FontsSize.size12,
    fontFamily: fonts.Lexend_SemiBold,
  },
  addBtn: {
    backgroundColor: Colors.primaryBrand,
    paddingVertical: MarginHW.PaddingH10,
    borderRadius: HWSize.H_Height10,
    alignItems: "center",
  },
  addText: {
    color: Colors.white,
    fontFamily: fonts.Lexend_SemiBold,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyBtn: {
    borderWidth: HWSize.H_Height1,
    borderColor: Colors.lightBorder,
    paddingHorizontal: MarginHW.PaddingW12,
    paddingVertical: MarginHW.PaddingH5,
    borderRadius: HWSize.H_Height10,
  },
  qtyText: {
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,
  },
  qtyValue: {
    marginHorizontal: MarginHW.MarginW12,
    fontSize: FontsSize.size16,
    fontFamily: fonts.Lexend_SemiBold,
  },
  description: {
    marginTop: MarginHW.MarginH20,
    color: Colors.sign,
    lineHeight: FontsSize.size22,
    fontFamily: fonts.Lexend_SemiBold,
  },
  cartBtn: {
    backgroundColor: Colors.primaryBrand,
    padding: MarginHW.PaddingH10,
    alignItems: "center",
  },
  cartText: {
    color: Colors.white,
    fontSize: FontsSize.size16,
    fontFamily: fonts.Lexend_SemiBold,
  },
});
