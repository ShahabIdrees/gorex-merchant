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
} from 'react-native';
import {colors} from '../utils/colors';
import {ArrowLeft, CameraIcon} from '../assets/icons';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import {usePermissions, EPermissionTypes} from '../utils/use-permissions';
import {useIsFocused} from '@react-navigation/native';
import TransactionService from '../api/transaction';
import {useSelector} from 'react-redux';
import {
  selectFuelStationUserDetailsId,
  selectToken,
  selectUser,
  selectUserIdFuelStationUser,
} from '../redux/user-slice';
import {ErrorMessageComponent} from '../components';

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
  const [isOnPrimeTransaction, setIsOnPrimeTransaction] = useState(false);
  const token = useSelector(selectToken);
  const user_id_fuel_station_user = useSelector(selectUserIdFuelStationUser);
  const fuel_station_user_detail_id = useSelector(
    selectFuelStationUserDetailsId,
  );
  const fuel_station_id = user?.fuel_station_id;
  const [errorMessage, setErrorMessage] = useState(null);
  const initiateTransaction = async scannedData => {
    console.log('Parsed scanned data: ', scannedData); // Add this line
    const transaction_type = isOnPrimeTransaction ? 'On Prime' : 'Off Prime';
    const transactionData = {
      user_id_fuel_station_user,
      fuel_station_user_detail_id,
      fuel_station_id,
      transaction_type,
      ...(isOnPrimeTransaction
        ? {
            //Daily limit error should use 1
            // litre_fuel: 1,
            litre_fuel: scannedData?.litreFuel,
            user_id_employee_corporate: scannedData?.userId,
            employee_id: scannedData?.employeeId,
            vehicle_id: scannedData?.vehicleId,
            corporate_id: scannedData?.corporateId,
            // fuel_type: scannedData?.fuelType,
            //mismatch on the backend "Sending Super receiveing 1"
            fuel_type: 1,
          }
        : {
            static_qr_id: scannedData?.static_qr_id,
          }),
    };

    console.log('Transaction Data:', transactionData); // Add this line

    try {
      const response = await TransactionService.postTransaction(
        token,
        transactionData,
      );
      console.log('Transaction response:', response);
      setIsCodeScanned(false);
      setIsActive(true);
      if (response.error_code === 0) {
        setIsActive(false);
        navigation.navigate('RefillSuccessReceipt');
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
        console.log('Camera permission status:', result.type);
      })
      .catch(error => {
        setPermissionStatus(error.type);
        console.log('Camera permission error:', error);
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

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      if (codes.length > 0) {
        console.log('Scanned QR Code:', codes[0].value);
        try {
          const scannedData = JSON.parse(codes[0].value);
          console.log('Parsed Scanned Data:', scannedData); // Add this line
          setScannedContent(scannedData);
          setIsActive(false);
          setIsCodeScanned(true);
          setIsOnPrimeTransaction(!scannedData?.static_qr_id);
          initiateTransaction(scannedData); // Pass scannedData to initiateTransaction
        } catch (error) {
          setErrorMessage(error);
          console.error('Error parsing scanned QR code:', error);
        }
      }
    },
  });

  useEffect(() => {
    if (isFocused && isCameraInitialized) {
      setIsActive(true);
      setFlash('off');
    } else {
      setIsActive(false);
    }
  }, [isFocused, isCameraInitialized]);

  const onInitialized = () => {
    setIsCameraInitialized(true);
    console.log('Camera initialized');
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
            onPress={() => setIsCameraShown(false)}>
            <ArrowLeft color={colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Scan QR Code</Text>
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
            {isFocused && device && (
              <Camera
                torch={flash}
                onInitialized={onInitialized}
                ref={camera}
                photo={false}
                style={styles.camera}
                device={device}
                codeScanner={codeScanner}
                isActive={isActive && isFocused && isCameraInitialized}
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
                    Please move your camera over another device’s screen
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
        {/* {scannedContent ? (
          <View style={styles.scannedContentContainer}>
            <Text style={styles.scannedContentText}>
              {JSON.stringify(scannedContent)}
            </Text>
          </View>
        ) : null} */}
      </>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 30,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: width * 0.75,
    height: 450,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: width * 0.5,
    height: width * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
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
    top: -115,
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
