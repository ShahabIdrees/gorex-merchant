//ERROR Code: 24
//suggests that the transaction type is off prime and expired
//Fix this on urgent basis

import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../utils/colors';
import globalStyles from '../theme';
import {useTranslation} from 'react-i18next';
import {Print} from '../assets/icons';
import {getFuelType} from '../enums/fuel-type';

const TransactionHistoryComponent = ({
  isCompact = true,
  numberPlate = '',
  fuelType = 'Superair',
  vehicleName = 'Honda City',
  transactionDateTime = '17 May 2024, 8:43',
  nozlePrice = '0',
  quantity = '29.72637824',
  transactionType = 'undefined',
}) => {
  console.log('Fuel type is : ' + fuelType);
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.tagContainer}>
        <Text
          style={[styles.tag, {color: '#AD5225', backgroundColor: '#F5F5EC'}]}>
          {numberPlate}
        </Text>
        <Text
          style={[styles.tag, {color: '#25AD6E', backgroundColor: '#ECF5F1'}]}>
          {transactionType}
        </Text>
        <Text
          style={[styles.tag, {color: '#5225AD', backgroundColor: '#ECEDF5'}]}>
          {/* {fuelType === 1 ? 'super' : fuelType === 2 ? 'diesel' : 'N/A'} */}
          {fuelType}
        </Text>
        {/* <Text
          style={[styles.tag, {color: '#25A2AD', backgroundColor: '#ECF5F0'}]}>
          HatchBack
        </Text> */}
      </View>
      <Text style={styles.vehicleName}>{vehicleName}</Text>
      <Text style={styles.date}>{transactionDateTime}</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>
            {t('transactionDetails.nozzlePrice')}
          </Text>
          <Text style={styles.statValue}>
            Rs {parseFloat(nozlePrice).toFixed(2)}
          </Text>
        </View>
        <View
          style={[
            styles.statItem,
            {
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderColor: colors.borderColor,
            },
          ]}>
          <Text style={styles.statLabel}>
            {t('transactionDetails.quantity')}
          </Text>
          <Text style={styles.statValue}>
            {parseFloat(quantity).toFixed(2)} Ltr
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>
            {t('transactionDetails.totalAmount')}
          </Text>
          <Text style={styles.statValue}>
            Rs {(quantity * nozlePrice).toFixed(2)}
          </Text>
        </View>
      </View>
      {isCompact && (
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
            backgroundColor: colors.brandAccentColor,
            width: '100%',
            height: 40,
            alignItems: 'center',
            borderRadius: 8,
            marginTop: 24,
          }}
          onPress={() => {
            // navigation.navigate('StationDetails');
          }}>
          {/* <Navigation /> */}
          <Print />
          <Text
            style={[
              {
                marginLeft: 10,
                color: colors.white,
                fontWeight: '500',
                fontFamily: 'Inter',
              },
              globalStyles.text,
            ]}>
            {t('historyScreen.print')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.borderColor,
    elevation: 1,
    marginHorizontal: 20,
  },
  tagContainer: {
    flexDirection: 'row',
  },
  tag: {
    marginHorizontal: 2,
    // backgroundColor: 'red',
    borderRadius: 16,
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 16,
    fontFamily: 'Inter',
    paddingHorizontal: 8,
    // color: 'white',
  },
  vehicleName: {
    marginTop: 8,
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter',
    lineHeight: 20,
  },
  date: {
    marginTop: 8,
    color: colors.primaryText,
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Inter',
    lineHeight: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statItem: {flex: 1, paddingHorizontal: 8, paddingVertical: 4},
  statLabel: {
    color: colors.primaryText,
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Inter',
    lineHeight: 16,
  },
  statValue: {
    color: colors.primaryText,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Inter',
    lineHeight: 16,
  },
});

export default TransactionHistoryComponent;
