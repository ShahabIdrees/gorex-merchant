import {PixelRatio} from 'react-native';
import {ScreenHeight} from './constants';

export const HeightRatio = ScreenHeight / 826;
export const hp = height => {
  return PixelRatio.roundToNearestPixel(height * HeightRatio);
};
