import React from 'react';
import { View, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';
import { Colors } from '../comman/comman/Colors';
import ScreenWrapper from '../comman/comman/ScreenWrapper';

const WebViewScreen = () => {
    const route = useRoute<any>();
    const { url } = route.params || {};

    return (
        <ScreenWrapper style={styles.container} scroll={false}>
            <StatusBar barStyle="dark-content" translucent={false} />
            <WebView
                source={{ uri: url }}
                startInLoadingState={true}
                renderLoading={() => (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.purpleBtn} />
                    </View>
                )}
            />
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: Colors.surface,

    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',

    },
});

export default WebViewScreen;
