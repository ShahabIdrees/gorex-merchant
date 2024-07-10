import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Text,
  SafeAreaView,
} from 'react-native';
import TransactionHistoryComponent from '../components/transaction-history-component';
import TransactionHistoryService from '../api/transaction-history';
import {CommonActions} from '@react-navigation/native';

const History = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchData();
    // We can ensure fetchData is not called multiple times by providing an empty dependency array for the initial call.
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchData();
    }
  }, [page]);

  const fetchData = async () => {
    try {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjY4ZDIyNmRkYTE4NjJjOTNiMDJhNzcxIiwiaWF0IjoxNzIwNjE4NTEyLCJleHAiOjE3MjA2MjU3MTJ9.1ZpGoo3SMoaod-viz69kE2qwTVeo7cO-bu7fjk7XUEA';
      const fuelStationUserDetailsId = '6683b602a90d61dc02cb9c8a';
      const limit = 5;

      const response = await TransactionHistoryService.getAllTransactionHistory(
        token,
        fuelStationUserDetailsId,
        page,
        limit,
      );
      setIsLoading(false);
      if (response.error_code === 0) {
        if (response.result.length < limit) {
          setHasMore(false);
        }
        setData(prevData => [...prevData, ...response.result]);
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

  const renderFooter = () => {
    if (!hasMore) return null;
    return isLoading ? (
      <ActivityIndicator size="large" color="#0000ff" />
    ) : null;
  };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text>No transaction history found.</Text>
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
          data={data}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <TransactionHistoryComponent
              isCompact={true}
              numberPlate={item.vehicle?.plate_no ?? 'N/A'}
              fuelType={item.fuel_type === 1 ? 'Super' : 'Other'}
              vehicleName={`${item.vehicle?.vehicle_make_id?.make ?? 'N/A'} ${
                item.vehicle?.vehicle_model_id?.model ?? 'N/A'
              }`}
              transactionDateTime={new Date(item.createdAt).toLocaleString()}
              nozzlePrice={item.nozzle_price.toFixed(2)}
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
