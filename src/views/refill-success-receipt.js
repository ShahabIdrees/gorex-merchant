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

const RefillSuccessReceipt = ({navigation}) => {
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     navigation.navigate('Home');
  //   }, 5000);

  //   return () => clearTimeout(timer); // Clear the timer if the component is unmounted
  // }, [navigation]);
  const {t} = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}>
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
          }}>
          <Text style={styles.title}>{t('receipt.refillDone')}</Text>
          <Text style={styles.message}>
            {t('receipt.refillDoneDescription')}
          </Text>
          {/* <FillingStationCard isReviewEnabled={false} /> */}
          <TransactionHistoryComponent />
          <View style={{marginHorizontal: 20}}>
            <CustomButton text={'Continue'} />
          </View>
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
    fontSize: 24,
    alignSelf: 'center',
    fontWeight: 'bold',
    color: colors.primaryTextColor,
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
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
