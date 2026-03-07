import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MedicineScreen from "../screens/MedicineScreen";
import CategoryProductsScreen from "../screens/CategoryProductsScreen";
import AllProductScreen from "../screens/AllProductScreen";
import { useRoute } from "@react-navigation/native";

const MedicineStack = createNativeStackNavigator();

// const MedicineStackNavigator = () => (
//   <MedicineStack.Navigator screenOptions={{ headerShown: false }}>
//     <MedicineStack.Screen name="MedicineHome" component={MedicineScreen} />
//     <MedicineStack.Screen
//       name="CategoryProducts"
//       component={CategoryProductsScreen}
//     />

//   </MedicineStack.Navigator>
// );
type Language = "en" | "hi";

const MedicineStackNavigator = () => {
  const route = useRoute<any>();

  const lang: Language = route.params?.lang ?? "en";

  return (
    <MedicineStack.Navigator screenOptions={{ headerShown: false }}>
      <MedicineStack.Screen
        name="MedicineHome"
        component={MedicineScreen}
        initialParams={{ lang }}
      />

      <MedicineStack.Screen
        name="CategoryProducts"
        component={CategoryProductsScreen}
        initialParams={{ lang }}
      />
    </MedicineStack.Navigator>
  );
};


export default MedicineStackNavigator;
