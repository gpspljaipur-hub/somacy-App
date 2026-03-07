import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Linking
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";

import UploadPrescription from "./UploadPrescription";
import { setSearchData } from "../Redux/Slices/searchSlice";
import { fetchProductSearch, fetchSearchSuggest } from "../Service/HomePageService";
import { RootState } from "../Redux/store/store";
import { useNavigation } from "@react-navigation/native";
import { Colors } from '../../src/comman/comman/Colors';
import FontsSize from '../comman/comman/FontsSize';
import HWSize from '../comman/comman/HWSize';
import MarginHW from '../comman/comman/MarginHW';
import fonts from '../comman/comman/fonts';
import ScreenWrapper from '../comman/comman/ScreenWrapper';


const STORAGE_KEY = "RECENT_SEARCHES";

import CartModal from "../modal/CartModel";
import CartWithBadge from "./CartWithBadge";

type Language = "en" | "hi";


const SearchScreen = ({ route }: any) => {
  console.log(route?.params?.lang, "=======377777");

  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const searchList = useSelector(
    (state: RootState) => state.search.searchList
  );
  const [searchText, setSearchText] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const lang = route?.params?.lang
  const textData: Record<Language, {
    searchPlaceholder: string;
    recentSearches: string;
    needHelp: string;
    whatsapp: string;
    callUs: string;

    faqs: string;

    noData: string;

    faqData: any;

  }> = {
    en: {
      searchPlaceholder: "Type to search...",
      recentSearches: "Recent Searches",
      needHelp: "Need Help?",
      whatsapp: "WhatsApp",
      callUs: "Call us",
      faqs: "FAQs",
      noData: "No data found",
      faqData: [
        {
          id: 1,
          question: "How do I place an order for medicines?",
          answer: [
            "Navigate to the Medicine section",
            "Use the search bar to find the medicine you need or upload your prescription.",
            "Add the required items to your cart and proceed to checkout."
          ]
        },
        {
          id: 2,
          question: "Can I order medicines without a prescription?",
          answer: ["Some medicines don not require a prescription. However, for prescription-only medicines, you must upload a valid doctor's prescription."]
        },
        {
          id: 3,
          question: "How do I upload my prescription?",
          answer: ["Go to Upload Prescription option during the ordering process.",
            "Take a clear picture of your prescription or upload an existing image.",
            "Ensure the prescription is valid, legible and includes the doctor's signature."
          ]
        },
        {
          id: 4,
          question: "How do I upload my RGHS prescription?",
          answer: ["Go to the Upload Prescription option during the ordering process and select RGHS.",
            "Enter your TID number.",
            "Take a clear picture of your prescription or upload an existing image.",
            "Ensure the prescription is valid, legible and includes the doctor's signature."
          ]
        },
        {
          id: 5,
          question: "How long does delivery take?",
          answer: ["Delivery times depend on your location and the medicine's availability. Generally orders are delivered in 3-4 working days."]
        },
        {
          id: 6,
          question: "How do I book a lab test?",
          answer: ["Navigate to the Lab Tests section.",
            "Search for the required test/packages or upload your prescription",
            "Add the test to your cart and proceed to checkout",
            "Confirm your booking by completing the payment."
          ]
        },
        {
          id: 7,
          question: "Can I book a test without a doctor's prescription?",
          answer: ["Yes, you can book most tests without a prescription. However, for specific advanced tests, a valid doctor's prescription may be required"]
        },
        {
          id: 8,
          question: "How does home sample collection work?",
          answer: ["Add the test to your cart and proceed to checkout or upload your prescription.",
            "A trained phlebotomist will visit your home tp collect the sample"
          ]
        },
        {
          id: 9,
          question: "Can I cancel or modify my order?",
          answer: ["Cancelling an order: Go to My Orders and cancel the order before it is shipped",
            "Modifying an order: Contact our customer support team as soon as possible for assitance"
          ]
        }
      ]
    },
    hi: {
      searchPlaceholder: "खोजने के लिए टाइप करें...",
      recentSearches: "हाल की खोजें",
      needHelp: "मदद चाहिए?",
      whatsapp: "व्हाट्सएप",
      callUs: "हमें कॉल करें",
      faqs: "सामान्य प्रश्न (FAQs)",
      noData: "कोई डेटा नहीं मिला",
      faqData: [
        {
          id: 1,
          question: "मैं दवाओं का ऑर्डर कैसे दे सकता हूं?",
          answer: [
            "मेडिसिन सेक्शन पर जाएं",
            "दवा खोजने के लिए सर्च बार का उपयोग करें या अपना प्रिस्क्रिप्शन अपलोड करें।",
            "कार्ट में आवश्यक आइटम जोड़ें और चेकआउट के लिए आगे बढ़ें।"
          ]
        },
        {
          id: 2,
          question: "क्या मैं बिना प्रिस्क्रिप्शन के दवा ऑर्डर कर सकता हूँ?",
          answer: ["कुछ दवाओं के लिए प्रिस्क्रिप्शन की आवश्यकता नहीं होती है। हालांकि, केवल प्रिस्क्रिप्शन वाली दवाओं के लिए, आपको डॉक्टर का प्रिस्क्रिप्शन अपलोड करना होगा।"]
        },
        {
          id: 3,
          question: "मैं अपना प्रिस्क्रिप्शन कैसे अपलोड करूं?",
          answer: ["ऑर्डर प्रक्रिया के दौरान प्रिस्क्रिप्शन अपलोड करें विकल्प पर जाएं।",
            "अपने प्रिस्क्रिप्शन की एक साफ तस्वीर लें या मौजूदा तस्वीर अपलोड करें।",
            "सुनिश्चित करें कि प्रिस्क्रिप्शन डॉक्टर के हस्ताक्षर के साथ है।"
          ]
        },
        {
          id: 4,
          question: "मैं अपना RGHS प्रिस्क्रिप्शन कैसे अपलोड करूं?",
          answer: ["ऑर्डर प्रक्रिया के दौरान प्रिस्क्रिप्शन अपलोड करें विकल्प पर जाएं और RGHS चुनें।",
            "अपना TID नंबर दर्ज करें।",
            "अपने प्रिस्क्रिप्शन की एक साफ तस्वीर लें या मौजूदा तस्वीर अपलोड करें।",
            "सुनिश्चित करें कि प्रिस्क्रिप्शन डॉक्टर के हस्ताक्षर के साथ है।"
          ]
        },
        {
          id: 5,
          question: "डिलीवरी में कितना समय लगता है?",
          answer: ["डिलीवरी का समय आपके स्थान और दवा की उपलब्धता पर निर्भर करता है। आमतौर पर ऑर्डर 3-4 कार्य दिवसों में डिलीवर हो जाते हैं।"]
        },
        {
          id: 6,
          question: "मैं लैब टेस्ट कैसे बुक करूं?",
          answer: ["लैब टेस्ट सेक्शन पर जाएं।",
            "आवश्यक टेस्ट/पैकेज खोजें या अपना प्रिस्क्रिप्शन अपलोड करें",
            "टेस्ट को अपनी कार्ट में जोड़ें और चेकआउट के लिए आगे बढ़ें",
            "भुगतान पूरा करके अपनी बुकिंग की पुष्टि करें।"
          ]
        },
        {
          id: 7,
          question: "क्या मैं बिना डॉक्टर के प्रिस्क्रिप्शन के टेस्ट बुक कर सकता हूं?",
          answer: ["हाँ, आप बिना प्रिस्क्रिप्शन के अधिकांश टेस्ट बुक कर सकते हैं। हालांकि, विशिष्ट उन्नत परीक्षणों के लिए, डॉक्टर के प्रिस्क्रिप्शन की आवश्यकता हो सकती है"]
        },
        {
          id: 8,
          question: "होम सैंपल कलेक्शन कैसे काम करता है?",
          answer: ["टेस्ट को अपनी कार्ट में जोड़ें और चेकआउट के लिए आगे बढ़ें या अपना प्रिस्क्रिप्शन अपलोड करें।",
            "एक प्रशिक्षित लैब तकनीशियन सैंपल लेने के लिए आपके घर आएगा"]
        },
        {
          id: 9,
          question: "क्या मैं अपना ऑर्डर रद्द या संशोधित कर सकता हूं?",
          answer: ["ऑर्डर रद्द करना: 'मेरे ऑर्डर' पर जाएं और शिप होने से पहले ऑर्डर रद्द करें",
            "ऑर्डर में संशोधन: सहायता के लिए जितनी जल्दी हो सके हमारी ग्राहक सहायता टीम से संपर्क करें"
          ]
        }
      ]
    }
  };

  const safeLang: Language = lang ?? "en";



  const {
    searchPlaceholder,
    recentSearches: recentTitle,
    needHelp,
    whatsapp,
    callUs,
    faqs,
    noData,
    faqData
  } = textData[safeLang];

  useEffect(() => {
    loadRecentSearches();
    fetchSearchAPIData("");
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSearchAPIData(searchText);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  const loadRecentSearches = async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) setRecentSearches(JSON.parse(data));
  };

  const saveRecentSearches = async (list: string[]) => {
    setRecentSearches(list);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const fetchSearchAPIData = async (txt: string) => {
    try {
      const res = await fetchSearchSuggest(txt || "somacy");
      dispatch(setSearchData(res?.SearchData || []));
    } catch (error) {
      console.log("Search API error", error);
    }
  };

  const filteredData = useMemo(() => {
    if (!searchText.trim()) return [];
    return searchList.filter(item =>
      item.product_name?.toLowerCase()?.includes(searchText?.toLowerCase())
    );
  }, [searchText, searchList]);
  const addToRecent = async (name: string) => {
    const updated = [
      name,
      ...recentSearches.filter(item => item !== name),
    ].slice(0, 10);

    saveRecentSearches(updated);
    setSearchText("");
  };

  const removeChip = (name: string) => {
    const updated = recentSearches.filter(item => item !== name);
    saveRecentSearches(updated);
  };


  const onProductPress = async (item: any) => {
    try {
      addToRecent(item.product_name);

      const res = await fetchProductSearch(item.product_name);
      if (res?.Result === "true" && res?.SearchData?.length > 0) {
        navigation.navigate("ProductInfo", {
          product: res.SearchData[0],
          lang: lang,
        });
      } else {
        console.log("No product found");
      }
    } catch (error) {
      console.log("Product search error", error);
    }
  };

  const toggleFAQ = (id: number) => {
    setExpandedId(prev => (prev === id ? null : id));
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
  return (
    <ScreenWrapper style={styles.container}>
      <StatusBar backgroundColor={Colors.background} barStyle="light-content" />
      <View style={styles.mainContainer}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <Image
              source={require("../assets/images/back.png")}
              style={styles.headerIcon}
            />
          </TouchableOpacity>

          <View style={styles.searchBox}>
            <TextInput
              autoFocus
              value={searchText}
              onChangeText={setSearchText}
              placeholder={searchPlaceholder}
              placeholderTextColor={Colors.sign}
              style={styles.input}
            />
            <Image
              source={require("../assets/images/ic_search.png")}
              style={styles.searchIcon}
            />
          </View>

          <CartWithBadge style={styles.iconBtn} lang={lang} />
        </View>

        <View style={styles.contentContainer}>
          {/* RECENT SEARCHES */}
          {recentSearches.length > 0 && searchText.length === 0 && (
            <View>
              <Text style={styles.sectionTitle}>{recentTitle}</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipContainer}
              >
                {recentSearches.map((item, index) => (
                  <View key={index} style={styles.chip}>
                    <Text style={styles.chipText}>{item}</Text>
                    <TouchableOpacity onPress={() => removeChip(item)}>
                      <Image
                        source={require("../assets/images/ic_close.png")}
                        style={styles.crossIcon}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* SEARCH RESULTS */}
          {searchText.length > 0 ? (
            <View>
              {filteredData.length === 0 ? (
                <Text style={styles.noData}>{noData}</Text>
              ) : (
                filteredData.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.listItem}
                    onPress={() => onProductPress(item)}
                  >
                    <Text style={styles.listText}>{item.product_name}</Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          ) : (
            /* FOOTER CONTENT (Only when not searching) */
            <View>
              <UploadPrescription hideOr={true} transparent={true} lang={lang} />

              <Text style={styles.sectionTitle}>{needHelp}</Text>
              <View style={styles.helpRow}>
                <TouchableOpacity
                  style={[styles.helpCard, { backgroundColor: Colors.featureCardGreenB }]}
                  onPress={openWhatsApp}
                >
                  <Text style={styles.helpText}>{whatsapp}</Text>
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
                  <Text style={styles.helpText}>{callUs}</Text>
                  <Image
                    source={require("../assets/images/callus.png")}
                    style={styles.helpIcon}
                  />
                  <View style={[styles.arrowBtn1]}>
                    <Text style={styles.btnText1}>›</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionTitle}>{faqs}</Text>
              {faqData.map((item: any) => {
                const isExpanded = expandedId === item.id;
                return (
                  <View key={item.id} style={styles.faqContainer}>
                    <TouchableOpacity
                      style={styles.faqHeader}
                      onPress={() => toggleFAQ(item.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.faqText}>{item.id}. {item.question}</Text>
                      <View style={[styles.arrowBtn, isExpanded && styles.arrowRotated]}>
                        <Text style={styles.btnText}>›</Text>
                      </View>
                    </TouchableOpacity>

                    {isExpanded && (
                      <View style={styles.answerContainer}>
                        {item.answer.map((line: any, idx: any) => (
                          <Text key={idx} style={styles.answerText}>
                            {item.answer.length > 1 ? `• ${line}` : line}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </View>
      <CartModal visible={cartModalVisible} onClose={() => setCartModalVisible(false)} lang={lang} />
    </ScreenWrapper>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  contentContainer: {
    paddingHorizontal: MarginHW.PaddingH12,
    paddingBottom: MarginHW.PaddingH20,
    backgroundColor: Colors.black,
  },

  /* HEADER */
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  header: {
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: MarginHW.PaddingH5,
    paddingHorizontal: MarginHW.PaddingH12,


    marginBottom: MarginHW.MarginH10,
  },
  iconBtn: {
    top: 7,
    padding: MarginHW.PaddingH8,
  },
  headerIcon: {
    width: HWSize.W_Width15,
    height: HWSize.W_Width15,

    resizeMode: 'contain',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: HWSize.H_Height10,
    paddingHorizontal: MarginHW.PaddingH12,
    marginHorizontal: MarginHW.MarginH10,
    minHeight: HWSize.H_Height40,
  },
  input: {
    flex: 1,
    fontSize: FontsSize.size14,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black,
    paddingVertical: 0,
  },
  searchIcon: {
    width: HWSize.W_Width18,
    height: HWSize.W_Width18,
    tintColor: Colors.black,
  },

  /* TAGS / RECENT */
  sectionTitle: {
    fontSize: FontsSize.size18,
    fontFamily: fonts.Lexend_SemiBold,
    marginTop: MarginHW.MarginH8,
    marginBottom: MarginHW.MarginH10,
    color: Colors.featureCardBlueB
  },
  chipContainer: {
    flexDirection: "row",
    paddingRight: MarginHW.PaddingH10,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: HWSize.H_Height20,
    paddingHorizontal: MarginHW.PaddingH12,
    paddingVertical: MarginHW.PaddingH5,
    marginRight: MarginHW.MarginH10,
    marginBottom: MarginHW.MarginH8,
  },
  chipText: {
    fontSize: FontsSize.size12,
    marginRight: MarginHW.MarginH5,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.text,
  },
  crossIcon: {
    width: HWSize.W_Width10,
    height: HWSize.W_Width12,

  },

  /* RESULTS */
  listItem: {
    padding: MarginHW.PaddingH14,
    backgroundColor: Colors.white,
    borderRadius: HWSize.H_Height10,
    marginBottom: MarginHW.MarginH5,
  },
  listText: {
    fontSize: FontsSize.size14,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black,
  },
  noData: {
    padding: MarginHW.PaddingH20,
    textAlign: "center",
    color: Colors.surfaceMuted,
    fontSize: FontsSize.size14,
    fontFamily: fonts.Lexend_SemiBold,
  },

  /* FOOTER - HELP & FAQ */
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


  faqContainer: {
    marginBottom: MarginHW.MarginH8,

    borderRadius: HWSize.H_Height10,
    overflow: "hidden",
    backgroundColor: Colors.couponSection,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: MarginHW.PaddingH14,

  },
  faqText: {
    fontSize: FontsSize.size12,
    fontFamily: fonts.Lexend_SemiBold,
    color: Colors.black,
    flex: 1,
    marginRight: MarginHW.MarginW10,
  },
  arrowBtn: {
    width: HWSize.W_Width20,
    height: HWSize.W_Width20,
    borderRadius: HWSize.W_Width12,
    borderWidth: 1,
    borderColor: Colors.background,

    alignItems: "center",
    justifyContent: "center",
  },
  arrowRotated: {
    transform: [{ rotate: "90deg" }],

  },

  btnText: {
    fontSize: FontsSize.size14,
    color: Colors.background,
    fontFamily: fonts.Lexend_SemiBold,

    textAlign: 'center',
    marginTop: -3,
  },

  answerContainer: {
    backgroundColor: Colors.couponSection,
    paddingHorizontal: MarginHW.PaddingH14,
    paddingBottom: MarginHW.PaddingH12,
    borderTopWidth: 0.5,
    borderTopColor: Colors.black,
  },
  answerText: {
    fontSize: FontsSize.size12,
    fontFamily: fonts.Lexend_Regular,
    color: Colors.black,
    marginTop: MarginHW.MarginH5,
    lineHeight: FontsSize.size18,

  },
});



