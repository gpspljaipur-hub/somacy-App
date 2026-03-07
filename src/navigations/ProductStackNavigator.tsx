import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MedicineScreen from "../screens/MedicineScreen";
import CategoryProductsScreen from "../screens/CategoryProductsScreen";
import AllProductScreen from "../screens/AllProductScreen";

const AllProductStack = createNativeStackNavigator();

const ProductStackNavigator = () => (
  <AllProductStack.Navigator screenOptions={{ headerShown: false }}>
    <AllProductStack.Screen
      name="AllProducts"
      component={AllProductScreen}
    />
  </AllProductStack.Navigator>
);

export default ProductStackNavigator;
