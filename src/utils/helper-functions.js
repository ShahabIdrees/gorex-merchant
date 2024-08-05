import {Alert} from 'react-native';

export const handleSessionTimeout = ({navigation}) => {
  Alert.alert(
    'Session timed out',
    'Please login again to continue',
    [
      {
        text: 'OK',
        onPress: () => navigation.navigate('Login'), // Adjust 'LoginScreen' to your login screen's name
      },
    ],
    {cancelable: false}, // This ensures the alert cannot be dismissed by tapping outside of it
  );
};

export const validatePakistaniNumber = number => {
  const regex = /^3\d{9}$/;
  return regex.test(number);
};
export const validateSaudiNumber = number => {
  const regex = /^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/;
  return regex.test(number);
};
