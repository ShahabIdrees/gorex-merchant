import React, {useEffect, useRef} from 'react';
import {View, Animated, Easing, StyleSheet} from 'react-native';

const CustomLoadingIndicator = ({size = 40, color = '#0000ff', style}) => {
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startRotation = () => {
      Animated.loop(
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    };

    startRotation();
  }, [rotateValue]);

  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const animatedStyle = {
    transform: [{rotate: rotateInterpolate}],
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.indicator,
          {width: size, height: size, borderColor: color},
          animatedStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    borderWidth: 4,
    borderRadius: 50,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
});

export default CustomLoadingIndicator;
