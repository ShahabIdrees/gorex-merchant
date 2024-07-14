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
  selectFuelStationImage,
  selectFuelStationUserDetailsId,
  selectToken,
  selectUserName,
  setToken,
} from '../redux/user-slice';
import {EmptyListIcon} from '../assets/svgs';

const Home = ({navigation}) => {
  const {t} = useTranslation();
  const route = useRoute();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState('');
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  // const fuelStationUserDetailsId = '668f7af43dc912500871a4d4';
  const fuelStationUserDetailsId = useSelector(selectFuelStationUserDetailsId);
  const userName = useSelector(selectUserName);
  const fuelStationImage = useSelector(selectFuelStationImage);
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
      if (response.error_code === 0) {
        setData(response.result);
        console.log('Data received: ' + data);
        dispatch(setToken(response.token));
      } else if (response.error_code === 4) {
        // console.log('Token: ', response.token);
        dispatch(setToken(response.token));
        setError('No record found against this user');
      } else {
        setIsError(true);
        setError(response.error_message || 'Something went wrong');
      }
    } catch (err) {
      setIsLoading(false);
      setIsError(true);
      setError(err.message || 'ERRRROR: Something went wrong');
    }
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
            <View style={{flexDirection: 'row'}}>
              <View style={styles.imageWrapper}>
                <Image source={profile} resizeMethod="contain" />
              </View>
              <View style={{marginHorizontal: 8}}>
                <Text style={[styles.welcome, {textAlign: 'left'}]}>
                  {t('homeScreen.welcome')}
                </Text>
                <Text style={[styles.name]}>{userName}</Text>
              </View>
            </View>
            <View style={styles.companyImageWrapper}>
              <Image
                source={{uri: fuelStationImage}}
                resizeMode="fill"
                style={styles.image}></Image>
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
              <Text style={[styles.transactionHistoryText, globalStyles.text]}>
                {t('homeScreen.recentUser')}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('History');
                }}>
                <Text style={[styles.viewAllText, globalStyles.text]}>
                  {t('homeScreen.viewAll')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : isError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <FlatList
              data={data}
              renderItem={({item}) => (
                <TransactionHistoryComponent
                  isCompact={false}
                  numberPlate={item.vehicle?.plate_no ?? 'N/A'}
                  fuelType={item.fuel_type === 1 ? 'Super' : 'Other'}
                  vehicleName={`${
                    item.vehicle?.vehicle_make_id?.make ?? 'N/A'
                  } ${item.vehicle?.vehicle_model_id?.model ?? 'N/A'}`}
                  transactionDateTime={new Date(
                    item.createdAt,
                  ).toLocaleString()}
                  nozzlePrice={item.nozzle_price?.toFixed(2)}
                  quantity={item.litre_fuel}
                  transactionType={item.transaction_type}
                />
              )}
              ListEmptyComponent={renderEmpty}
              keyExtractor={item => item._id}
              style={{marginBottom: 120}}
              // ListEmptyComponent={<EmptyListComponent isFullScreen={false} />}
            />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainBackgroundColor,
  },
  imageWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    overflow: 'hidden',
    // borderWidth: 1,
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
    color: colors.homeText,
    width: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.homeText,
  },
  companyImageWrapper: {
    // borderWidth: 1,
    borderColor: colors.imageBorder,
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
    color: colors.homeText,
    fontWeight: '700',
    fontFamily: 'Inter',
    fontSize: 14,
  },
  viewAllText: {
    textDecorationLine: 'underline',
    textDecorationColor: colors.homeText,
    color: colors.homeText,
    fontSize: 12,
    fontFamily: 'Inter',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
  emptyContainer: {
    alignItems: 'center',
  },
});

export default Home;
