// PhonePeWebView.tsx
import React, { useState } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

export default function PhonePeWebView({ route, navigation }: any) {
  const { paymentUrl, transactionId } = route.params;
  const [loading, setLoading] = useState(true);
  const handleShouldStartLoadWithRequest = (request: any) => {
    const url = request.url;
    // Check if this is a PhonePe error page
    if (url.includes('error') || url.includes('failed') || url.includes('something-went-wrong')) {
      console.warn(' PhonePe Error Page Detected:', url);
    }

    // Only intercept when PhonePe redirects to your callback URL (your backend)
    // Don't block PhonePe's own pages, even error pages
    if (url.includes('adminst.geotree.xyz') || url.includes('webhook.site')) {
      // Navigate to success screen
      setTimeout(() => {
        navigation.navigate('PaymentSuccess', { transactionId });
      }, 300);
      // navigation.replace('PaymentSuccess', { transactionId });
      return false; // Prevent WebView from loading the callback URL
    }

    // Allow all other navigation (including PhonePe pages and error pages)
    return true;
  };

  const handleLoadStart = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.log('🔄 WebView Load Start:', nativeEvent.url);
  };

  const handleLoadEnd = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.log('✅ WebView Load End:', nativeEvent.url);
    setLoading(false);
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    Alert.alert(
      'Payment Error',
      'Failed to load payment page. Please try again.',
      [
        {
          text: 'Go Back',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const handleHttpError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView HTTP error:', nativeEvent.statusCode);
    if (nativeEvent.statusCode >= 400) {
      Alert.alert(
        'Payment Error',
        'Payment page failed to load. Please try again.',
        [
          {
            text: 'Go Back',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.8)' }}>
          <ActivityIndicator size="large" />
        </View>
      )}
      <WebView
        source={{ uri: paymentUrl }}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        onError={handleError}
        onHttpError={handleHttpError}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        style={{ flex: 1 }}
        userAgent="Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
      />
    </View>
  );
}
