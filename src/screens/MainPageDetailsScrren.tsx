import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Dimensions,
  Linking,
  ActivityIndicator,
} from "react-native";
import SearchBar from "../components/SearchBar";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store/store";
import { fetchCategoryOrder, fetchHomePageData, fetchPresHistory } from "../Service/HomePageService";
import { setHomeData, setHomeLoading, setPrescriptionHistory } from "../Redux/Slices/homePageSlice";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import API_CONFIG from "../config/apiConfig";
import { setCategoryData, setCategoryLoading } from "../Redux/Slices/categorySlice";
import UploadPrescription from "../components/UploadPrescription";
import HWSize from "../comman/comman/HWSize";
import MarginHW from "../comman/comman/MarginHW";
import FontsSize from "../comman/comman/FontsSize";
import fonts from "../comman/comman/fonts";
import { Colors } from "../comman/comman/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { calculateMRP } from "../utils/PriceUtils";
import { getMessaging, getToken, requestPermission, AuthorizationStatus } from '@react-native-firebase/messaging';

const ITEMS_PER_SLIDE = 3;
const BANNER_GAP = MarginHW.MarginW12;
const SLIDE_WIDTH = wp('98%');
const BANNER_ITEM_WIDTH = SLIDE_WIDTH - BANNER_GAP; const CATEGORY_COLORS = [
  '#90f8ff8a',
  '#f3ea6aa1',
  '#c5f37aa8',
  '#ecee6ec5',
  '#92c9f09a',
  '#f8ce7f94',
];

type ProductInfo = {
  attribute_id: string;
  product_price: string;
  product_discount: string;
  product_type: string;
  Product_Out_Stock: string;
};

type Product = {
  id: string;
  product_name: string;
  product_image: string[];
  Brand_name: string;
  short_desc: string;
  product_info: ProductInfo[];
};

type PrescriptionOrder = {
  id: string;
  status: string;
  setcart: string;
  cus_status: string;
  order_date: string;
  total: string;
};

const groupData = (data: Product[]) => {
  const grouped: Product[][] = [];
  for (let i = 0; i < data.length; i += ITEMS_PER_SLIDE) {
    grouped.push(data.slice(i, i + ITEMS_PER_SLIDE));
  }
  return grouped;
};

import CartModal from "../modal/CartModel";
import Welcommodel from "../modal/welcommodel";
import HeaderAddressSelector from "../components/HeaderAddressSelector";
import { SafeAreaView } from "react-native-safe-area-context";
import { setVerificationId } from "../Redux/Slices/authSlice";
import CartWithBadge from "../components/CartWithBadge";

