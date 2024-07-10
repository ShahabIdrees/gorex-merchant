import {Dimensions, Platform} from 'react-native';

const {width: ScreenWidth, height: ScreenHeight} = Dimensions.get('window');
export {ScreenWidth, ScreenHeight};
export const isIos = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
