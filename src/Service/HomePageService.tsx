import axiosInstance from "../axiosInstance"
import ApiUrl from "../constant/ApiUrlConstant"

export interface ProductItem {
    title: string;
    image: string;
    type: string;
    cost: string;
    qty: string;
    discount: string;
    attribute_id: string;
}

export interface OrderNowPayload {
    uid: string;
    p_method_id: string;
    full_address: string;
    d_charge: number;
    cou_id: number;
    cou_amt: number;
    transaction_id: string;
    product_total: string;
    product_subtotal: string;
    wall_amt: number;
    a_note: string;
    fb_token: string;
    ProductData: ProductItem[];
    pres_id?: string;
}



export const fetchMobileCheck = async (mobile: string): Promise<any | string> => {
    const response = await axiosInstance?.post(ApiUrl?.HomePageUrl?.MOBILE_CHECK, { mobile })
    return response?.data
}

export const FetchLoginUserDetails = async (mobile: string, password: string): Promise<any | string> => {
    const response = await axiosInstance?.post(ApiUrl?.HomePageUrl?.USER_LOGIN, { mobile, password })
    return response?.data
}

export const fetchHomePageData = async (uid: string): Promise<any | string> => {
    const response = await axiosInstance?.post(ApiUrl?.HomePageUrl?.HOME_PAGE_DATA, { uid })
    return response?.data
}

export const fetchCategoryOrder = async (uid: string): Promise<any | string> => {
    const response = await axiosInstance?.post(ApiUrl?.HomePageUrl?.ORDER_CATEGORY_DATA, { uid })
    return response?.data
}

export const fetchSearchSuggest = async (keyword: string): Promise<any | string> => {
    const response = await axiosInstance?.post(ApiUrl?.HomePageUrl?.SEARCH_SUGGEST, { keyword })
    return response?.data
}

export const fetchProductSearch = async (keyword: string): Promise<any | string> => {
    const response = await axiosInstance?.post(ApiUrl?.HomePageUrl?.PRODUCT_SEARCH, { keyword })
    return response?.data
}

export const fetchOrderHistory = async (uid: string, page: any, limit: any): Promise<any | string> => {
    const response = await axiosInstance?.post(ApiUrl?.HomePageUrl?.ORDER_HISTORY, { uid, page, limit })
    return response?.data
}
export const ProductOrderDetails = async (uid: string, order_id: any): Promise<any | string> => {
    const response = await axiosInstance?.post(ApiUrl?.HomePageUrl?.PRODUCT_ORDER_HISTORY, { uid, order_id })
    return response?.data
}

export const fetchPresHistory = async (uid: string, page: any, limit: any): Promise<any | string> => {
    const response = await axiosInstance?.post(ApiUrl?.HomePageUrl?.PRESCRIPTION_HISTORY, { uid, page, limit })
    return response?.data
}

export const PresOrderDetails = async (uid: string, order_id: any): Promise<any | string> => {
    const response = await axiosInstance?.post(ApiUrl?.HomePageUrl?.PRESCRIPTION_ORDER_DETAILS, { uid, order_id })
    return response?.data
}


export const fetchAddressDetails = async (uid: string): Promise<any | string> => {
    const response = await axiosInstance?.post(ApiUrl?.HomePageUrl?.ADDRESS_DETAILS, { uid })
    return response?.data
}
export const fetchUserAddressDetails = async (uid: string, address: string, pincode: string, houseno: string, landmark: string, type: string, lat_map: any, long_map: any, aid: string): Promise<any | string> => {
    const response = await axiosInstance?.post(ApiUrl?.HomePageUrl?.USER_ADDRESS, { uid, address, pincode, houseno, landmark, type, lat_map, long_map, aid })
    return response?.data
}
export const updateUserProfileData = async (uid: string, fname: string, lname: string, mobile: string, email: string, password: string): Promise<any | string> => {
    const response = await axiosInstance?.post(ApiUrl?.HomePageUrl?.UPDATE_PROFILE, { uid, fname, lname, mobile, email, password })
    return response?.data
}

export const registerUser = async (fname: string, lname: string, email: string, mobile: string, ccode: string, refercode: string, password: string): Promise<any | string> => {
    const response = await axiosInstance?.post(ApiUrl?.HomePageUrl?.USER_SIGNUP, { fname, lname, email, mobile, ccode, refercode, password })
    return response?.data
}

