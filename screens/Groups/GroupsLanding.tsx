import React from 'react';
import { View, Text } from 'react-native';
import CustomText from '../../components/CustomText';

interface Props {
  navigation: any
};

const GroupsLanding: React.FC<Props> = ({ navigation }) => {
  return (
    <View>
      <CustomText>This is groups landing</CustomText>
    </View>
  );
};

export default GroupsLanding;