import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileLanding from '../screens/Profile/ProfileLanding';
import globalStyles from '../styles/global';



const ProfileNavigation: React.FC = () => {
  const RootStack = createNativeStackNavigator();

  return (
    <>
      <RootStack.Navigator initialRouteName="Profile Landing" >
        <RootStack.Screen
          name="Profile Landing"
          component={ProfileLanding}
          options={
            {
              contentStyle: globalStyles.navigationStackScreen,
            }
          }
        />
      </RootStack.Navigator >
    </>
  );
}
export default ProfileNavigation;