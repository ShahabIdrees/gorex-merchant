import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Text,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import TransactionHistoryComponent from '../components/transaction-history-component';
import TransactionHistoryService from '../api/transaction-history';
import {useFocusEffect} from '@react-navigation/native';
import {
  selectFuelStationUserDetailsId,
  selectToken,
  setToken,
} from '../redux/user-slice';
import {useDispatch, useSelector} from 'react-redux';
import {EmptyListIcon} from '../assets/svgs';
import {handleSessionTimeout} from '../utils/helper-functions';
import {getFuelType} from '../enums/fuel-type';

const History = ({navigation}) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const fuelStationUserDetailsId = useSelector(selectFuelStationUserDetailsId);

  const fetchData = async (refresh = false) => {
    try {
      const limit = 5;
      const currentPage = refresh ? 1 : page;

      const response = await TransactionHistoryService.getAllTransactionHistory(
        token,
        fuelStationUserDetailsId,
        currentPage,
        limit,
      );
      setIsLoading(false);
      setIsRefreshing(false);

      if (response.error_code === 0) {
        if (refresh) {
          setData(response.result);
        } else {
          setData(prevData => [...prevData, ...response.result]);
        }

        if (response.result.length < limit) {
          setHasMore(false);
        }
      } else if (response.error_code === 4) {
        dispatch(setToken(response.token));
        setError('No transaction record found');
      } else if (response.error_code === 8) {
        // handleSessionTimeout(navigation);
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
        dispatch(setToken(null));
      } else {
        setIsError(true);
        setError(response.message || 'Something went wrong');
      }
    } catch (err) {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsError(true);
      setError(err.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchData();
    }
  }, [page]);

  useFocusEffect(
    useCallback(() => {
      setIsRefreshing(true);
      // setIsLoading(true);
      fetchData(true);
    }, []),
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    setHasMore(true);
    setPage(1);
    fetchData(true);
  };

  const renderFooter = () => {
    if (!hasMore) return null;
    return isLoading ? (
      <ActivityIndicator size="large" color="#0000ff" />
    ) : null;
  };

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

  return (
    <SafeAreaView style={styles.container}>
      {isError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          style={{flex: 1}}
          data={data}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <TransactionHistoryComponent
              isCompact={false}
              numberPlate={item.vehicle?.plate_no ?? ''}
              fuelType={getFuelType(item.fuel_type)}
              vehicleName={`${item.vehicle?.vehicle_make_id?.make ?? ''} ${
                item.vehicle?.vehicle_model_id?.model ?? ''
              } ${item.vehicle?.vehicle_variant_id?.variant ?? ''}`}
              transactionDateTime={item.createdAt}
              nozlePrice={item.nozzle_price.toFixed(2)}
              quantity={item.litre_fuel}
              transactionType={item.transaction_type}
            />
          )}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          onEndReached={() => {
            if (hasMore && !isLoading) {
              setPage(prevPage => prevPage + 1);
            }
          }}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
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

export default History;
