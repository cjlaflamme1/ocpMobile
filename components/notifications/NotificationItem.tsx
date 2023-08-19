import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, View, Image, StyleProp, ViewStyle } from 'react-native';
import { Notifications } from '../../store/notificationSlice';
import CustomText from '../CustomText';
import layoutStyles from '../../styles/layout';
import notificationItemStyles from '../../styles/componentStyles/notifications/notificationItem';
import { NavigationProp } from '@react-navigation/native';

interface Props {
  notification: Notifications;
  navigation: NavigationProp<any, any>;
  styles?: StyleProp<ViewStyle>;
};

const NotificationItem: React.FC<Props> = (props: Props) => {
  const {
    navigation,
    styles,
    notification: {
      title,
      description,
      viewed,
      groupId,
      postId,
      eventId,
      user,
    }
  } = props;

  const navigationLocation = useCallback(() => {
    if (groupId) {
      navigation.navigate('Groups', { screen: 'View Group', initial: false, params: { groupId: groupId } });
    }
    if (postId) {
      navigation.navigate('Groups', { screen: 'View Comment', initial: false, params: { postId: postId } });
    }
    if (eventId) {
      navigation.navigate('Groups', { screen: 'View Group Event', initial: false, params: { eventId: eventId } });
    }
    return null;
  }, [groupId, postId, eventId]);


  return (
    <Pressable
    style={[layoutStyles.flexRow, layoutStyles.alignItemCenter, layoutStyles.jBetween, notificationItemStyles.clickableContainer, styles]}
    onPress={() => navigationLocation()}
    >
      <View style={[{ flexGrow: 1 }]}>
        <CustomText h4>{title}</CustomText>
        <CustomText>{description}</CustomText>
      </View>
      <Image
        source={require('../../assets/icons/chevronRight.png')}
        style={[notificationItemStyles.chevronIcon]}
      />
    </Pressable>
  );
};

export default NotificationItem;

NotificationItem.defaultProps = {
  styles: [],
}
