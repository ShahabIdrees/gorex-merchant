import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';

import {
  ChevLeftGreenSmall,
  ChevLeftSmall,
  ChevRightSmall,
  ChevRigthGreenSmall,
} from '../assets/icons';
import {useTranslation} from 'react-i18next';
import globalStyles from '../theme';
// import HomeService from '../api/home';
// import {useSelector} from 'react-redux';
// import {selectToken} from '../redux/token-slice';
// import ConsumptionComponentReal from './consumption-component-real';
import {colors} from '../utils/colors';
import SalesComponent from './sales-component';

const {width} = Dimensions.get('window');

const ConsumptionComponent = ({navigation}) => {
  // const token = useSelector(selectToken);
  const [data, setData] = useState([1, 2, 3]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const {t} = useTranslation();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await HomeService.getFuelConsumptionInformation(token);
  //       setData(response.result.result);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   fetchData();
  // }, [token]);

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1);
      Animated.spring(translateX, {
        toValue: -width * (currentIndex + 1),
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      Animated.spring(translateX, {
        toValue: -width * (currentIndex - 1),
        useNativeDriver: true,
      }).start();
    }
  };

  const getCurrentMonthAndYear = () => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - currentIndex);
    const month = currentDate.toLocaleString('default', {month: 'long'});
    const year = currentDate.getFullYear();
    return `${month} ${year}`;
  };

  return (
    <View style={styles.container}>
      {data.length > 0 && (
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
              <View
                style={{
                  position: 'absolute',
                  bottom: 16,
                  left: width / 2 - 70,
                  zIndex: 9999999999,
                }}>
                {/* <Text
                  style={{
                    color: '#22774C',
                    fontWeight: '700', // Use string value for fontWeight
                    fontSize: 12,
                    fontFamily: 'Inter',
                  }}>
                  Fuel
                </Text>
                <Text
                  style={{
                    color: '#22774C',
                    fontWeight: '500', // Use string value for fontWeight
                    fontSize: 12,
                    fontFamily: 'Inter',
                    marginTop: -2,
                  }}>
                  {item.fuel_limit - item.available_fuel_limit}/
                  {item.fuel_limit} */}
                {/* </Text> */}
              </View>

              {/* <ConsumptionComponentReal
                total={item.fuel_limit}
                consumed={item.available_fuel_limit}
                navigation={navigation}
              /> */}
              <SalesComponent />
            </View>
          ))}
        </Animated.View>
      )}

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          onPress={handlePrev}
          // disabled={currentIndex === 0}
          disabled={true}
          style={{padding: 20}}>
          {/* {currentIndex === 0 ? <ChevLeftSmall /> : <ChevLeftGreenSmall />} */}
          <ChevLeftSmall />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={[styles.titleText, globalStyles.text]}>
            {t('homeScreen.salesOverview')}
          </Text>
          {/* <Text style={[styles.subtitleText, globalStyles.text]}>
            {getCurrentMonthAndYear()}
          </Text> */}
        </View>

        <TouchableOpacity
          onPress={handleNext}
          style={{padding: 20}}
          // disabled={currentIndex === data.length - 1}>
          disabled={true}>
          {/* {currentIndex === data.length - 1 ? (
            <ChevRightSmall />
          ) : (
            <ChevRigthGreenSmall />
          )} */}
          <ChevRightSmall />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 20,
    justifyContent: 'space-around',
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
  navigationContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 14,
  },
  titleContainer: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: 14,
    fontWeight: 'bold',
    // marginBottom: 12,
    color: colors.primaryText,
  },
  subtitleText: {
    fontSize: 10,
    color: colors.homeText,
  },
});

export default ConsumptionComponent;
