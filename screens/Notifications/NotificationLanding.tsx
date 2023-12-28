import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import layoutStyles from '../../styles/layout';
import CustomText from '../../components/CustomText';
import NotificationItem from '../../components/notifications/NotificationItem';
import { NavigationProp } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getNotificationsAsync } from '../../store/notificationSlice';

interface Props {
  navigation: NavigationProp<any, any>;
};

const NotificationLanding: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notificationState.notifications);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getNotificationsAsync());
    setRefreshing(false);
  }

  useEffect(() => {
    dispatch(getNotificationsAsync());
  }, [navigation]);

  return (
    <View style={[layoutStyles.screenContainer]}>
      <ScrollView showsVerticalScrollIndicator={false}  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {
          notifications &&
          notifications.length > 0 ?
          notifications
            .slice()
            .sort((a, b) => a.createdAt.valueOf() < b.createdAt.valueOf() ? 1 : -1)
            .map((notification, index) => (
            <NotificationItem
              key={`notification-item-${index}-${notification.id}`}
              notification={notification}
              navigation={navigation}
            />
          )) : (
            <View style={[layoutStyles.m_3]}>
              <CustomText h4>You have no recent notifications.</CustomText>
            </View>
          )
        }
      </ScrollView>
    </View>
  );
};

export default NotificationLanding;