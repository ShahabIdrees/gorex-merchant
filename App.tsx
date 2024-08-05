/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import type {PropsWithChildren} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { MainStackNavigator } from './src/navigation';
import { I18nextProvider } from 'react-i18next';
import i18next from './src/services/i18next';
import { Provider, useDispatch, useSelector } from 'react-redux';
import {store} from './src/store';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { BottomSheetProvider } from './src/utils/bottom-sheet-provider';
import { selectToken } from './src/redux/user-slice';

let persistedStore = persistStore(store);



function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


//   const token = useSelector(selectToken);
//   const dispatch = useDispatch();
//   const navigation = useNavigation();

// useEffect(() => {
//   if (token === null) {
//     Alert.alert(
//       'Session Timed Out',
//       'Your session has expired. Please log in again.',
//       [
//         {
//           text: 'OK',
//           onPress: () => {
//             // dispatch(); // Clear session data
//             navigation.navigate('Login'); // Navigate to signup or login screen
//           },
//         },
//       ],
//     );
//   }
// }, [token, dispatch, navigation]);
  return (
    <Provider store={store}>
      <PersistGate persistor={persistedStore}>
        {/* <BottomSheetProvider> */}
          <NavigationContainer>
            <I18nextProvider i18n={i18next}>
              <MainStackNavigator />
            </I18nextProvider>
          </NavigationContainer>
        {/* </BottomSheetProvider> */}
      </PersistGate>
    </Provider>
  );
}

// const styles = StyleSheet.create({});

export default App;
