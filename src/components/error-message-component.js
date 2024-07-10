import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Info} from '../assets/icons';
import globalStyles from '../theme';
import {colors} from '../utils/colors';

const ErrorMessageComponent = ({text}) => {
  return (
    <View style={styles.otpFailedContainer}>
      {/* <Icon name="info" size={20} color={colors.errorColor} /> */}
      <Info />
      <Text style={[styles.incorretOTP, globalStyles.text]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  otpFailedContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    // borderColor: colors.inputBorderRed,
    // borderWidth: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    height: 58,
    backgroundColor: colors.errorBackground,
  },
  incorretOTP: {
    color: colors.invalidText,
    marginLeft: 5,
    fontSize: 14,
  },
});

export default ErrorMessageComponent;
