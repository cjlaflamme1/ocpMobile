import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileLanding from '../screens/Profile/ProfileLanding';



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
              contentStyle:
              {
                alignItems: 'center',
                backgroundColor: '#FAFAFA'
              },
            }
          }
        />
      </RootStack.Navigator >
    </>
  );
}
export default ProfileNavigation;