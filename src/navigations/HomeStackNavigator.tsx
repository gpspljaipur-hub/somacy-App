import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/MainPageDetailsScrren";
import CategoryProductsScreen from "../screens/CategoryProductsScreen";
import ProductInfoScreen from "../screens/ProductInfoScreen";
import AllProductScreen from "../screens/AllProductScreen";

const Stack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="CategoryProducts" component={CategoryProductsScreen} />
      <Stack.Screen name="ProductInfo" component={ProductInfoScreen} />
       <Stack.Screen
      name="AllProducts"
      component={AllProductScreen}
    />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
