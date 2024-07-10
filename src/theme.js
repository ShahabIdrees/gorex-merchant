// src/theme.js
import {Platform, StyleSheet} from 'react-native';
// import {isRTLLanguage} from './utils/helper-functions';

const globalStyles = StyleSheet.create({
  text: {
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : 'Inter',
    // textAlign: isRTLLanguage() ? 'right' : 'left',

    // fontSize: 18,
  },
});

export default globalStyles;
