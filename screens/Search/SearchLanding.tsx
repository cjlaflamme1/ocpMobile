import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  navigation: any
};

const SearchLanding: React.FC<Props> = ({ navigation }) => {
  return (
    <View>
      <Text>This is search landing</Text>
    </View>
  );
};

export default SearchLanding;