const MainPageDetailsScrren = () => {

  const bannerRef = useRef<FlatList>(null);
  const [bannerIndex, setBannerIndex] = useState(0);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const bannerData = useSelector((state: RootState) => state.home.banner);
  const HomeProductData = useSelector((state: RootState) => state.home.homeSections);
  const { categories } = useSelector((state: RootState) => state.category);
  const [orderData, setOrderData] = useState<PrescriptionOrder[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [welcomeChecked, setWelcomeChecked] = useState(false);
  const navigation = useNavigation<any>();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [loading, setLoading] = useState(false);
  const medicines = useSelector((state: RootState) => state.home.medicines);
  type HomeSection = {
    title: string;
    title_hindi: string;
    cat_id: string;
    Medicine: Product[];
  };
  const mergedSections: HomeSection[] = React.useMemo(() => {
    const arr: HomeSection[] = [];
    if (medicines?.length) {
      arr.push({
        title: "All Products",
        title_hindi: "दवाइयाँ/लैबटेस्ट",
        cat_id: "all_products",
        Medicine: medicines,
      });
    }

    if (HomeProductData?.length) {
      const labTestSection = HomeProductData.find((item) => item.title.toLowerCase().includes("lab"));
      if (labTestSection) {
        arr?.push(labTestSection);
      }

      const generalProductSection = HomeProductData?.find((item) => item.title?.toLowerCase().includes("general"));
      if (generalProductSection) {
        arr.push(generalProductSection);
      }

      HomeProductData.forEach((item) => {
        if (
          item !== labTestSection &&
          item !== generalProductSection
        ) {
          arr.push(item);
        }
      });
    }

    return arr;
  }, [HomeProductData, medicines]);

  useEffect(() => {
    const loadLang = async () => {
      const savedLang = await AsyncStorage.getItem("app_lang");
      if (savedLang === "hi" || savedLang === "en") {
        setLang(savedLang);
      }
    };

    loadLang();
  }, []);


  const ProductCard = ({ product }: { product: Product }) => {
    const navigation = useNavigation<any>();
    const imgPath = product.product_image?.[0];
    const priceInfo = product.product_info?.[0];

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate("ProductInfo", {
            product: product,
            lang: lang
          })
        }
      >
        <View style={styles.card}>
          {priceInfo?.product_discount !== "0" && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{priceInfo?.product_discount}% OFF</Text>
            </View>
          )}
          <Image
            source={{
              uri: imgPath
                ? `${API_CONFIG?.IMG_URL}/${imgPath}`
                : "",
            }}
            style={styles.image}
          />
          {/* </Animated.View> */}
          <View style={{}}>
            <Text style={styles.name} numberOfLines={2}>
              {product.product_name}
            </Text>

            <View style={styles.priceRow}>
              <Text style={styles.price}>₹{priceInfo?.product_price}</Text>
              {priceInfo?.product_discount && priceInfo.product_discount !== "0" && (
                <Text style={styles.mrp}>
                  ₹{calculateMRP(priceInfo.product_price, priceInfo.product_discount)}
                </Text>
              )}
            </View>
          </View>
        </View>

      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (!bannerData || bannerData.length === 0) return;

    const sliderInterval = setInterval(() => {
      setBannerIndex((prevIndex) => {
        const nextIndex =
          prevIndex + 1 < bannerData.length ? prevIndex + 1 : 0;

        bannerRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });

        return nextIndex;
      });
    }, 2500);

    return () => clearInterval(sliderInterval);
  }, [bannerData]);

  const isSameData = (a: any, b: any) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };
  useEffect(() => {
    const checkWelcome = async () => {
      const hasSeen = await AsyncStorage.getItem("hasSeenWelcome");
      if (!hasSeen) {
        setWelcomeVisible(true);
      }
      setWelcomeChecked(true);
    };
    checkWelcome();
  }, []);

  const handleAcceptWelcome = async () => {
    setWelcomeVisible(false);
    await AsyncStorage.setItem("hasSeenWelcome", "true");
    setWelcomeChecked(true);
  };

  useEffect(() => {
    if (!user || !welcomeChecked || welcomeVisible) return;
    const loadData = async () => {
      setLoading(true);
      try {
        if (!HomeProductData?.length) {
          // dispatch(setHomeLoading(true));
          setLoading(true);

        }
        const [homeRes, categoryRes] = await Promise.all([
          fetchHomePageData(user.id),
          fetchCategoryOrder(user.id),
        ]);
        if (
          homeRes?.ResultData &&
          !isSameData(homeRes.ResultData, HomeProductData)
        ) {
          dispatch(setHomeData(homeRes.ResultData));
        }
        if (
          categoryRes?.Result === "true" &&
          categoryRes.CategoryProduct &&
          !isSameData(categoryRes.CategoryProduct, categories)
        ) {
          dispatch(setCategoryData(categoryRes.CategoryProduct));
        }
      } catch (error) {
        console.log("Home/Category API error:", error);
      } finally {
        // dispatch(setHomeLoading(false));
        setLoading(false);
        dispatch(setCategoryLoading(false));
      }
    };

    loadData();
  }, [user, welcomeChecked, welcomeVisible]);

  const getPrescription = async () => {
    try {
      if (!user) return;
      const res = await fetchPresHistory(user.id);
      setOrderData(res?.PrescriptionHistory || []);
      dispatch(setPrescriptionHistory(res?.PrescriptionHistory || []));
    } catch (error) {
      console.log("Order history error", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getPrescription();
    }, [user])
  );
  useEffect(() => {
    const checkPendingOrder = async () => {
      if (!user?.id) return;
      if (!orderData?.length) return;
      const appLaunched = await AsyncStorage.getItem('APP_LAUNCHED');
      if (appLaunched !== 'true') return;
      const modalShown = await AsyncStorage.getItem('APP_CONFIRM_MODAL_SHOWN');
      if (modalShown === 'true') return;
      const pendingOrder = orderData.find(o =>
        o?.status === 'Pending' &&
        String(o?.setcart) === '1' &&
        String(o?.cus_status) !== '1'
      );

      if (!pendingOrder) return;
      setOrderId(pendingOrder.id);
      setShowConfirmModal(true);

      await AsyncStorage.setItem('APP_CONFIRM_MODAL_SHOWN', 'true');
      await AsyncStorage.removeItem('APP_LAUNCHED');
    };

    checkPendingOrder();
  }, [orderData, user?.id]);

  const requestUserPermission = async () => {
    const messaging = getMessaging();
    const authStatus = await requestPermission(messaging);
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    return enabled;
  }
  const getFCMToken = async (): Promise<string | null> => {
    try {
      const enabled = await requestUserPermission();
      if (!enabled) return null;
      const messaging = getMessaging();
      const token = await getToken(messaging);
      return token;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    getFCMToken().then(token => {
      if (token) {
        dispatch(setVerificationId(token));
      }
    });
  }, []);
  const renderCarouselItem = ({ item }: { item: Product[] }) => {
    return (
      <View style={styles.slide}>
        {item.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </View>
    );
  };

  const openWhatsApp = () => {
    try {
      const text = "";
      const toNumber = "919887432999";
      const url = `http://api.whatsapp.com/send?phone=${toNumber}&text=${text}`;
      Linking.openURL(url).catch((err) => console.error("Error opening WhatsApp:", err));
    } catch (error) {
      console.error("Error in openWhatsApp:", error);
    }
  };

  const openCall = () => {
    try {
      const phoneNumber = "9887432999";
      const url = `tel:${phoneNumber}`;
      Linking.openURL(url).catch((err) => console.error("Error opening dialer:", err));
    } catch (error) {
      console.error("Error in openCall:", error);
    }
  };

  const handleBannerPress = (index: number) => {
    switch (index) {
      case 0:
        navigation.navigate("Medicine", {
          screen: "MedicineHome",
          lang: lang
        });
        break;
      case 1:

        navigation.navigate("CameraPermission", { lang });
        break;
      case 2:
        navigation.navigate("LabTest", {
          screen: "LabTestScreen",
          lang: lang
        });
        break;
      default:
        console.log("Banner pressed:", index);
        break;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundLight }} edges={["top", "left", "right"]}>
      <Welcommodel visible={welcomeVisible} onClose={handleAcceptWelcome} />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: MarginHW.MarginH20 }}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <View style={styles.logoRow}>
              <Image
                source={require("../assets/images/logo.png")}
                style={styles.brandLogo}
              />
              <Text style={styles.brandName}>Somacy</Text>
            </View>

            <HeaderAddressSelector lang={lang} />
          </View>

          <CartWithBadge style={styles.cartIcon} lang={lang} />
        </View>
        {/* Search bar */}
        <SearchBar lang={lang} />

        {/* upload prescription */}
        <UploadPrescription lang={lang} />

        {/* Banner card */}
        <View style={{ marginTop: MarginHW.MarginH10 }}>
          <FlatList
            ref={bannerRef}
            data={bannerData}
            keyExtractor={(item: any) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            pagingEnabled
            snapToInterval={SLIDE_WIDTH}
            contentContainerStyle={{ paddingHorizontal: BANNER_GAP / 2 }}
            ItemSeparatorComponent={() => (
              <View style={{ width: BANNER_GAP }} />
            )}
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

                  <Text style={{ fontFamily: fonts.Lexend_SemiBold }}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* THREE FEATURE CARDS SECTION */}
        <View style={styles.featureRow}>
          <TouchableOpacity style={styles.featureCardBlue}
            onPress={() =>
              navigation.navigate("Medicine", {
                screen: "MedicineHome",
              })}
          >
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.featureTitle,

                ]}
              >
                {lang === "hi" ? "दवाइयां\nऑर्डर करें" : "Order Medicines"}
              </Text>
              <Text style={[styles.featureSub, { color: Colors.red }]}>{lang === "hi" ? "20% तक की छूट" : "Upto 20% OFF"}</Text>
            </View>

            <View style={styles.imageWrapper}>
              <Image
                source={require("../assets/images/img_order_medicine.png")}
                style={styles.featureImg}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureCardGreen}
            onPress={() => navigation?.navigate("CameraPermission", { lang })}

          >
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.featureTitle,

                ]}
              >
                {lang === "hi" ? "RGHS\nदवाइयां" : "RGHS Medicine"}
              </Text>
              <Text style={styles.featureSub}>{lang === "hi" ? "(प्रिस्क्रिप्शन अपलोड करें)" : "(Upload Prescription)"}</Text>
            </View>

            <View style={styles.imageWrapper}>
              <Image
                source={require("../assets/images/rghs_category.png")}
                style={[styles.featureImg, { bottom: 10 }]}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureCardPurple}
            onPress={() =>
              navigation.navigate("LabTest", {
                screen: "LabTestScreen",
              })}
          >
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.featureTitle,

                ]}
              >
                {lang === "hi" ? "लैब टेस्ट\nबुक करें" : "Book Lab Test"}
              </Text>
              <Text style={[styles.featureSub, { color: Colors.red }]}>{lang === "hi" ? "20% तक की छूट" : "Upto 20% OFF"}</Text>
            </View>

            <View style={styles.imageWrapper}>
              <Image
                source={require("../assets/images/labtest_category.png")}
                style={styles.featureImg}
              />
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionTitle1}>{lang == "hi" ? "अपने वर्ग का चुनाव करें" : "Order by Category"}</Text>
        <View style={styles.categoryContainer}>
          {categories.map((item: any, index: number) => (
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
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.categoryBox,
                  {
                    backgroundColor:
                      CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                  },
                ]}
              >
                <Image
                  source={{ uri: `${API_CONFIG?.IMG_URL}/${item.category_img}` }}
                  style={styles.categoryIcon}
                />
              </View>
              <Text style={styles.categoryText}>
                {lang === "hi"
                  ? item.catnameHindi || item.category_name
                  : item.category_name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.sectionTitle1}>{lang == "hi" ? "मदद चाहिए?" : "Need Help?"}</Text>
        <View style={styles.helpRow}>
          <TouchableOpacity
            style={[styles.helpCard, { backgroundColor: Colors.featureCardGreenB }]}
            onPress={openWhatsApp}
          >
            <Text style={styles.helpText}>{lang === "hi" ? "व्हाट्सएप" : "WhatsApp"}</Text>
            <Image
              source={require("../assets/images/whatsapp_icon.png")}
              style={styles.helpIcon}
            />
            <View style={[styles.arrowBtn1]}>
              <Text style={styles.btnText1}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.helpCard, { backgroundColor: Colors.featureCardBlueB }]}
            onPress={openCall}
          >
            <Text style={styles.helpText}>{lang === "hi" ? "हमें कॉल करें" : "Call us"}</Text>
            <Image
              source={require("../assets/images/callus.png")}
              style={styles.helpIcon}
            />
            <View style={[styles.arrowBtn1]}>
              <Text style={styles.btnText1}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* product list data  */}

        {/* {mergedSections.map((section: HomeSection, index: number) => {
          if (!section.Medicine?.length) return null;

          const groupedData = groupData(section.Medicine);

          return (
            <View key={section.cat_id || index} style={styles?.TextGap}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5, }}>
                <Text style={styles.sectionTitle2}>
                  {lang === "hi" ? section.title_hindi : section.title}
                </Text>

                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={() =>
                    navigation.navigate("AllProducts", {
                      categoryId: section.cat_id === "all_products" ? null : section.cat_id,
                      title: lang === "hi" ? section.title_hindi : section.title,
                      data: section.Medicine, 
                      lang: lang,
                    })
                  }
                >
                  <Text style={styles.viewAllText}>{lang === "hi" ? "सम्पूर्ण सूची" : "View All"}</Text>

                </TouchableOpacity>

              </View>

              <FlatList
                data={groupedData}
                keyExtractor={(_, idx) => `${section.cat_id}-${idx}`}
                renderItem={renderCarouselItem}
                horizontal
                pagingEnabled
                snapToInterval={SLIDE_WIDTH}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{}}
              />
            </View>
          );
        })} */}

        {loading ? (
          <View style={{ paddingVertical: 30 }}>
            <ActivityIndicator size="large" color={Colors.purpleBtn} />
          </View>
        ) : (
          mergedSections.map((section: HomeSection, index: number) => {
            if (!section.Medicine?.length) return null;

            const groupedData = groupData(section.Medicine);

            return (
              <View key={section.cat_id || index} style={styles?.TextGap}>
                {/* SECTION TITLE */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginVertical: 5,
                  }}
                >
                  <Text style={styles.sectionTitle2}>
                    {lang === "hi" ? section.title_hindi : section.title}
                  </Text>

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("AllProducts", {
                        categoryId:
                          section.cat_id === "all_products" ? null : section.cat_id,
                        title:
                          lang === "hi" ? section.title_hindi : section.title,
                        data: section.Medicine,
                        lang,
                      })
                    }
                  >
                    <Text style={styles.viewAllText}>
                      {lang === "hi" ? "सम्पूर्ण सूची" : "View All"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* PRODUCTS SLIDER */}
                <FlatList
                  data={groupedData}
                  keyExtractor={(_, idx) => `${section.cat_id}-${idx}`}
                  renderItem={renderCarouselItem}
                  horizontal
                  pagingEnabled
                  snapToInterval={SLIDE_WIDTH}
                  decelerationRate="fast"
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            );
          })
        )}
      </ScrollView >
      {/* order confirm modal */}
      < Modal
        visible={showConfirmModal && !welcomeVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {lang === "hi" ? "अपना आर्डर कन्फर्म करें!" : "Confirm Your Order!"}

            </Text>

            <Text style={styles.modalDesc}>
              <Text style={styles.modalDescText}>{lang === "hi" ? " आपका आर्डर तैयार है!" : " Your order is ready!"}</Text>
              <Text style={styles.modalDescText1}>{lang === "hi" ? " कृपया आर्डर देने से पहले रिव्यु और कन्फर्म करने के लिए अपना कार्ट खोलें।" : " Please open your cart to review and confirm your order before placing it."}</Text>
            </Text>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                // onPress={handleCancelOrder}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.cancelText}>{lang === "hi" ? "रद्द करें" : "Cancel"}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                // onPress={() => navigation.navigate("MyPrescription")}
                onPress={async () => {
                  if (!orderId) return;

                  await AsyncStorage.setItem(
                    `CONFIRMED_ORDER_${orderId}`,
                    'true'
                  );

                  setShowConfirmModal(false);

                  navigation.navigate('MyPrescription', { lang: lang });
                }}

              >
                <Text style={styles.confirmText}>{lang === "hi" ? "कन्फर्म करें" : "Confirm"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal >

      <CartModal visible={cartModalVisible} onClose={() => setCartModalVisible(false)} lang={lang} />
    </SafeAreaView >

  );
};

