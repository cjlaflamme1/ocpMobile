import React from 'react';
import { View, Text } from 'react-native';
import CustomText from '../../components/CustomText';

interface Props {
  navigation: any
};

const SearchLanding: React.FC<Props> = ({ navigation }) => {
  return (
    <View>
      <CustomText>This is search landing</CustomText>
    </View>
  );
};

export default SearchLanding;