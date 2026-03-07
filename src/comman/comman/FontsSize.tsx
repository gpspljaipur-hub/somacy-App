import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { StyleSheet, Dimensions, PixelRatio, Platform } from 'react-native'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
// Standard reference dimensions (e.g., iPhone X / 11 Pro)
const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 812;
const RATIO = DESIGN_HEIGHT / DESIGN_WIDTH;

const hp = (heightPercent: number) => {
    return wp(heightPercent * RATIO);
};

// Use standard design width (375) for normalization instead of 320 for consistency
const scale = SCREEN_WIDTH / 375

export function normalize(size: number) {
    const newSize = size * scale
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
    }
}

const FontsSize = {
    size10: 10,
    size11: 11,
    size12: 12,
    size13: 13,
    size14: 14,
    size16: 16,
    size18: 18,
    size20: 20,
    size22: 22,
    size24: 24,
    size26: 26,
    size28: hp(3.6),
    size30: hp(3.85),
    size34: hp(4.38),
    size42: hp(5.38),

    ImageH12: hp(1.55),
    ImageH14: hp(1.81),
    ImageH16: hp(2.05),
    ImageH18: hp(2.33),
    ImageH20: hp(2.57),
    ImageH22: hp(2.85),
    ImageH24: hp(3.1),
    ImageH28: hp(3.6),
    ImageH30: hp(3.88),
    ImageH35: hp(4.53),
    ImageH38: hp(4.95),
    ImageH40: hp(5.14),
    ImageH45: hp(5.75),
    ImageH50: hp(6.42),
    ImageH55: hp(7.06),
    ImageH60: hp(7.7),
    ImageH65: hp(8.35),
    ImageH70: hp(9.0),
    ImageH80: hp(10.25),
    ImageH85: hp(10.9),
    ImageH90: hp(11.55),
    ImageH95: hp(12.17),
    ImageH100: hp(12.8),

    ImageW12: wp(3.1),
    ImageW14: wp(3.57),
    ImageW16: wp(4.1),
    ImageW18: wp(4.6),
    ImageW20: wp(5.1),
    ImageW22: wp(5.65),
    ImageW24: wp(6.1),
    ImageW28: wp(7.1),
    ImageW30: wp(7.7),
    ImageW35: wp(8.94),
    ImageW38: wp(9.7),
    ImageW40: wp(10.2),
    ImageW45: wp(11.48),
    ImageW50: wp(12.75),
    ImageW55: wp(14.03),
    ImageW60: wp(15.25),
    ImageW65: wp(10.2),
    ImageW70: wp(17.84),
    ImageW80: wp(20.65),
    ImageW85: wp(21.65),
    ImageW90: wp(22.95),
    ImageW95: wp(23.0),
    ImageW100: wp(25.45),

    normalize12: normalize(11.5),
    normalize14: normalize(13),
    normalize16: normalize(14.5),
    normalize18: normalize(16.5),
    normalize20: normalize(17.5),
    normalize22: normalize(19.5),
    normalize24: normalize(21)
}
export default FontsSize
