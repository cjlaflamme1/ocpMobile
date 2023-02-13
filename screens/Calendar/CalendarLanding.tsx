import React from 'react';
import { View } from 'react-native';
import CustomText from '../../components/CustomText';

interface Props {
  navigation: any
};

const CalendarLanding: React.FC<Props> = ({ navigation }) => {
  return (
    <View>
      <CustomText>This is calendar landing</CustomText>
    </View>
  );
};

export default CalendarLanding;