import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, StyleSheet, ActivityIndicator, RefreshControl, AppState, Text } from 'react-native';

interface Props {
  navigation: any
};

const ProfileLanding: React.FC<Props> = ({ navigation }) => {
  return (
    <View>
      <Text>This is profile landing</Text>
    </View>
  );
};

export default ProfileLanding;