import React, { useState } from 'react';
import { Pressable, RefreshControl, ScrollView, View } from 'react-native';
import globalStyles from '../../styles/global';
import layoutStyles from '../../styles/layout';
import CustomText from '../../components/CustomText';
import NotificationItem from '../../components/notifications/NotificationItem';
import { NavigationProp } from '@react-navigation/native';

interface Props {
  navigation: NavigationProp<any, any>;
};

const NotificationLanding: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [radioSelector, setRadioSelector] = useState(0);
  const onRefresh = () => {
    setRefreshing(true);
    // Refresh functions here
    setRefreshing(false);
  }
  return (
    <View style={[layoutStyles.screenContainer]}>
      <ScrollView showsVerticalScrollIndicator={false}  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View>
          <CustomText>custom notifications here</CustomText>
        </View>
        <NotificationItem
          notification={
            {
              title: 'Test Notification',
              description: 'You have a message in this place.',
              eventId: 'lkjslfjlkja as',
              viewed: false,
            }
          }
          navigation={navigation}
        />
      </ScrollView>
    </View>
  );
};

export default NotificationLanding;