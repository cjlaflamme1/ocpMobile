import React from 'react';
import { View, Image, ImageSourcePropType, Pressable } from 'react-native';
import globalStyles from '../styles/global';
import layoutStyles from '../styles/layout';
import groupCardStyles from '../styles/screenStyles/groups/groupCard';
import CustomText from './CustomText';

interface Props {
  buttonText: string,
  callback: Function,
  outline?: boolean,
};

const PrimaryButton: React.FC<Props> = (props: Props) => {
  const {
    buttonText,
    callback,
    outline,
  } = props;

  if (outline) {
    return (
      <Pressable
        // style={[inputStyle.primaryButton, inputStyle.outlineButton]}
        style={({ pressed }) => {
          if (pressed) {
            return [inputStyle.primaryButton, inputStyle.outlineButton, inputStyle.pressed];
          } else {
            return [inputStyle.primaryButton, inputStyle.outlineButton];
          }
        }}
        onPress={() => callback()}
      >
        <CustomText bold style={[{ color: '#CB1406' }]}>{buttonText}</CustomText>
      </Pressable>
    )
  }
  return (
    <Pressable
      // style={[inputStyle.primaryButton]}
      style={({ pressed }) => {
        if (pressed) {
          return [inputStyle.primaryButton, inputStyle.pressed];
        } else {
          return [inputStyle.primaryButton];
        }
      }}
      onPress={() => callback()}
    >
      <CustomText bold style={[{ color: 'white' }]}>{buttonText}</CustomText>
    </Pressable>
  );
};

export default PrimaryButton;

PrimaryButton.defaultProps = {
  outline: false,
}

import { StyleSheet } from 'react-native';

const inputStyle = StyleSheet.create({
  primaryButton: {
    backgroundColor: '#CB1406',
    width: '100%',
    height: 55,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  outlineButton: {
    backgroundColor: '#FAFAFA',
    borderColor: '#CB1406',
    borderWidth: 1,
  },
  pressed: {
    backgroundColor: "#e52e20",
  }
});