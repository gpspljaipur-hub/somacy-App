import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

// Standard reference dimensions (e.g., iPhone X / 11 Pro)
// This ensures that height scales proportionally with width, avoiding distortion on different aspect ratios.
const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 812;
const RATIO = DESIGN_HEIGHT / DESIGN_WIDTH;

// Override hp to scale based on width, preserving aspect ratio of the design
const hp = (heightPercent: number) => {
  // Convert height percent to equivalent width percent based on the design aspect ratio
  return wp(heightPercent * RATIO);
};

const HWSize = {
  H_Height1: hp(0.1),
  H_Height2: hp(0.180),
  H_Height3: hp(0.600),
  H_Height10: hp(1),
  H_Height12: hp(2),
  H_Height15: hp(3),
  H_Height20: hp(3),
  H_Height18: hp(1.5),
  H_Height30: hp(3.1),
  H_Height33: hp(3.2),
  H_Height36: hp(4.6),
  H_Height40: hp(5.14),
  H_Height45: hp(5.75),
  H_Height50: hp(6.42),
  H_Height55: hp(7.06),
  H_Height60: hp(7.7),
  H_Height62: hp(7.95),
  H_Height65: hp(8.35),
  H_Height70: hp(9.0),
  H_Height80: hp(10.25),
  H_Height85: hp(10.9),
  H_Height90: hp(11.55),
  H_Height95: hp(12.17),
  H_Height100: hp(12.8),
  H_Height110: hp(14.1),
  H_Height120: hp(15.35),
  H_Height130: hp(16.6),
  H_Height140: hp(17.92),
  H_Height150: hp(19.25),
  H_Height160: hp(20.5),
  H_Height180: hp(23.05),
  H_Height200: hp(25.6),
  H_Height213: hp(27.3),
  H_Height220: hp(28.15),
  H_Height230: hp(29.45),
  H_Height235: hp(30.1),
  H_Height265: hp(33.95),
  H_Height250: hp(38.39),
  H_Height350: hp(45.39),
  H_Height375: hp(48.05),
  H_Height400: hp(58.05),

  W_Width10: wp(3.5),
  W_Width12: wp(4.2),
  W_Width15: wp(5.2),
  W_Width18: wp(6.3),

  W_Width20: wp(7),
  W_Width30: wp(7.2),
  W_Width33: wp(7.5),
  W_Width40: wp(10.2),
  W_Width45: wp(11.48),
  W_Width50: wp(12.75),
  W_Width55: wp(114.03),
  W_Width60: wp(15.25),
  W_Width62: wp(15.8),
  W_Width65: wp(16.6),
  W_Width70: wp(17.84),
  W_Width80: wp(20.65),
  W_Width85: wp(21.65),
  W_Width90: wp(22.95),
  W_Width95: wp(23.0),
  W_Width100: wp(25.45),
  W_Width110: wp(28.1),
  W_Width120: wp(30.6),
  W_Width140: wp(35.65),
  W_Width150: wp(38.2),
  W_Width160: wp(40.7),
  W_Width180: wp(45.8),
  W_Width200: wp(50.9),
  W_Width213: wp(54.32),
  W_Width220: wp(55.99),
  W_Width250: wp(63.66),
  W_Width350: wp(89.3),
  W_Width375: wp(95.55),
  W_Width390: wp(99.0),
  W_Width400: wp(100),
};
export default HWSize;
