import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {useDispatch} from 'react-redux';
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
  setFuelStationId,
  setFuelStationImage,
  setFuelStationName,
  setFuelStationUserDetailsId,
  setProfilePic,
  setToken,
  setUserIdFuelStationUser,
  setUserName,
} from '../redux/user-slice';
import {BOP} from '../assets/svgs';
import {validatePakistaniNumber} from '../utils/helper-functions';

const Login = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullPhoneNumber, setFullPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isError, setIsError] = useState(false);
  const [countryCode, setCountryCode] = useState('PK'); // Default to Pakistan
  const [callingCode, setCallingCode] = useState('92'); // Default calling code for Pakistan
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const handleLoginPress = async () => {
    if (!fullPhoneNumber) {
      setIsError(true);
      setError(t('errorMessages.login.invalidPhoneNumber'));
      return;
    }
    if (countryCode === 92 || countryCode === '+92') {
      const isValidPhoneNumber = validatePakistaniNumber(phoneNumber);
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
      if (response.error_code === 0) {
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
            `https://uat-gorex-api-gateway.gorex.pk/fueling/${response.result.fuel_station_user_details.image}`,
          ),
        );
        dispatch(setUserName(response.result.user_name));
        dispatch(
          setFuelStationImage(
            `https://uat-gorex-api-gateway.gorex.pk/fueling/${response.result.fuel_station.image}`,
          ),
        );
        dispatch(setFuelStationName(response.result?.fuel_station?.name));

        const resetAction = CommonActions.reset({
          index: 0,
          routes: [{name: 'Main'}],
        });
        navigation.dispatch(resetAction);
      } else if (response.error_code === 3) {
        setIsError(true);
        setError(t('errorMessages.login.invalidCredentials'));
      } else if (response.error_code === 4) {
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
      <Text style={[styles.label, {color: colors.primaryText}]}>Login</Text>

      {isError ? <ErrorMessageComponent text={error} /> : null}
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
        label={'Password'}
        placeholder={'enter password'}
        isSecureEntry={true}
        handleChangeText={setPassword}
      />
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
        onPress={handleForgotPasswordPress}>
        <Text style={{color: 'black'}}>Forgot Password?</Text>
      </TouchableOpacity>
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
});

export default Login;
