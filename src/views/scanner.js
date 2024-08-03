import React, {useRef, useEffect, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  Text,
  Button,
  Dimensions,
  BackHandler,
  ActivityIndicator,
  LayoutAnimation,
  Alert,
} from 'react-native';
import {colors} from '../utils/colors';
import {Base64} from 'js-base64';

import {ArrowLeft, CameraIcon} from '../assets/icons';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import {usePermissions, EPermissionTypes} from '../utils/use-permissions';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import TransactionService from '../api/transaction';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectFuelStationUserDetailsId,
  selectToken,
  selectUser,
  selectUserIdFuelStationUser,
} from '../redux/user-slice';
import {ErrorMessageComponent} from '../components';
import {
  setFuelType,
  setLitreFuel,
  setReceipt,
  setTransactionType,
} from '../redux/receipt-slice';
import {handleSessionTimeout} from '../utils/helper-functions';
import {getFuelType} from '../enums/fuel-type';
import {t} from 'i18next';

const {width} = Dimensions.get('window');

const Scanner = ({navigation}) => {
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [isCameraShown, setIsCameraShown] = useState(true);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [flash, setFlash] = useState('off');
  const [scannedContent, setScannedContent] = useState('');
  const {askPermissions} = usePermissions(EPermissionTypes.CAMERA);
  const device = useCameraDevice('back');
  const camera = useRef(null);
  const isFocused = useIsFocused();
  const [isCodeScanned, setIsCodeScanned] = useState(false);
  const user = useSelector(selectUser);
  const [isOnPrimeTransaction, setIsOnPrimeTransaction] = useState(true);
  const token = useSelector(selectToken);
  const user_id_fuel_station_user = useSelector(selectUserIdFuelStationUser);
  const fuel_station_user_detail_id = useSelector(
    selectFuelStationUserDetailsId,
  );
  const fuel_station_id = user?.fuel_station_id;
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    let timer;
    if (errorMessage) {
      timer = setTimeout(() => {
        setErrorMessage(null);
      }, 4000); // 4000 milliseconds = 4 seconds
    }
    return () => clearTimeout(timer);
  }, [errorMessage]);
  // useFocusEffect(
  //   React.useCallback(() => {
  //     // Reset error message
  //     setErrorMessage(null);

  //     // Restart camera
  //     setIsCameraInitialized(false);
  //     setIsCodeScanned(false);
  //     setIsActive(true);

  //     return () => {
  //       // Clean up or reset states if necessary
  //       setIsActive(false);
  //     };
  //   }, []),
  // );
  const initiateTransaction = async scannedData => {
    try {
      const transaction_type = scannedData?.transaction_type;

      // Common fields for both "On Prime" and "Off Prime"
      const transactionData = {
        user_id_fuel_station_user,
        fuel_station_user_detail_id,
        fuel_station_id,
        transaction_type,
      };

      if (transaction_type === 'On Prime') {
        // Fields specific to "On Prime" transactions
        Object.assign(transactionData, {
          litre_fuel: scannedData?.litreFuel,
          user_id_employee_corporate: scannedData?.userId,
          employee_id: scannedData?.employeeId,
          vehicle_id: scannedData?.vehicleId,
          corporate_id: scannedData?.corporateId,
          fuel_type: getFuelType(scannedData?.fuelType),
          transaction_unique_id: scannedData?.transactionId,
        });
        setIsOnPrimeTransaction(true);
      } else if (transaction_type === 'Off Prime') {
        // Fields specific to "Off Prime" transactions
        Object.assign(transactionData, {
          static_qr_id: scannedData?.id,
        });
        setIsOnPrimeTransaction(false);
      }

      const response = await TransactionService.postTransaction(
        token,
        transactionData,
      );
      setIsCodeScanned(false);
      setIsActive(true);

      if (response.error_code === 0) {
        const vehicleData = response.result?.vehicle?.[0];
        const receiptData = {
          transaction_type: response.result?.transaction_type,
          litre_fuel: response.result?.litre_fuel,
          fuel_type: response.result?.fuel_type,
          nozzle_price: response.result?.nozzle_price,
          createdAt: response.result?.createdAt,
          vehicle_make: vehicleData?.vehicle_make_id?.make || 'Unknown',
          vehicle_model: vehicleData?.vehicle_model_id?.model || 'Unknown',
          plate_no: vehicleData?.plate_no || 'Unknown',
          vehicle_variant:
            vehicleData?.vehicle_variant_id?.variant || 'Unknown',
        };
        dispatch(setReceipt(receiptData));
        navigation.navigate('RefillSuccessReceipt');
      } else if (response.error_code === 8) {
        Alert.alert(
          'Session timed out',
          'Please login again to continue',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ],
          {cancelable: false},
        );
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      console.error('Transaction initiation failed:', error);
    }
  };

  useEffect(() => {
    askPermissions()
      .then(result => {
        setPermissionStatus(result.type);
      })
      .catch(error => {
        setPermissionStatus(error.type);
      });
  }, [askPermissions]);

  useEffect(() => {
    const handleBackPress = () => {
      setIsCameraShown(false);
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  const requestPermissionAgain = () => {
    askPermissions()
      .then(result => setPermissionStatus(result.type))
      .catch(error => setPermissionStatus(error.type));
  };

  const dispatch = useDispatch();

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      if (codes.length > 0) {
        try {
          // Attempt to decode and parse the scanned data
          const decodedData = Base64.decode(codes[0].value);
          const scannedData = JSON.parse(decodedData);

          // Set the scanned content and update state
          setScannedContent(scannedData);
          setIsActive(false);
          setIsCodeScanned(true);

          // Check if the scanned data contains an 'id' field
          if (!scannedData?.id) {
            setIsOnPrimeTransaction(true);
          } else {
            setIsOnPrimeTransaction(false);
          }

          // Initiate the transaction with the scanned data
          initiateTransaction(scannedData);

          console.log('Scanned data:', JSON.stringify(scannedData));
        } catch (error) {
          // Handle errors during decoding or parsing
          // setErrorMessage(
          //   error.message || 'An error occurred while scanning the QR code',
          // );
          console.error('Error parsing scanned QR code:', error);

          // Optional: Provide user feedback
          Alert.alert(
            'Error',
            'Failed to process the QR code. Please try again.',
          );
        }
      }
    },
  });

  useEffect(() => {
    if (isCameraInitialized) {
      setIsActive(true);
      setFlash('off');
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    } else {
      setIsActive(false);
    }
  }, [isCameraInitialized]);

  const onInitialized = () => {
    setIsCameraInitialized(true);
  };

  return isCodeScanned ? (
    <ActivityIndicator size="large" color="#0000ff" />
  ) : (
    <SafeAreaView style={styles.container}>
      <>
        {errorMessage ? <ErrorMessageComponent text={errorMessage} /> : null}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}>
            <ArrowLeft color={colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerText}>{t('scanner.scanQR')}</Text>
        </View>
        {permissionStatus === null ? (
          <View style={styles.loadingContainer}>
            <Text>Requesting camera permission...</Text>
          </View>
        ) : permissionStatus === 'denied' || permissionStatus === 'blocked' ? (
          <View style={styles.permissionContainer}>
            <Text style={styles.permissionText}>
              Grant camera permission to scan the QR code
            </Text>
            <Button title="Grant Permission" onPress={requestPermissionAgain} />
          </View>
        ) : (
          <View style={styles.cameraContainer}>
            {device && (
              <Camera
                torch={flash}
                onInitialized={onInitialized}
                ref={camera}
                photo={false}
                style={styles.camera}
                device={device}
                codeScanner={codeScanner}
                isActive={isActive && isCameraInitialized}
                onStopped={() => {
                  console.log('Camera Stopped');
                }}
              />
            )}
            <View style={styles.overlay}>
              <View style={styles.scanArea}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
                <View style={styles.promptContainer}>
                  <CameraIcon />
                  <Text style={styles.scanPrompt}>
                    {t('scanner.cameraPrompt')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingVertical: 20,
  },
  headerContainer: {
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 30,
    padding: 20,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    width: '100%',
    color: colors.headingText,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    marginBottom: 20,
    fontSize: 16,
  },
  closeButton: {},
  cameraContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: '10%',
    // paddingVertical: '40%',
    flex: 1,
    // borderWidth: 2,
    // borderColor: 'green',
  },
  camera: {
    width: '100%',
    height: '150%',
    flex: 1,
    // position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 2,
    // borderColor: 'red',
  },
  scanArea: {
    width: width * 0.5,
    height: width * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    // borderWidth: 2,
    // borderColor: 'red',
    bottom: -20,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: 'white',
  },
  topLeft: {
    borderLeftWidth: 2,
    borderTopWidth: 2,
    top: 0,
    left: 0,
  },
  topRight: {
    borderRightWidth: 2,
    borderTopWidth: 2,
    top: 0,
    right: 0,
  },
  bottomLeft: {
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    bottom: 0,
    left: 0,
  },
  bottomRight: {
    borderRightWidth: 2,
    borderBottomWidth: 2,
    bottom: 0,
    right: 0,
  },
  promptContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    // borderWidth: 2,
    // borderColor: 'red',
    top: -110,
  },
  scanPrompt: {
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
    width: width * 0.6,
  },
  scannedContentContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  scannedContentText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default Scanner;
