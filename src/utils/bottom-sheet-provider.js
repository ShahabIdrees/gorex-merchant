import React, {
  createContext,
  useState,
  useCallback,
  useRef,
  useContext,
  useEffect,
} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import GeneralBottomSheet from '../components/general-bottom-sheet';

// import {FileRound, Lock, QRIconBottomSheet, Timer} from '../assets';

// Create the context
const BottomSheetContext = createContext();

// Provider component
export const BottomSheetProvider = ({children}) => {
  const bottomSheetRef = useRef(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [wasSheetDismissed, setWasSheetDismissed] = useState('');
  const [sheetConfig, setSheetConfig] = useState({
    bottomSheetName: '',
    snapPoint: '50%',
    params: {},
  });

  const [contentHeight, setContentHeight] = useState(300); // initial height
  const [fixedSnapPoint, setFixedSnapPoint] = useState(null); // to store fixed snap point if provided

  // Function to open the bottom sheet with specific arguments
  const openBottomSheet = useCallback(
    (bottomSheetName, snapPoint = '50%', params = {}) => {
      setSheetConfig({bottomSheetName, snapPoint, params});
      setFixedSnapPoint(snapPoint); // set fixed snap point
      setIsSheetOpen(true);
      setWasSheetDismissed('');
      bottomSheetRef.current?.snapToIndex(0);
    },
    [],
  );

  // Add a state to track the closing action
  const [isClosing, setIsClosing] = useState(false);

  const closeBottomSheet = useCallback(
    animationConfigs => {
      setWasSheetDismissed(sheetConfig.bottomSheetName);
      bottomSheetRef.current?.close(animationConfigs);

      // Reset the state before closing
      setSheetConfig({
        bottomSheetName: '',
        snapPoint: '50%',
        params: {},
      });

      // Set the isClosing state to true after initiating the close action
      setIsClosing(true);
    },
    [sheetConfig.bottomSheetName],
  );

  // Use useEffect to update isSheetOpen after the bottom sheet has been closed
  useEffect(() => {
    if (isClosing) {
      // Perform any additional actions if needed before updating isSheetOpen

      // Simulate the completion of the close action (assuming some delay)
      const timeout = setTimeout(() => {
        setIsSheetOpen(false);
        setIsClosing(false);
      }, 30); // Adjust the delay to match the close animation duration if necessary

      // Cleanup function to clear the timeout if the component unmounts
      return () => clearTimeout(timeout);
    }
  }, [isClosing]);

  // Render specific content based on bottomSheetName
  const renderSheetContent = useCallback(() => {
    switch (sheetConfig.bottomSheetName) {
      case 'Filter':
        return <Filter {...sheetConfig.params} />;
      case 'FeedbackCompact':
        return <FeedbackCompact {...sheetConfig.params} />;
      case 'Feedback':
        return <FeedbackCompact isCompact={false} {...sheetConfig.params} />;
      case 'TPinVerification':
        return (
          <GeneralBottomSheet
            content={<TpinSheetContent {...sheetConfig.params} />}
            icon={<Lock />}
          />
        );
      case 'TPinVerificationQR':
        return (
          <GeneralBottomSheet
            content={
              <TpinSheetContent
                isPresentedFromQR={true}
                {...sheetConfig.params}
              />
            }
            icon={<Lock />}
          />
        );
      case 'QRSheet':
        return (
          <GeneralBottomSheet
            content={<QrSheetContent {...sheetConfig.params} />}
            icon={<QRIconBottomSheet />}
          />
        );
      case 'TimerSheet':
        return (
          <GeneralBottomSheet
            content={<TimerSheetContent {...sheetConfig.params} />}
            icon={<Timer />}
          />
        );
      case 'DeactivateSheet':
        return <DeactivateSheetContent {...sheetConfig.params} />;
      case 'OTPSheet':
        return (
          <GeneralBottomSheet
            content={<OtpSheetContent {...sheetConfig.params} />}
            icon={<Lock />}
          />
        );
      case 'initiateRequestSheet':
        return (
          <GeneralBottomSheet
            content={<InitiateRequestSheetContent {...sheetConfig.params} />}
            icon={<FileRound />}
          />
        );
      case 'initiateRequestSheetQR':
        return (
          <GeneralBottomSheet
            content={<InitiateRequestSheetContent {...sheetConfig.params} />}
            icon={<FileRound />}
          />
        );
      case 'TransactionFailedSheet':
        return <TransactionFailedScreen />;
      default:
        return null;
    }
  }, [sheetConfig.bottomSheetName, sheetConfig.params]);

  const handleClosePress = () => {
    closeBottomSheet();
  };

  return (
    <BottomSheetContext.Provider
      value={{
        isSheetOpen,
        wasSheetDismissed,
        openBottomSheet,
        closeBottomSheet,
      }}>
      {children}
      {isSheetOpen && (
        <TouchableWithoutFeedback onPress={handleClosePress}>
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            }}
          />
        </TouchableWithoutFeedback>
      )}
      {isSheetOpen && (
        <BottomSheet
          style={{
            zIndex: 10,
          }}
          ref={bottomSheetRef}
          keyboardBehavior="fillParent"
          enablePanDownToClose={true}
          overlayStyle={{backgroundColor: 'black'}}
          handleIndicatorStyle={{display: 'none'}}
          backgroundStyle={{backgroundColor: 'transparent'}}
          index={0}
          snapPoints={[fixedSnapPoint || contentHeight]} // use fixed snap point if provided
          onClose={closeBottomSheet}>
          <View
            onLayout={event => {
              const {height} = event.nativeEvent.layout;
              if (!fixedSnapPoint) {
                setContentHeight(height);
              }
            }}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {renderSheetContent()}
          </View>
        </BottomSheet>
      )}
    </BottomSheetContext.Provider>
  );
};

// Custom hook to use the BottomSheetContext
export const useBottomSheet = () => useContext(BottomSheetContext);
