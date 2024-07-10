import React from 'react';
import {StyleSheet, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Home, Login} from '../views';
import CustomTabBar from './bottom-tab-navigator';

const Stack = createNativeStackNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false, animation: 'slide_from_right'}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Home" component={CustomTabBar} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default MainStackNavigator;
