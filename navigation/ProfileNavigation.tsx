import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, Image, Pressable } from 'react-native';
import ProfileLanding from '../screens/Profile/ProfileLanding';
import globalStyles from '../styles/global';
import ActivityDescription from '../screens/Profile/ActivityDescription';
import CustomText from '../components/CustomText';
import layoutStyles from '../styles/layout';
import CreateActivity from '../screens/Profile/CreateActivity';
import TitleWithBackButton from '../components/headers/TitleBackButton';
import TitleAndAction from '../components/headers/TitleAndAction';
import TripleHeader from '../components/headers/TripleHeader';



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
              header: () => (
                <TitleAndAction title='Outdoor Community Project'>
                  <Pressable style={[layoutStyles.flexRow, layoutStyles.alignItemCenter]}>
                    <Image
                      source={require('../assets/icons/Setting.png')}
                      style={[{ height: 24, width: 24, resizeMode: 'contain'}, layoutStyles.mr_1]}
                    />
                  </Pressable>
                </TitleAndAction>
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
              headerTitle: '',
              header: () => (
                <TripleHeader title='Activity Description'>
                  <Pressable style={[layoutStyles.flexRow, layoutStyles.alignItemCenter]}>
                    <Image
                      source={require('../assets/icons/Setting.png')}
                      style={[{ height: 24, width: 24, resizeMode: 'contain'}, layoutStyles.mr_1]}
                    />
                  </Pressable>
                </TripleHeader>
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
              header: () => (
                <TitleWithBackButton title='Create Activity' />
              )
            }
          }
        />
      </RootStack.Navigator >
    </>
  );
}
export default ProfileNavigation;