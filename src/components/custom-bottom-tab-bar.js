import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  ImageBackground,
  Platform,
} from 'react-native';
// import {GCentral} from '../assets';
// import {ScreenWidth} from '../utils/screen';
import {ScreenWidth} from '../utils/constants';
// import globalStyles from '../theme';
import {colors} from '../utils/colors';
import {QR} from '../assets/icons';

const centerX = ScreenWidth / 2;

const CustomBottomTabBar = ({state, descriptors, navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.shadowContainer}>
        <ImageBackground
          source={require('../assets/pngs/tabbar-bg.png')}
          style={styles.backgroundImage}
          resizeMode="stretch">
          <View style={styles.tabBar}>
            {state.routes
              .filter(route => !descriptors[route.key].options.hiddenTab)
              .map((route, index) => {
                const {options} = descriptors[route.key];
                const label =
                  options.tabBarLabel !== undefined
                    ? options.tabBarLabel
                    : options.title !== undefined
                    ? options.title
                    : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                  navigation.navigate(route.name);
                };

                const onLongPress = () => {
                  navigation.emit({
                    type: 'tabLongPress',
                    target: route.key,
                  });
                };

                return (
                  <TouchableOpacity
                    key={index}
                    onPress={onPress}
                    onLongPress={onLongPress}
                    style={[
                      styles.tabItem,
                      index === 0 ? styles.rightSpacing : null,
                    ]}>
                    {options.tabBarIcon({focused: isFocused})}
                    <Text
                      style={[
                        {
                          color: isFocused
                            ? colors.brandAccentColor
                            : colors.black,
                          fontSize: 10,
                          marginTop: 10,
                          fontWeight: '500',
                          marginBottom: 8,
                        },
                        // globalStyles.text,
                      ]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            <TouchableOpacity
              style={styles.centerIcon}
              onPress={() => navigation.navigate('Scanner')}>
              {/* <GCentral /> */}
              <QR />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80,
  },
  shadowContainer: {
    width: '100%',
    height: 80,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: -4}, // Shadow on the top side
    // shadowOpacity: 0.3,
    // shadowRadius: 4,
    // elevation: 5, // for Android
  },
  backgroundImage: {
    width: '100%',
    height: 80,
  },
  tabBar: {
    flexDirection: 'row',
    height: 80,
    width: '100%',
    zIndex: 1,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 8 : 2,
  },
  centerIconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 9999,
    top: -60,
    left: '50%',
    marginLeft: -45,
  },
  centerIcon: {
    width: 68,
    height: 68,
    backgroundColor: colors.brandAccentColor,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: centerX - 34,
    bottom: 44,
    marginBottom: 5,
  },
  rightSpacing: {
    marginRight: '17%',
  },
});

export default CustomBottomTabBar;
