import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  navigation: any
};

const GroupsLanding: React.FC<Props> = ({ navigation }) => {
  return (
    <View>
      <Text>This is groups landing</Text>
    </View>
  );
};

export default GroupsLanding;