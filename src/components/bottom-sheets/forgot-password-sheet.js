import React, {useEffect} from 'react';
import {
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import {useBottomSheet} from '../../utils/bottom-sheet-provider';
import {useTranslation} from 'react-i18next';
// import globalStyles from '../theme';

const ForgotPasswordSheet = () => {
  const {openBottomSheet, closeBottomSheet} = useBottomSheet();
  const handleYesPressed = () => {
    openBottomSheet('OTPSheet', 770);
  };
  const {t} = useTranslation();
  useEffect(() => {
    const backAction = () => {
      closeBottomSheet();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [closeBottomSheet]);
  return (
    <View style={styles.container}>
      {/* <Deactivate style={{marginTop: 16, alignSelf: 'center'}} /> */}
      <View style={styles.promptContainer}>
        <Text
          style={[
            styles.prompt,
            //  globalStyles.text
          ]}>
          {t('deletePopup.areYouSure')}
        </Text>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={[styles.button, styles.yesButton]}
            onPress={handleYesPressed}>
            <Text
              style={[
                {color: colors.white, fontSize: 12, fontWeight: '400'},
                // globalStyles.text,
              ]}>
              {t('deletePopup.yes')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text
              style={[
                {color: colors.darkText, fontSize: 12, fontWeight: '400'},
                // globalStyles.text,
              ]}>
              {t('deletePopup.no')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingVertical: 24,
    backgroundColor: colors.mainBackgroundColor,
    flex: 1,
    width: '100%',
    // alignItems: 'center',
    borderTopEndRadius: 24,
    borderTopStartRadius: 24,
    // justifyContent: 'center',
  },
  promptContainer: {
    marginTop: 32,
  },
  prompt: {
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Inter',
    lineHeight: 24,
    color: colors.primaryTextColor,
    width: '100%',
    // textAlign: 'center',
  },
  button: {
    paddingVertical: 11,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.inputBorderNormal,
    // width: '50%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  yesButton: {
    marginRight: 16,
    backgroundColor: colors.brandAccentColor,
    borderWidth: 0,
  },
});

export default ForgotPasswordSheet;
