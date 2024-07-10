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
      return true; // Prevent default behavior
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
        setScannedContent(codes[0].value);
        setIsActive(false);
        setTimeout(() => {
          setIsActive(true);
        }, 500);
      }
    },
  });

  useEffect(() => {
    let timeout;

    if (isCameraInitialized) {
      timeout = setTimeout(() => {
        setIsActive(true);
        setFlash('off');
      }, 0);
    }
    setIsActive(false);
    return () => {
      clearTimeout(timeout);
    };
  }, [isCameraInitialized]);

  const onInitialized = () => {
    setIsCameraInitialized(true);
    console.log('Camera initialized');
  };

  return (
    <SafeAreaView style={styles.container}>
      <>
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
        {scannedContent ? (
          <View style={styles.scannedContentContainer}>
            <Text style={styles.scannedContentText}>{scannedContent}</Text>
          </View>
        ) : null}
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
