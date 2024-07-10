import React from 'react';
import {StyleSheet, StatusBar} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {CustomBottomTabBar} from '../components';
import {History, Home, Scanner} from '../views';
import {useTranslation} from 'react-i18next';
import {colors} from '../utils/colors';
import {
  HistoryFocused,
  HomeFocused,
  HomeIcon,
  HistoryIcon,
} from '../assets/icons';
const Tab = createBottomTabNavigator();

const CustomTabBar = () => {
  const {t} = useTranslation();
  StatusBar.setBackgroundColor('#FBFCFD');
  StatusBar.setBarStyle('dark-content');
  return (
    <Tab.Navigator
      tabBar={props => <CustomBottomTabBar {...props} />}
      // tabBarOptions={{
      //   style: styles.tabBar,
      //   showLabel: false,
      // }}

      screenOptions={{
        headerShown: false,
        // tabBarStyle: {
        //   backgroundColor: 'transparent', // Ensure this is set to transparent
        //   position: 'absolute', // Helps in positioning
        //   elevation: 0, // Remove shadow on Android
        //   borderTopWidth: 0, // Remove top border
        // },1
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (focused ? <HomeFocused /> : <HomeIcon />),
          tabBarStyle: {display: 'none'},
          tabBarLabel: t('homeScreen.home'),
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarIcon: ({focused}) =>
            focused ? <HistoryFocused /> : <HistoryIcon />,

          tabBarLabel: t('historyScreen.history'),
        }}
      />

      <Tab.Screen
        name="Scanner"
        component={Scanner}
        options={{tabBarButton: () => null, hiddenTab: true}}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 80,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#000',
    elevation: 5,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  imageWrapper: {
    width: 22,
    height: 22,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.imageBorder,
    elevation: 1,
    shadowRadius: 20,
    shadowOpacity: 1,
    shadowColor: colors.black,
    alignItems: 'center',
    // paddingBottom: 10,
    justifyContent: 'center',
  },
});

export default CustomTabBar;
