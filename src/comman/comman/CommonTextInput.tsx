import React from 'react';
import { TextInput as RNTextInput, StyleSheet, TextInputProps } from 'react-native';
import { Colors } from './Colors';

type Props = TextInputProps & { containerStyle?: any };

const CommonTextInput: React.FC<Props> = ({ style, containerStyle, ...rest }) => {
  return <RNTextInput style={[styles.input, style]} placeholderTextColor={Colors.lightGreyText} {...rest} />;
};

export default CommonTextInput;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: Colors.surfaceAlt || '#eee',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    color: Colors.text,
  },
});
