import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  navigation: any
};

const CalendarLanding: React.FC<Props> = ({ navigation }) => {
  return (
    <View>
      <Text>This is calendar landing</Text>
    </View>
  );
};

export default CalendarLanding;