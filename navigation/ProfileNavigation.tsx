import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, Image, Pressable } from 'react-native';
import ProfileLanding from '../screens/Profile/ProfileLanding';
import globalStyles from '../styles/global';
import ActivityDescription from '../screens/Profile/ActivityDescription';
import CustomText from '../components/CustomText';
import layoutStyles from '../styles/layout';
import CreateActivity from '../screens/Profile/CreateActivity';



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
              headerTitle: '',
              headerRight: () => (
                <Pressable style={[layoutStyles.flexRow, layoutStyles.alignItemCenter]}>
                  <Image
                    source={require('../assets/icons/Edit.png')}
                    style={[{ height: 16, width: 16, resizeMode: 'contain'}, layoutStyles.mr_1]}
                  />
                  <CustomText>
                    Edit Profile
                  </CustomText>
                </Pressable>
              )
            }
          }
        />
        <RootStack.Screen
          name="Activity Description"
          component={ActivityDescription}
          options={
            {
              contentStyle: globalStyles.navigationStackScreen,
              headerRight: () => (
                <Button title="Edit" />
              )
            }
          }
        />
        <RootStack.Screen
          name="Create Activity"
          component={CreateActivity}
          options={
            {
              contentStyle: globalStyles.navigationStackScreen,
              headerTitle: '',
            }
          }
        />
      </RootStack.Navigator >
    </>
  );
}
export default ProfileNavigation;