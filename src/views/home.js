import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
  Alert,
  BackHandler,
  Modal,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import TransactionHistoryComponent from '../components/transaction-history-component';
import ConsumptionComponent from '../components/consumption-component';
import TransactionHistoryService from '../api/transaction-history';
import {colors} from '../utils/colors';
import globalStyles from '../theme';
import {folio, profile} from '../assets/pngs';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearUser,
  selectFuelStationImage,
  selectFuelStationName,
  selectFuelStationUserDetailsId,
  selectProfilePic,
  selectToken,
  selectUserName,
  setToken,
} from '../redux/user-slice';
import {EmptyListIcon} from '../assets/svgs';
import {getFuelType} from '../enums/fuel-type';
import {FuelStationPlaceHolder} from '../assets/icons';
import ErrorCode from '../enums/error-codes';

const Home = ({navigation}) => {
  const {t} = useTranslation();
  const route = useRoute();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  // const fuelStationUserDetailsId = '668f7af43dc912500871a4d4';
  const fuelStationUserDetailsId = useSelector(selectFuelStationUserDetailsId);
  const userName = useSelector(selectUserName);
  const fuelStationName = useSelector(selectFuelStationName);
  const fuelStationImage = useSelector(selectFuelStationImage);
  const profileImage = useSelector(selectProfilePic);
  console.log('PPP: ' + profileImage);
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert('Hold on!', 'Are you sure you want to exit?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {text: 'YES', onPress: () => BackHandler.exitApp()},
        ]);
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchData();
    }, []),
  );

  useEffect(() => {
    fetchData();
  }, []);

  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        <EmptyListIcon />
        <Text
          style={{
            color: 'black',
            fontSize: 18,
            fontWeight: '600',
            marginTop: 12,
          }}>
          {error}
        </Text>
      </View>
    );
  };
  const fetchData = async () => {
    try {
      const limit = 5;

      const response = await TransactionHistoryService.getAllTransactionHistory(
        token,
        fuelStationUserDetailsId,
        1, // Page number 1 for initial fetch
        limit,
      );
      setIsLoading(false);
      if (response.error_code === ErrorCode.SUCCESS) {
        setData(response.result);
        console.log('Data received: ' + response.result);
        dispatch(setToken(response.token));
      } else if (response.error_code === ErrorCode.NO_DATA) {
        // console.log('Token: ', response.token);
        console.log('RES: ' + response.token);
        dispatch(setToken(response.token));
        setError(response.message);
      } else if (response.error_code === 2) {
        // console.log('Token: ', response.token);
        // dispatch(setToken(response.token));
        setError(response.message);
      } else if (response.error_code === ErrorCode.TOKEN_INVALID) {
        // handleSessionTimeout(navigation);
        // Alert.alert(
        //   'Session timed out',
        //   'Please login again to continue',
        //   [
        //     {
        //       text: 'OK',
        //       onPress: () => navigation.navigate('Login'), // Adjust 'LoginScreen' to your login screen's name
        //     },
        //   ],
        //   {cancelable: false}, // This ensures the alert cannot be dismissed by tapping outside of it
        // );
        // dispatch(setToken(null));
      } else {
        setIsError(true);
        setError(response.message);
      }
    } catch (err) {
      setIsLoading(false);
      setIsError(true);
      setError(err.message || 'ERRRROR: Something went wrong');
    }
  };
  const profilePath = useSelector(selectFuelStationImage);
  console.log(profilePath);
  const handleLogout = () => {
    dispatch(clearUser());
    setModalVisible(false);
    navigation.navigate('Login'); // Adjust 'Login' to your actual login screen name
  };

  return (
    <SafeAreaView style={{flex: 1}} edges={['bottom', 'left', 'right']}>
      <View style={styles.container}>
        <ScrollView>
          <View
            style={[
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 20,
                marginTop: 16,
                marginBottom: 24,
              },
              {paddingTop: Platform.OS === 'ios' ? 30 : 0},
            ]}>
            <View style={{flexDirection: 'row', flex: 3}}>
              <TouchableOpacity
                style={styles.imageWrapper}
                onPress={() => {
                  setModalVisible(true);
                }}>
                <Image
                  source={{uri: profileImage}}
                  resizeMethod="contain"
                  style={styles.image}
                />
              </TouchableOpacity>
              <View style={{marginHorizontal: 8, flex: 2}}>
                <Text style={[styles.welcome, {textAlign: 'left'}]}>
                  {t('homeScreen.welcome')}
                </Text>
                <Text
                  style={styles.name}
                  numberOfLines={2}
                  ellipsizeMode="tail">
                  {userName}
                  {/* Muhammad Shahab U Din Chatha */}
                </Text>
              </View>
            </View>
            <View style={{alignItems: 'flex-end', flex: 1}}>
              <View style={styles.companyImageWrapper}>
                <Image
                  source={{uri: fuelStationImage}}
                  resizeMode="cover"
                  style={styles.image}
                />
              </View>
              <Text
                style={styles.fuelStationName}
                numberOfLines={2}
                ellipsizeMode="tail">
                {fuelStationName}
                {/* Go and Relax Private Limited */}
              </Text>
            </View>
          </View>
          <ConsumptionComponent navigation={navigation} />
          <View style={{marginHorizontal: -20, padding: 20}}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <View
                style={{
                  flexDirection: 'row',
                  paddingLeft: 20,
                  paddingRight: 8,
                }}>
                {/* <PromotionalCard /> */}
                {/* <PromotionalCardPurple /> */}
              </View>
            </ScrollView>
          </View>
          <View>
            <View
              style={[
                styles.transactionHistoryContainer,
                {flexDirection: 'row'},
              ]}>
              <Text style={[styles.transactionHistoryText]}>
                {t('homeScreen.recentUser')}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('History');
                }}>
                <Text style={[styles.viewAllText]}>
                  {t('homeScreen.viewAll')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : isError ? (
            <View style={styles.errorContainer}>
              {/* <Text style={styles.errorText}>{error}</Text> */}
              <Text
                style={{
                  color: 'black',
                  fontSize: 18,
                  fontWeight: '600',
                  marginTop: 12,
                }}>
                {error}
              </Text>
            </View>
          ) : (
            <FlatList
              data={data}
              renderItem={({item}) => (
                <TransactionHistoryComponent
                  isCompact={false}
                  numberPlate={item.vehicle?.plate_no}
                  fuelType={getFuelType(item.fuel_type)}
                  vehicleName={`${item.vehicle?.vehicle_make_id?.make ?? ''} ${
                    item.vehicle?.vehicle_model_id?.model ?? ''
                  } ${item.vehicle?.vehicle_variant_id?.variant ?? ''}`}
                  transactionDateTime={item.createdAt}
                  nozlePrice={item.nozzle_price?.toFixed(2)}
                  quantity={item.litre_fuel}
                  transactionType={item.transaction_type}
                />
              )}
              ListEmptyComponent={renderEmpty}
              keyExtractor={item => item._id}
              style={{marginBottom: 120}}
            />
          )}
        </ScrollView>
      </View>
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Do you want to logout?</Text>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: '700',
    color: colors.primaryText,
  },
  logoutButton: {
    backgroundColor: colors.brandAccentColor,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButton: {
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: colors.primaryText,
  },
  container: {
    flex: 1,
    backgroundColor: colors.mainBackgroundColor,
  },
  imageWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    overflow: 'hidden',
    borderColor: colors.imageBorder,
    elevation: 1,
    shadowRadius: 20,
    shadowOpacity: 1,
    shadowColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },

  welcome: {
    fontSize: 12,
    color: colors.primaryText,
    width: '100%',
  },
  fuelStationName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primaryText,
    flexShrink: 1,
    // width: '100%',
    textAlign: 'justify',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primaryText,
    flexShrink: 1,
    width: '100%',
  },
  companyImageWrapper: {
    borderColor: colors.imageBorder,
    borderWidth: 0.2,
    height: 29,
    width: 56,
    borderRadius: 15,
    shadowColor: colors.black,
    shadowRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 1,
    shadowOffset: {width: 1, height: 1},
    overflow: 'hidden',
  },
  transactionHistoryContainer: {
    marginHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 18,
  },
  transactionHistoryText: {
    color: colors.primaryText,
    fontWeight: '700',
    fontSize: 14,
  },
  viewAllText: {
    textDecorationLine: 'underline',
    textDecorationColor: colors.homeText,
    color: colors.primaryText,
    fontSize: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
});

export default Home;
