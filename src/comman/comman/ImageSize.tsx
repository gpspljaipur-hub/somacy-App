import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { StyleSheet, Dimensions, PixelRatio } from 'react-native'

const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 812;
const RATIO = DESIGN_HEIGHT / DESIGN_WIDTH;

const hp = (heightPercent: number) => {
    return wp(heightPercent * RATIO);
};

const ImageSize = {
    ImageH12: hp(1.55),
    ImageH14: hp(1.81),
    ImageH16: hp(2.05),
    ImageH18: hp(2.33),
    ImageH20: hp(2.57),
    ImageH22: hp(2.85),
    ImageH24: hp(3.1),
    ImageH25: hp(3.2),
    ImageH26: hp(3.35),
    ImageH28: hp(3.6),
    ImageH30: hp(3.88),
    ImageH32: hp(4.1),
    ImageH35: hp(4.53),
    ImageH38: hp(4.95),
    ImageH40: hp(5.14),
    ImageH45: hp(5.75),
    ImageH50: hp(6.42),
    ImageH52: hp(6.67),
    ImageH55: hp(7.06),
    ImageH60: hp(7.7),
    ImageH65: hp(8.35),
    ImageH68: hp(8.71),
    ImageH70: hp(9.0),
    ImageH75: hp(9.62),
    ImageH80: hp(10.25),
    ImageH85: hp(10.9),
    ImageH90: hp(11.55),
    ImageH95: hp(12.17),
    ImageH99: hp(12.69),
    ImageH100: hp(12.8),
    ImageH115: hp(14.75),

    ImageW12: wp(3.1),
    ImageW14: wp(3.57),
    ImageW16: wp(4.1),
    ImageW18: wp(4.6),
    ImageW20: wp(5.1),
    ImageW22: wp(5.65),
    ImageW24: wp(6.1),
    ImageW25: wp(6.4),
    ImageW26: wp(6.7),
    ImageW28: wp(7.1),
    ImageW30: wp(7.7),
    ImageW32: wp(7.64),
    ImageW35: wp(8.94),
    ImageW38: wp(9.7),
    ImageW40: wp(10.2),
    ImageW45: wp(11.48),
    ImageW50: wp(12.75),
    ImageW52: wp(13.2),
    ImageW55: wp(14.03),
    ImageW60: wp(15.25),
    ImageW65: wp(16.6),
    ImageW68: wp(17.35),
    ImageW70: wp(17.84),
    ImageW75: wp(19.2),
    ImageW80: wp(20.65),
    ImageW85: wp(21.65),
    ImageW90: wp(22.95),
    ImageW95: wp(23.0),
    ImageW99: wp(25.25),
    ImageW100: wp(25.45),
    ImageW115: wp(32.32),
    ImageW120: wp(32.35)
}
export default ImageSize