export const paymentGatewayImage = async (): Promise<any | string> => {
    const response = await axiosInstance?.post(ApiUrl?.HomePageUrl?.PAYMENT_GATEWAY)
    return response?.data
}

export const fetchCouponList = async (uid: string): Promise<any | string> => {
    const response = await axiosInstance?.post(ApiUrl?.HomePageUrl?.COUPON_LIST, { uid, id: uid })
    return response?.data
}
export const DeleteAddressDetails = async (id: string): Promise<any | string> => {
    const response = await axiosInstance?.post(ApiUrl?.HomePageUrl?.DELETE_ADDRESS, { id })
    return response?.data
}

export const deleteAccount = async (uid: string): Promise<any | string> => {
    const response = await axiosInstance?.post(ApiUrl?.HomePageUrl?.DELETE_ACCOUNT, { uid, id: uid })
    return response?.data
}

export const OrderDetailsConfirm = async (payload: OrderNowPayload): Promise<any> => {
    const response = await axiosInstance.post(
        ApiUrl.HomePageUrl.ORDER_NOW,
        payload
    );
    return response.data;
};

export const resetUserPassword = async (mobile: string, password: string): Promise<any | string> => {
    const response = await axiosInstance?.post(ApiUrl?.HomePageUrl?.RESET_PASSWORD, { mobile, password })
    return response?.data
}

export const cancelPrescription = async (uid: string, order_id: string): Promise<any | string> => {
    const response = await axiosInstance?.post(ApiUrl?.HomePageUrl?.CANCEL_PRESCRIPTION, { uid, order_id })
    return response?.data
}
export const cancelOrder = async (uid: string, order_id: string): Promise<any | string> => {
    const response = await axiosInstance?.post(ApiUrl?.HomePageUrl?.ORDER_CANCEL, { uid, order_id })
    return response?.data
}
export const prescriptionPayment = async (uid: any, oid: any, status: string, d_charge: string, cou_id: string, cou_amt: string, o_total: any, trans_id: string, wall_amt: string, a_note: string, p_method_id: string): Promise<any | string> => {

    const response = await axiosInstance?.post(ApiUrl?.HomePageUrl?.PRESCRIPTION_ORDER, { uid, oid, status, d_charge, cou_id, cou_amt, o_total, trans_id, wall_amt, a_note, p_method_id })
    return response?.data
}

// export const uploadPrescription = async (
//     uid: string,
//     full_address: string,
//     d_charge: string,
//     order_cat: string,
//     tid: string,
//     images: any[]
// ): Promise<any> => {
//     const formData = new FormData();
//     formData.append("uid", uid);
//     formData.append("Full_Address", full_address);
//     formData.append("d_charge", d_charge);
//     formData.append("order_cat", order_cat);
//     formData.append("tid", tid);
//     formData.append("size", String(images.length));

//     images.forEach((image, index) => {
//         formData.append(`image[${index}]`, {
//             uri: image.uri,
//             type: image.type,
//             name: image.fileName,
//         } as any);
//     });



//     const response = await axiosInstance.post(ApiUrl.HomePageUrl.ORDER_PRESCRIPTION, formData, {
//         headers: {
//             "Content-Type": "multipart/form-data",
//         },
//     });
//     console.log("Upload Prescription Response:", JSON.stringify(response?.data));
//     return response.data;
// };

export const uploadPrescription = async (
    uid: string,
    full_address: string,
    d_charge: string,
    order_cat: string,
    tid: string,
    images: any[]
): Promise<any> => {

    const formData = new FormData();

    formData.append("uid", uid);
    formData.append("Full_Address", full_address);
    formData.append("d_charge", d_charge);
    formData.append("order_cat", order_cat);
    formData.append("tid", tid);
    formData.append("size", String(images.length));

    images.forEach((image, index) => {
        formData.append(`image${index}`, {
            uri: image.uri || image.path,
            type: image.type || image.mime || "image/jpeg",
            name: image.fileName || `image_${index}.jpg`,
        } as any);
    });

    const response = await axiosInstance.post(
        ApiUrl.HomePageUrl.ORDER_PRESCRIPTION,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};


