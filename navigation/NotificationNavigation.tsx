import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import globalStyles from '../styles/global';
import NotificationLanding from '../screens/Notifications/NotificationLanding';



const NotificationNavigation: React.FC = () => {
  const RootStack = createNativeStackNavigator();

  return (
    <>
      <RootStack.Navigator initialRouteName="Notification Landing" >
        <RootStack.Screen
          name="Notification Landing"
          component={NotificationLanding}
          options={
            {
              title: 'Notifications',
              contentStyle: globalStyles.navigationStackScreen,
            }
          }
        />
      </RootStack.Navigator >
    </>
  );
}
export default NotificationNavigation;