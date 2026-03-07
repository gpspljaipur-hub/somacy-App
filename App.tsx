// import React from "react";
// import { StatusBar, useColorScheme } from "react-native";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import AppNavigator from "./src/navigations/AppNavigator";
// import { store } from "./src/Redux/store/store";
// import { Provider } from "react-redux";


// function App() {
//   const isDarkMode = useColorScheme() === "dark";

//   return (
//    <Provider store={store}>
//       <SafeAreaProvider>
//         <StatusBar
//           barStyle={isDarkMode ? "light-content" : "dark-content"}
//         />
//         <AppNavigator />
//       </SafeAreaProvider>
//     </Provider>
//   );
// }

// export default App;

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar, useColorScheme } from "react-native";
import { persistor, store } from "./src/Redux/store/store";
import AppNavigator from "./src/navigations/AppNavigator";
import { Colors } from "./src/comman/comman/Colors";
import { RootSiblingParent } from 'react-native-root-siblings';


function App() {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootSiblingParent>
          <SafeAreaProvider>
            <StatusBar
              barStyle="dark-content"
              backgroundColor={Colors.white}
            />
            <AppNavigator />
          </SafeAreaProvider>
        </RootSiblingParent>
      </PersistGate>
    </Provider>
  );
}

export default App;

