import React, {useEffect} from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import {FillingStationCard} from '../../components';
// import CustomButton from '../../components/custom-button';
import {CustomButton} from '../components';
// import {Cancel, successPNG, successReceiptBG} from '../../assets';
import {Cancel} from '../assets/svgs';
import {successReceiptBG, successPNG} from '../assets/pngs';
// import {strings} from '../../utils/strings/strings';
import {useTranslation} from 'react-i18next';
import {colors} from '../utils/colors';
import TransactionHistoryComponent from '../components/transaction-history-component';
import {useSelector} from 'react-redux';
import {selectTransaction} from '../redux/transaction-slice';
import {
  selectCreatedAt,
  selectFuelType,
  selectLitreFuel,
  selectNozzlePrice,
  selectPlateNo,
  selectTransactionType,
  selectVehicleMake,
  selectVehicleModel,
  selectVehicleVariant,
} from '../redux/receipt-slice';
import {getFuelType} from '../enums/fuel-type';
import {hp} from '../utils/screen';

const RefillSuccessReceipt = ({navigation}) => {
  const fuelType = useSelector(selectFuelType);
  const litreFuel = useSelector(selectLitreFuel);
  const transactionType = useSelector(selectTransactionType);
  const nozzlePrice = useSelector(selectNozzlePrice);
  const createdAt = useSelector(selectCreatedAt);
  const vehicleMake = useSelector(selectVehicleMake);
  const vehicleModel = useSelector(selectVehicleModel);
  const vehiclePlate = useSelector(selectPlateNo);
  const vehicleVariant = useSelector(selectVehicleVariant);

  // const vehicleName = `${vehicleMake} ${vehicleModel} ${vehicleVariant}`;
  const transactionDateTime = new Date(createdAt);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     navigation.navigate('Home');
  //   }, 5000);

  //   return () => clearTimeout(timer); // Clear the timer if the component is unmounted
  // }, [navigation]);
  // const quantity = useSelector(selectTransaction);
  // const recieptItems = useSelector(selctRe)
  const {t} = useTranslation();
  // const fuelType = useSelector(selectFuelType);
  // const litreFuel = useSelector(selectLitreFuel);
  // const transactionType = useSelector(selectTransactionType);
  console.log('FuelType: ' + fuelType);
  console.log('Quantity: ' + litreFuel);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.navigate('Home')}>
        <Cancel />
      </TouchableOpacity>
      <View
        style={{
          height: '60%',
          backgroundColor: colors.tertiaryBackgroundColor,
          position: 'relative',
          top: -60,
        }}>
        <View
          style={{
            alignSelf: 'center',
            position: 'relative',
            top: '12%',
            zIndex: 10,
            height: 56,
            width: 56,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={successPNG}
            resizeMode="contain"
            style={{width: '200%', height: '200%'}}
          />
        </View>
        <ImageBackground
          source={successReceiptBG}
          resizeMode="cover"
          resizeMethod="scale"
          style={{
            height: '100%',
            elevation: 1,
            // paddingHorizontal: 20,
            justifyContent: 'center',
            overflow: 'hidden',
            paddingHorizontal: 20,
          }}>
          <Text style={styles.title}>{t('receipt.refillDone')}</Text>
          <Text style={styles.message}>
            {t('receipt.refillDoneDescription')}
          </Text>
          {/* <FillingStationCard isReviewEnabled={false} /> */}
          <TransactionHistoryComponent
            isCompact={false}
            fuelType={getFuelType(fuelType)}
            quantity={litreFuel}
            transactionType={transactionType}
            // vehicleName={vehicleName}
            vehicleName={`${vehicleMake ?? 'N/A'} ${vehicleModel ?? ''} ${
              vehicleVariant ?? ''
            }`}
            transactionDateTime={transactionDateTime}
            nozlePrice={nozzlePrice}
            numberPlate={vehiclePlate}
          />
          {/* <View style={{marginHorizontal: 20}}>
            <CustomButton text={'Continue'} />
          </View> */}
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.tertiaryBackgroundColor,
    justifyContent: 'center',
  },
  receiptBackground: {
    paddingHorizontal: 20,
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: hp(24),
    alignSelf: 'center',
    fontWeight: 'bold',
    color: colors.primaryText,
    marginBottom: 16,
  },
  message: {
    fontSize: hp(14),
    color: '#474747',
    marginBottom: 24,
    textAlign: 'center',
  },
  cancelButton: {
    position: 'absolute',
    right: 22,
    top: 13,
  },
});

export default RefillSuccessReceipt;
