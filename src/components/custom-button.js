import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';

// import globalStyles from '../theme';
import {colors} from '../utils/colors';

const CustomButton = ({
  text,
  textColor = colors.white,
  color = colors.brandAccentColor,
  bordColor = '',
  isDisabled = false,
  marginTop = 0,
  handlePress = () => {},
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.confirmButton,
        {
          backgroundColor: color,
          marginTop: marginTop,
          borderColor: bordColor,
          borderWidth: bordColor === '' ? 0 : 1,
        },
      ]}
      disabled={isDisabled}
      onPress={handlePress}>
      <Text style={[styles.confirmText, {color: textColor}]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  confirmButton: {
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  confirmText: {
    // color: colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default CustomButton;