export default MainPageDetailsScrren;


const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingHorizontal: MarginHW.PaddingH16,

    backgroundColor: Colors.transparent,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginVertical: MarginHW.MarginH8,
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
  // brandLogo: {
  //   width: HWSize.W_Width15,
  //   height: HWSize.H_Height15,
  //   resizeMode: "contain",
  //   marginRight: MarginHW.MarginH3,
  //   marginTop: MarginHW.MarginH5,
  // },

  // brandName: {
  //   fontSize: FontsSize.size20,
  //   fontFamily: fonts.Lexend_SemiBold,
  //   color: Colors.black,
  //   marginTop: MarginHW.MarginH5,
  // },

  addressRow: {
    flexDirection: "row",
    alignItems: "center",

  },

  locationIcon: {
    width: HWSize.W_Width20,
    height: HWSize.H_Height20,
    // marginLeft: MarginHW.MarginH3,
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
  },

  prescriptionCard: {
    marginTop: MarginHW.MarginH14,
    backgroundColor: Colors.background,
    borderRadius: HWSize.H_Height12,
    padding: MarginHW.PaddingH14,
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
    marginBottom: MarginHW.MarginH5,
  },
  subText: {
    color: Colors.white,
    fontFamily: fonts.Lexend_SemiBold,
    fontSize: FontsSize.size14,
    marginBottom: MarginHW.MarginH10,
  },
  button: {
    backgroundColor: Colors.white,
    paddingVertical: MarginHW.PaddingH8,
    paddingHorizontal: MarginHW.PaddingH12,
    borderRadius: HWSize.H_Height20,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: MarginHW.MarginW8,
  },
  buttonText: {
    color: Colors.background,
    fontSize: FontsSize.size14,
    fontFamily: fonts.Lexend_SemiBold,
  },
  arrowContainer: {
    backgroundColor: Colors.background,
    borderRadius: 100,
    width: HWSize.W_Width15,
    height: HWSize.W_Width15,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowText: {
    color: Colors.white,
    fontSize: FontsSize.size10,
    fontFamily: fonts.Lexend_SemiBold,
  },
  prescriptionImgContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  prescriptionImg: {
    width: HWSize.W_Width80,
    height: HWSize.H_Height80,
    resizeMode: "contain",
  },
  helpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: MarginHW.MarginH5,
  },
  helpCard: {
    width: "48%",
    borderRadius: HWSize.H_Height10,
    padding: MarginHW.PaddingH16,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'center',
    gap: MarginHW.MarginW10,
  },
  arrowBtn1: {
    position: 'absolute',
    bottom: 5,
    right: 10,
    borderWidth: 1,
    borderColor: Colors.white,
    borderRadius: HWSize.W_Width10,
    width: HWSize.W_Width10,
    height: HWSize.W_Width10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText1: {
    color: Colors.white,
    fontSize: FontsSize.size14,
    marginTop: -7,
    fontFamily: fonts.Lexend_SemiBold,
  },
  helpText: {
    color: Colors.white,
    fontSize: FontsSize.size16,
    fontFamily: fonts.Lexend_SemiBold,
  },
  helpIcon: {
    width: HWSize.W_Width20,
    height: HWSize.W_Width20,
    resizeMode: 'contain',

  },

  work: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: MarginHW.MarginH10,
    borderTopWidth: HWSize.H_Height1,
    borderTopColor: Colors.couponSection,
    paddingTop: MarginHW.PaddingH8,
    width: "100%",
  },
  linkText: {
    color: Colors.white,
    fontFamily: fonts.Lexend_SemiBold,
    fontSize: FontsSize.size14,
  },
  arrow: {
    color: Colors.white,
    fontSize: FontsSize.size14,
    fontFamily: fonts.Lexend_SemiBold,
  },

  card: {
    width: (SLIDE_WIDTH - MarginHW.MarginW12 * 2) / 3,
    backgroundColor: Colors.white,
    borderRadius: HWSize.H_Height10,
    paddingVertical: MarginHW.PaddingH8,
    paddingHorizontal: MarginHW.PaddingH8,
    height: HWSize.H_Height160,
    marginRight: MarginHW.MarginW8,


  },

  imageContainer: {
    width: HWSize.W_Width90,
    height: HWSize.H_Height90,
    elevation: 6,

    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    justifyContent: "center",
    alignItems: "center",
    marginBottom: MarginHW.MarginH5,
    marginTop: MarginHW.MarginH20,
  },

  image: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
  },

  discountBadge: {
    position: 'absolute',
    top: MarginHW.MarginH8,
    left: MarginHW.MarginW8,
    backgroundColor: Colors.softRed,
    paddingHorizontal: MarginHW.MarginW5,
    paddingVertical: MarginHW.PaddingW2,
    borderRadius: 1,
    zIndex: 10,
  },

  discountText: {
    color: Colors.white,
    fontSize: FontsSize.size10,
    fontFamily: fonts.Lexend_SemiBold,
    // fontWeight: 'bold',
  },

  name: {
    fontSize: FontsSize.size14,
    fontFamily: fonts.Lexend_SemiBold,
    textAlign: "left",
    marginBottom: MarginHW.MarginH5,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 5,
  },
  price: {
    fontSize: FontsSize.size14,
    fontFamily: fonts.Lexend_SemiBold,
    // fontWeight: 'bold',
    color: Colors.sign,
  },

  headerleft: {
    flexDirection: "row",
  },

  btn: {
    backgroundColor: Colors.black,
    padding: MarginHW.PaddingH10,
    borderRadius: HWSize.H_Height10,
    marginTop: MarginHW.MarginH10,
    width: HWSize.W_Width90,
  },
  sectionTitle1: {
    marginVertical: MarginHW.MarginH8,
    fontSize: FontsSize.size16,
    fontFamily: fonts.Lexend_SemiBold,
  },
  sectionTitle2: {
    marginBottom: MarginHW.MarginH8,
    fontSize: FontsSize.size16,
    fontFamily: fonts.Lexend_SemiBold,
  },

  // sectionTitle: {
  //   // marginVertical: MarginHW.MarginH8,
  //   fontSize: FontsSize.size16,
  //   fontFamily: fonts.Lexend_SemiBold,
  //   marginTop: MarginHW.MarginH10,
  // },

  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  featureCardBlue: {
    width: Dimensions.get('window').width / 3 - 15,
    height: HWSize.H_Height130,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.featureCardBlueB,
    backgroundColor: Colors.featureCardBlue,
    paddingHorizontal: MarginHW.PaddingH10,
    marginRight: MarginHW.MarginW5,
    paddingTop: MarginHW.MarginH10,
    justifyContent: "space-between",
  },
  featureCardGreen: {
    width: Dimensions.get('window').width / 3 - 15,

    height: HWSize.H_Height130,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.featureCardGreenB,
    marginRight: MarginHW.MarginW5,

    backgroundColor: Colors.featureCardGreen,
    paddingHorizontal: MarginHW.PaddingH10,
    paddingTop: MarginHW.MarginH10,
    justifyContent: "space-between",
  },

  // PURPLE CARD
  featureCardPurple: {
    width: Dimensions.get('window').width / 3 - 15,

    height: HWSize.H_Height130,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.featureCardPurpleB,
    backgroundColor: Colors.featureCardPurple,
    paddingHorizontal: MarginHW.PaddingH10,
    marginRight: MarginHW.MarginW5,

    paddingTop: MarginHW.MarginH10,
    justifyContent: "space-between",
  },
  textContainer: {
    width: HWSize.W_Width100,
    marginRight: 8
  },
  imageWrapper: {
    width: HWSize.W_Width100,
    alignItems: "flex-end",
    paddingRight: MarginHW.PaddingH3,
    paddingBottom: MarginHW.PaddingH20,
  },

  // featureCard: {
  //   width: '32%',
  //   backgroundColor: '#fff',
  //   borderRadius: 16,
  //   paddingVertical: 15,
  //   alignItems: 'center',
  //   borderWidth: 1.5,
  // },

  featureImg: {
    width: HWSize.W_Width60,
    height: HWSize.H_Height60,
    resizeMode: "contain",

  },

  featureTitle: {
    fontSize: FontsSize.size14,
    fontFamily: fonts.Lexend_SemiBold,
    textAlign: "left",

  },
  featureSub: {
    fontSize: FontsSize.size12,

    textAlign: "left",
    marginTop: MarginHW.MarginH3,
    fontFamily: fonts.Lexend_SemiBold,
  },
  bannerItem: {
    width: BANNER_ITEM_WIDTH,
    alignItems: "center",
  },

  bannerCarousel: {
    width: HWSize.W_Width375,
    height: HWSize.H_Height120,
    borderRadius: HWSize.H_Height10,
  },



  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: MarginHW.MarginH2,
    justifyContent: "space-between",
  },
  categoryItem: {
    width: HWSize.W_Width110,
    marginBottom: MarginHW.MarginH10,
    alignItems: "center",
  },
  categoryBox: {
    width: "100%",
    // backgroundColor: '#fff',
    borderRadius: HWSize.H_Height12,
    paddingVertical: MarginHW.PaddingH12,
    alignItems: "center",
  },
  categoryIcon: {
    width: HWSize.W_Width40,
    height: HWSize.H_Height40,
  },
  categoryText: {
    fontSize: FontsSize.size14,
    fontFamily: fonts.Lexend_SemiBold,
    // fontWeight: "bold",
    marginTop: MarginHW.MarginH5,
    textAlign: "center",
  },

  slide: {
    flexDirection: "row",
    marginTop: MarginHW.MarginH5,

  },

  productCard: {
    width: (SLIDE_WIDTH - MarginHW.MarginW12 * 2) / 3,
    backgroundColor: Colors.text,
    // paddingVertical: MarginHW.PaddingH10,
    borderRadius: HWSize.H_Height12,
    height: HWSize.H_Height220,
    alignItems: "center",
  },
  productImg: {
    width: HWSize.W_Width60,
    height: HWSize.H_Height60,
    marginBottom: MarginHW.MarginH10,
    resizeMode: "contain",
  },
  productName: {
    fontSize: FontsSize.size16,
    fontFamily: fonts.Lexend_SemiBold,
  },
  mrp: {
    color: Colors.sign,
    fontSize: FontsSize.size10,
    textDecorationLine: "line-through",
    fontFamily: fonts.Lexend_SemiBold,
  },


  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "70%",
    backgroundColor: Colors.white,
    borderRadius: HWSize.H_Height10,
    padding: MarginHW.PaddingH10,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: FontsSize.size18,
    fontWeight: "bold",
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.secondary_button,
    marginBottom: MarginHW.MarginH10,
  },

  modalDesc: {
    fontSize: FontsSize.size16,
    color: Colors.darkText,
    textAlign: "center",
    marginBottom: MarginHW.MarginH20,
    fontFamily: fonts.Lexend_SemiBold,
  },

  modalDescText: {
    fontSize: FontsSize.size16,
    color: Colors.black,
    // fontWeight: "bold",
    textAlign: "center",
    marginBottom: MarginHW.MarginH20,
    fontFamily: fonts.Lexend_SemiBold,

  },
  modalDescText1: {
    fontSize: FontsSize.size12,
    color: Colors.black,

    textAlign: "center",
    marginBottom: MarginHW.MarginH20,
    fontFamily: fonts.Lexend_SemiBold,

  },
  modalBtnRow: {
    flexDirection: "row",
    gap: MarginHW.MarginW12,
  },

  cancelBtn: {
    backgroundColor: Colors.greyText,
    paddingVertical: MarginHW.PaddingH10,
    paddingHorizontal: MarginHW.PaddingW20,
    borderRadius: HWSize.H_Height10,
    flex: 1,
    alignItems: 'center',
  },

  confirmBtn: {
    backgroundColor: Colors.purpleBtn,
    paddingVertical: MarginHW.PaddingH10,
    paddingHorizontal: MarginHW.PaddingW20,
    borderRadius: HWSize.H_Height10,
    flex: 1,
    alignItems: 'center',
  },

  cancelText: {
    color: Colors.white,
    fontFamily: fonts.Lexend_SemiBold,
    fontSize: FontsSize.size14,
  },

  confirmText: {
    color: Colors.white,
    fontFamily: fonts.Lexend_SemiBold,
    fontSize: FontsSize.size14,
  },

  TextGap: {
    marginTop: MarginHW.MarginH10,
  },
  viewAllText: {
    fontSize: FontsSize.size12,
    color: Colors.purpleBtn,
    fontFamily: fonts.Lexend_SemiBold,
    marginBottom: MarginHW.MarginH8,
  },
});
