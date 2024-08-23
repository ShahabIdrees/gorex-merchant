import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {useDispatch, useSelector} from 'react-redux';
import {colors} from '../utils/colors';
import {
  CustomButton,
  LoginInput,
  ErrorMessageComponent,
  CustomLoadingIndicator,
  CustomPhoneInput,
} from '../components';
import AuthService from '../api/auth';
import {CommonActions} from '@react-navigation/native';
import {
  selectPhone,
  selectRememberMe,
  setPhone,
  setToken,
  setUserIdFuelStationUser,
  setFuelStationId,
  setFuelStationImage,
  setFuelStationName,
  setFuelStationUserDetailsId,
  setProfilePic,
  setUserName,
  setRememberMe,
} from '../redux/user-slice';
import {BOP} from '../assets/svgs';
import {
  validatePakistaniNumber,
  validateSaudiNumber,
} from '../utils/helper-functions';
import {BASE_URL_FUELING} from '../api/repos';
import ErrorCode from '../enums/error-codes';

const Login = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullPhoneNumber, setFullPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isError, setIsError] = useState(false);
  const [countryCode, setCountryCode] = useState('PK'); // Default to Pakistan
  const [callingCode, setCallingCode] = useState('92'); // Default calling code for Pakistan
  const [rememberMe, setRememberme] = useState(false); // New state for Remember Me checkbox
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const rememberMeState = useSelector(selectRememberMe);
  const phone = useSelector(selectPhone);
  console.log('Phone numbner: ' + phone);
  useEffect(() => {
    if (phone && rememberMeState) {
      setPhoneNumber(phone);
      // setFullPhoneNumber(phone);
    }
    setRememberme(rememberMeState);
  }, [phone, rememberMeState]);

  const handlePrivacyPolicyPress = () => {
    Linking.openURL('https://gorex.ai/privacy-policy');
  };
  const handleLoginPress = async () => {
    if (!fullPhoneNumber) {
      setIsError(true);
      setError(t('errorMessages.login.invalidPhoneNumber'));
      return;
    }
    if (callingCode === '92' || callingCode === '+92') {
      const isValidPhoneNumber = validatePakistaniNumber(phoneNumber);
      if (!isValidPhoneNumber) {
        setIsError(true);
        setError(t('errorMessages.login.invalidPhoneNumber'));
        return;
      }
    } else if (callingCode === '+966' || callingCode === '966') {
      const isValidPhoneNumber = validateSaudiNumber(fullPhoneNumber);
      if (!isValidPhoneNumber) {
        setIsError(true);
        setError(t('errorMessages.login.invalidPhoneNumber'));
        return;
      }
    }
    if (!password) {
      setIsError(true);
      setError(t('errorMessages.login.passwordEmpty'));
      return;
    }

    setIsLoading(true);
    setError('');
    setIsError(false);

    try {
      const response = await AuthService.merchantEmployeeLogin(
        fullPhoneNumber,
        password,
      );
      setIsLoading(false);
      if (response.error_code === ErrorCode.SUCCESS) {
        dispatch(setPhone(phone));
        dispatch(setToken(response.result.token));
        dispatch(setUserIdFuelStationUser(response.result._id));
        dispatch(
          setFuelStationUserDetailsId(
            response.result.fuel_station_user_details._id,
          ),
        );
        dispatch(
          setFuelStationId(
            response.result.fuel_station_user_details.fuel_station_id,
          ),
        );
        dispatch(
          setProfilePic(
            `${BASE_URL_FUELING}/${response.result.fuel_station_user_details.image}`,
          ),
        );
        dispatch(setUserName(response.result.user_name));
        dispatch(
          setFuelStationImage(
            `${BASE_URL_FUELING}/${response.result.fuel_station.image}`,
          ),
        );
        dispatch(setFuelStationName(response.result?.fuel_station?.name));
        if (rememberMe) {
          console.log('We here: ' + phoneNumber);
          dispatch(setPhone(phoneNumber));
        } else {
          dispatch(setPhone(''));
        }

        const resetAction = CommonActions.reset({
          index: 0,
          routes: [{name: 'Main'}],
        });
        navigation.dispatch(resetAction);
      } else if (response.error_code === ErrorCode.INVALID_CREDENTIALS) {
        setIsError(true);
        setError(t('errorMessages.login.invalidCredentials'));
      } else if (response.error_code === ErrorCode.NOT_EXIST) {
        setIsError(true);
        setError(t('errorMessages.login.notRegistered'));
      } else {
        setIsError(true);
        setError(t('errorMessages.login.invalidCredentials'));
      }
    } catch (err) {
      setIsLoading(false);
      setIsError(true);
      setError(t('errorMessages.login.networkError'));
    }
  };

  const handleForgotPasswordPress = () => {
    // openBottomSheet('ForgotPasswordSheet', 770);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{t('login.loginPrompt')}</Text>
      {isError ? <ErrorMessageComponent text={error} /> : null}
      <Text style={[styles.label, {color: colors.primaryText}]}>Login</Text>

      <CustomPhoneInput
        countryCode={countryCode}
        callingCode={callingCode}
        setCountryCode={setCountryCode}
        setCallingCode={setCallingCode}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        onPhoneNumberChange={setFullPhoneNumber} // Handle full phone number
      />
      <LoginInput
        marginTop={2}
        // maxLength={12 - callingCode.length}
        label={'Password'}
        placeholder={'enter password'}
        isSecureEntry={true}
        handleChangeText={setPassword}
      />
      <View style={styles.rememberMeContainer}>
        <CheckBox
          value={rememberMe}
          onValueChange={value => {
            setRememberme(value);
            dispatch(setRememberMe(value));
          }}
          tintColors={{true: colors.brandAccentColor, false: colors.grey}}
        />
        <Text style={styles.rememberMeText}>Remember Me</Text>
      </View>
      {isLoading ? (
        <ActivityIndicator
          size={Platform.OS === 'ios' ? 'large' : 50}
          color={colors.brandAccentColor}
        />
      ) : (
        <CustomButton
          text={'Login'}
          textColor={'white'}
          marginTop={20}
          handlePress={handleLoginPress}
        />
      )}
      <TouchableOpacity
        style={{alignSelf: 'center', marginTop: 16}}
        onPress={handlePrivacyPolicyPress}>
        <Text style={{color: colors.linkColor}}>Privacy Policy</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        style={{alignSelf: 'center', marginTop: 16}}
        onPress={handleForgotPasswordPress}>
        <Text style={{color: 'black'}}>Forgot Password?</Text>
      </TouchableOpacity> */}
      <View style={styles.bopContainer}>
        <Text
          style={{
            position: 'relative',
            textAlign: 'center',
            fontSize: 10,
            marginBottom: -10,
            color: colors.black,
            fontStyle: 'italic',
            fontFamily: 'NotoSans-Regular',
            borderRadius: 4,
          }}>
          Powered by
        </Text>
        <BOP />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  prompt: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Inter',
    lineHeight: 29,
    marginBottom: 20,
    color: colors.headingText,
  },
  bopContainer: {
    height: 80,
    width: 80,
    alignSelf: 'center',
    marginTop: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  rememberMeText: {
    marginLeft: 10,
    fontSize: 16,
    color: colors.primaryText,
  },
});

export default Login;
