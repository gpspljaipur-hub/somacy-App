import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_CONFIG from "./config/apiConfig";
import ApiUrl from "./constant/ApiUrlConstant";

const axiosInstance = axios.create({
  baseURL: API_CONFIG?.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

let latestApiTokenCancel: any = null;

//  REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  async (config: any) => {
    const loginString: any = await AsyncStorage.getItem("app_user");
    const loginData = loginString ? JSON.parse(loginString) : null;

    const excludePath: string[] = [ApiUrl?.HomePageUrl?.USER_LOGIN, ApiUrl?.HomePageUrl?.HOME_PAGE_DATA, ApiUrl?.HomePageUrl?.ORDER_CATEGORY_DATA, ApiUrl?.HomePageUrl?.SEARCH_SUGGEST, ApiUrl?.HomePageUrl?.PRODUCT_SEARCH,
    ApiUrl?.HomePageUrl?.PRODUCT_ORDER_HISTORY, ApiUrl?.HomePageUrl?.PRESCRIPTION_HISTORY, ApiUrl?.HomePageUrl?.PRESCRIPTION_ORDER_DETAILS, ApiUrl?.HomePageUrl?.ADDRESS_DETAILS, ApiUrl?.HomePageUrl?.PAYMENT_GATEWAY, ApiUrl?.HomePageUrl?.USER_ADDRESS,
    ApiUrl?.HomePageUrl?.UPDATE_PROFILE, ApiUrl.HomePageUrl.ORDER_NOW, ApiUrl?.HomePageUrl?.DELETE_ACCOUNT
    ];

    const shouldAttachToken = !excludePath.some((url) =>
      config?.url?.includes(url)
    );

    if (loginData?.token && shouldAttachToken) {
      config.headers["Auth-Token"] = `${loginData.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
