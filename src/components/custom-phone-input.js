import React, {useEffect, useState} from 'react';
import {View, TextInput, StyleSheet, Text} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import {colors} from '../utils/colors';
import {getExampleNumber} from 'libphonenumber-js';
import {validatePakistaniNumber} from '../utils/helper-functions';

const CustomPhoneInput = ({
  countryCode,
  callingCode,
  setCountryCode,
  setCallingCode,
  phoneNumber,
  setPhoneNumber,
  onPhoneNumberChange, // Callback to pass concatenated phone number
}) => {
  const [maxLength, setMaxLength] = useState(10);
  const [placeholder, setPlaceholder] = useState('338 8388383');
  const [fullPhoneNumber, setFullPhoneNumber] = useState('');
  useEffect(() => {
    const exampleNumber = getExampleNumber(countryCode, 'mobile');
    if (exampleNumber) {
      const nationalNumber = exampleNumber.nationalNumber;
      setMaxLength(nationalNumber.length);
      setPlaceholder(nationalNumber);
    }
  }, [countryCode]);

  useEffect(() => {
    const formattedPhoneNumber = `${callingCode}${phoneNumber}`;
    setFullPhoneNumber(formattedPhoneNumber);
    onPhoneNumberChange(formattedPhoneNumber); // Pass concatenated phone number to parent
  }, [callingCode, onPhoneNumberChange, phoneNumber]);

  return (
    <View style={styles.container}>
      <CountryPicker
        withCallingCode
        withFlag
        withEmoji
        withFilter
        countryCode={countryCode}
        onSelect={country => {
          setCountryCode(country.cca2);
          setCallingCode(country.callingCode[0]);
        }}
      />
      <Text style={styles.callingCode}>+{callingCode}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.placeHolderColor}
        keyboardType="phone-pad"
        maxLength={maxLength}
        onChangeText={text => setPhoneNumber(text.replace(/\D/g, ''))}
        value={phoneNumber}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: colors.inputBorderColor,
    padding: 8,
  },
  callingCode: {
    marginLeft: 10,
    fontSize: 16,
    color: colors.primaryText,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: colors.primaryText,
  },
});

export default CustomPhoneInput;
