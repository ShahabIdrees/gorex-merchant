import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {
  ChevLeftGreenSmall,
  ChevLeftSmall,
  ChevRightSmall,
  ChevRigthGreenSmall,
  FuelStationPlaceHolder,
} from '../assets/icons';
import {useTranslation} from 'react-i18next';
import globalStyles from '../theme';
import {colors} from '../utils/colors';
import SalesComponent from './sales-component';
import SalesService from '../api/sales';
import ErrorCode from '../enums/error-codes';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectFuelStationUserDetailsId,
  selectToken,
  setToken,
} from '../redux/user-slice';
import Dropdown from './dropdown';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const ConsumptionComponent = ({navigation}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const {t} = useTranslation();
  const fuelStationUserDetailId = useSelector(selectFuelStationUserDetailsId);
  const currentDate = moment().utc();
  const dispatch = useDispatch();

  const filters = ['Daily', 'Weekly', 'Monthly'];
  const [currentFilter, setCurrentFilter] = useState(filters[0]);
  const token = useSelector(selectToken);

  const fetchData = async startDate => {
    setLoading(true); // Start loading
    const endDate = moment().utc().format('YYYY-MM-DD');
    try {
      const response = await SalesService.getSalesDataForPeriod(
        token,
        fuelStationUserDetailId,
        startDate,
        endDate,
      );
      switch (response.error_code) {
        case ErrorCode.SUCCESS:
          setData(response.result);
          break;
        case ErrorCode.TOKEN_INVALID:
          Alert.alert(
            'Session timed out: consumption',
            'Please login again to continue',
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate('Login'),
              },
            ],
            {cancelable: false},
          );
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!token) return;

      let params;

      switch (currentFilter) {
        case 'Monthly':
          params = {
            startDate: currentDate.startOf('month').format('YYYY-MM-DD'),
          };
          break;
        case 'Weekly':
          params = {
            startDate: currentDate.startOf('week').format('YYYY-MM-DD'),
          };
          break;
        case 'Daily':
          params = {
            startDate: currentDate.format('YYYY-MM-DD'),
          };
          break;
        default:
          params = {
            startDate: currentDate.format('YYYY-MM-DD'),
          };
          break;
      }

      fetchData(params.startDate); // Ensure fetchData is only called once
    }, [token, currentFilter]), // Dependencies
  );

  const handleFilterChange = filter => {
    setCurrentFilter(filter);
    let startDate;
    switch (filter) {
      case 'Monthly':
        startDate = currentDate.startOf('month').format('YYYY-MM-DD');
        fetchData(startDate);
        break;
      case 'Weekly':
        startDate = currentDate.startOf('week').format('YYYY-MM-DD');
        fetchData(startDate);
        break;
      case 'Daily':
        fetchData(currentDate.format('YYYY-MM-DD'));
        break;
      default:
        fetchData(currentDate, currentDate);
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Dropdown
        onSelectItem={handleFilterChange}
        styles={styles.dropdownButton}
        wrapperStyles={styles.dropdownWrapper}
        data={filters}
      />
      {loading ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator
            size={Platform.OS === 'ios' ? 'large' : 50}
            color={colors.brandAccentColor}
          />
        </View>
      ) : data?.length > 0 ? (
        <Animated.View
          style={[
            styles.animatedView,
            {
              transform: [{translateX}],
              width: width,
            },
          ]}>
          {data.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <SalesComponent data={data} />
            </View>
          ))}
        </Animated.View>
      ) : (
        <SalesComponent />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 20,
    // justifyContent: 'space-around',
    paddingVertical: 23,
    elevation: 2,
    margin: 1,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    borderRadius: 12,
    height: 350,
  },
  animatedView: {
    flexDirection: 'row',
  },
  itemContainer: {
    width,
    alignItems: 'center',
  },
  dropdownButton: {
    borderRadius: 8,
  },
  dropdownWrapper: {
    alignSelf: 'flex-end',
    marginHorizontal: 20,
  },
});

export default ConsumptionComponent;
