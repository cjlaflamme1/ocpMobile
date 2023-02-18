import React from 'react';
import { View, Image, ImageSourcePropType, Pressable } from 'react-native';
import globalStyles from '../styles/global';
import layoutStyles from '../styles/layout';
import groupCardStyles from '../styles/screenStyles/groups/groupCard';
import CustomText from './CustomText';

interface Props {
  buttonText: string,
  callback: Function,
};

const PrimaryButton: React.FC<Props> = (props: Props) => {
  const {
    buttonText,
    callback,
  } = props;

  return (
    <Pressable
      style={[inputStyle.primaryButton]}
      onPress={() => callback}
    >
      <CustomText bold style={[{ color: 'white' }]}>{buttonText}</CustomText>
    </Pressable>
  );
};

export default PrimaryButton;

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
  }
});