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
// import CustomLoadingIndcator from '../components/custom-loading-indicator';
import {useDispatch} from 'react-redux';
import {colors} from '../utils/colors';
import {
  CustomButton,
  LoginInput,
  ErrorMessageComponent,
  CustomLoadingIndicator,
} from '../components';
import AuthService from '../api/auth';
import {CommonActions} from '@react-navigation/native';
import {
  setFuelStationId,
  setFuelStationImage,
  setFuelStationUserDetailsId,
  setProfilePic,
  setToken,
  setUserIdFuelStationUser,
  setUserName,
} from '../redux/user-slice';
import {BOP} from '../assets/svgs';

const Login = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isError, setIsError] = useState(false);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const handleLoginPress = async () => {
    if (!phoneNumber) {
      setIsError(true);
      setError(t('errorMessages.login.loginEmpty'));
      return;
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
        phoneNumber,
        password,
      );
      setIsLoading(false);
      if (response.error_code === 0) {
        console.log(response.result.token);
        console.log(response.result.fuel_station_user_details._id);
        dispatch(setToken(response.result.token));
        // console.log('UserId: ' + response.result._id);
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
        dispatch(setUserName(response.result.user_name));
        // dispatch(setProfilePic(response.result.))
        dispatch(setFuelStationImage(response.result.fuel_station.image));

        // console.log(
        //   'Fuel station id: ' +
        //     response.result.fuel_station_user_details.fuel_station_id,
        // );

        const resetAction = CommonActions.reset({
          index: 0,
          routes: [{name: 'Main'}],
        });
        navigation.dispatch(resetAction);
        // navigation.navigate('Home');
      } else {
        setIsError(true);
        setError(t('errorMessages.login.invalidCredentials'));
      }
    } catch (err) {
      setIsLoading(false);
      setIsError(true);
      setError(t('login.loginFailed'));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{t('login.loginPrompt')}</Text>
      {isError ? <ErrorMessageComponent text={error} /> : null}
      <LoginInput
        marginTop={24}
        label={'Phone'}
        placeholder={'(099) 838 838'}
        inputType={'phone-pad'}
        handleChangeText={setPhoneNumber}
      />
      <LoginInput
        marginTop={2}
        label={'Password'}
        placeholder={'enter password'}
        isSecureEntry={true}
        handleChangeText={setPassword}
      />
      {isLoading ? (
        // <CustomLoadingIndicator
        //   size={40}
        //   color={colors.brandAccentColor}
        //   style={styles.loadingIndicator}
        // />
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
      <TouchableOpacity style={{alignSelf: 'center', marginTop: 16}}>
        <Text>Forgot Password?</Text>
      </TouchableOpacity>
      <View style={styles.bopContainer}>
        <Text
          style={{
            position: 'relative',
            right: 35,
            top: 15,
            textAlign: 'center',
            fontSize: 10,
            color: colors.black,
            fontStyle: 'italic',
            transform: [{rotate: '-15deg'}],
            // borderWidth: 0.5,
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
  loadingIndicator: {
    marginTop: 20,
  },
  bopContainer: {
    height: 80,
    width: 120,
    alignSelf: 'center',
    marginTop: 40,
  },
});

export default Login;
