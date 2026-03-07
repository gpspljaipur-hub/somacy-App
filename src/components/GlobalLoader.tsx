import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Modal, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { Colors } from '../comman/comman/Colors';
import FontsSize from '../comman/comman/FontsSize';
import fonts from '../comman/comman/fonts';
import { RootState } from '../Redux/store/store';

const GlobalLoader = () => {
    const isLoading = useSelector((state: RootState) => state.loader.isLoading);
    const [loadingText, setLoadingText] = useState('Please Wait...');

    useEffect(() => {
        const checkLang = async () => {
            const stored = await AsyncStorage.getItem("app_lang");
            if (stored === "hi") {
                setLoadingText('कृपया प्रतीक्षा करें...');
            } else {
                setLoadingText('Please Wait...');
            }
        };
        // Check language when loader becomes visible
        if (isLoading) {
            checkLang();
        }
    }, [isLoading]);

    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={isLoading}
            onRequestClose={() => { }}
        >
            <View style={styles.container}>
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={Colors.tint} />
                    <Text style={styles.loadingText}>{loadingText}</Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        zIndex: 9999, // Ensure it sits on top of everything
    },
    loaderContainer: {
        padding: 20,

        // backgroundColor: Colors.white,
        borderRadius: 10,
        alignItems: 'center',
        // elevation: 5,
    },
    loadingText: {
        marginTop: 10,
        fontSize: FontsSize.size16,
        color: Colors.tint,
        fontFamily: fonts.Lexend_SemiBold,
    },
});

export default GlobalLoader;
