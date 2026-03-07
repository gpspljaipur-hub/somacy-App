import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { Colors } from '../comman/comman/Colors';
import FontsSize from '../comman/comman/FontsSize';
import HWSize from '../comman/comman/HWSize';
import MarginHW from '../comman/comman/MarginHW';
import fonts from '../comman/comman/fonts';
import ScreenWrapper from '../comman/comman/ScreenWrapper';
import ImageSize from '../comman/comman/ImageSize';
import { updateUserProfileData } from '../Service/HomePageService';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Redux/store/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from '../Redux/Slices/authSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

const EditProfile = ({ navigation, route }: Props) => {
    const { lang } = route.params;

    const user = useSelector((state: RootState) => state.auth.user);
    const [firstName, setFirstName] = useState(user?.fname || '');
    const [lastName, setLastName] = useState(user?.lname || '');
    const [mobile, setMobile] = useState(user?.mobile || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    type Language = "en" | "hi";
    const textData: Record<Language, {
        headerTitle: string;
        fName: string;
        lName: string;
        mobilePlaceholder: string;
        emailPlaceholder: string;
        passwordPlaceholder: string;
        continueBtn: string;
    }> = {
        en: {
            headerTitle: "Edit Profile",
            fName: "First Name",
            lName: "Last Name",
            mobilePlaceholder: "Mobile No.",
            emailPlaceholder: "Email (Optional)",
            passwordPlaceholder: "Password",
            continueBtn: "Continue",
        },
        hi: {
            headerTitle: "प्रोफ़ाइल संपादित करें",
            fName: "पहला नाम",
            lName: "अंतिम नाम",
            mobilePlaceholder: "मोबाइल नंबर",
            emailPlaceholder: "ईमेल (वैकल्पिक)",
            passwordPlaceholder: "पासवर्ड",
            continueBtn: "जारी रखें",
        },
    };

    const {
        headerTitle,
        fName,
        lName,
        mobilePlaceholder,
        emailPlaceholder,
        passwordPlaceholder,
        continueBtn,
    } = textData[lang as keyof typeof textData];

    const handleUpdateProfile = async () => {
        if (!user) return;

        try {
            const response = await updateUserProfileData(
                user.id,
                firstName,
                lastName,
                mobile,
                email,
                password
            );

            if (response?.Result === "true") {
                const updatedUser = {
                    ...user,
                    fname: firstName,
                    lname: lastName,
                    mobile: mobile,
                    email: email,
                };

                // Update Redux state
                dispatch(setUser(updatedUser));

                // Save to AsyncStorage
                await AsyncStorage.setItem("app_user", JSON.stringify(updatedUser));

                Alert.alert(
                    "Success",
                    response.ResponseMsg || "Profile updated successfully",
                    [
                        {
                            text: "OK",
                            onPress: () => navigation.goBack(),
                        },
                    ]
                );
            } else {
                Alert.alert("Error", response?.ResponseMsg || "Update failed");
            }
        } catch (error) {
            console.log("Update profile error", error);
            Alert.alert("Error", "Something went wrong");
        }
    };


    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.header}>

                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('../assets/images/back.png')} style={styles.backIcon} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{headerTitle}</Text>

                </View>

                <View style={styles.content}>
                    <View>
                        <View style={styles.row}>
                            <View style={styles.halfInputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={fName}
                                    placeholderTextColor={Colors.lightGreyText}
                                    value={firstName}
                                    onChangeText={setFirstName}
                                />
                            </View>
                            <View style={[styles.halfInputContainer, { marginLeft: MarginHW.MarginW10 }]}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={lName}
                                    placeholderTextColor={Colors.lightGreyText}
                                    value={lastName}
                                    onChangeText={setLastName}
                                />
                            </View>
                        </View>

                        <TextInput
                            style={[styles.input, { color: Colors.greyText }]}
                            placeholder={mobilePlaceholder}
                            placeholderTextColor={Colors.lightGreyText}
                            keyboardType='phone-pad'
                            value={mobile}
                            editable={false}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder={emailPlaceholder}
                            placeholderTextColor={Colors.lightGreyText}
                            keyboardType='email-address'
                            value={email}
                            onChangeText={setEmail}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder={passwordPlaceholder}
                            placeholderTextColor={Colors.lightGreyText}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={() => handleUpdateProfile()}>
                        <Text style={styles.buttonText}>{continueBtn}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScreenWrapper>
    );
};

export default EditProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
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
    content: {
        flex: 1,
        padding: MarginHW.MarginH20,
        justifyContent: 'space-between',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    halfInputContainer: {
        flex: 1,
    },
    input: {
        backgroundColor: Colors.white,
        borderRadius: HWSize.H_Height10,
        paddingHorizontal: MarginHW.PaddingW14,
        paddingVertical: MarginHW.PaddingH12,
        fontSize: FontsSize.normalize14,
        fontFamily: fonts.Lexend_SemiBold,
        color: Colors.black,
        borderWidth: HWSize.H_Height2,
        borderColor: Colors.lightBorder,
        marginBottom: MarginHW.MarginH16,
    },
    button: {
        backgroundColor: Colors.tint,
        borderRadius: HWSize.H_Height10,
        paddingVertical: MarginHW.PaddingH14,
        alignItems: 'center',
        marginBottom: MarginHW.MarginH20,
    },
    buttonText: {
        fontSize: FontsSize.normalize18,
        fontFamily: fonts.Lexend_SemiBold,
        color: Colors.white,
    }
});
