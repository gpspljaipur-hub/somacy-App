import { View, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const ScreenWrapper = ({ children, scroll = true, useScrollView, style, ...props }: any) => {
  const shouldScroll = useScrollView !== undefined ? useScrollView : scroll;
  return (
    <SafeAreaView style={[{ flex: 1 }, style]} {...props}>
      {shouldScroll ? (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1 }}>{children}</View>
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>{children}</View>
      )}
    </SafeAreaView>
  );
};

export default ScreenWrapper;


