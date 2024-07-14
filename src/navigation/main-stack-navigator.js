import React from 'react';
import {StyleSheet, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Home, Login} from '../views';
import CustomTabBar from './bottom-tab-navigator';
import RefillSuccessReceipt from '../views/refill-success-receipt';

const Stack = createNativeStackNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{headerShown: false, animation: 'slide_from_right'}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Main" component={CustomTabBar} />
      <Stack.Screen
        name="RefillSuccessReceipt"
        component={RefillSuccessReceipt}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default MainStackNavigator;
