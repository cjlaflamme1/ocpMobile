import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GroupsLanding from '../screens/Groups/GroupsLanding';
import globalStyles from '../styles/global';
import CreateGroup from '../screens/Groups/CreateGroup';
import GroupView from '../screens/Groups/GroupView';



const GroupsNavigation: React.FC = () => {
  const RootStack = createNativeStackNavigator();

  return (
    <>
      <RootStack.Navigator initialRouteName="Groups Landing" >
        <RootStack.Screen
          name="Groups Landing"
          component={GroupsLanding}
          options={
            {
              contentStyle: globalStyles.navigationStackScreen,
            }
          }
        />
        <RootStack.Screen
          name="Create Group"
          component={CreateGroup}
          options={
            {
              contentStyle: globalStyles.navigationStackScreen,
            }
          }
        />
        <RootStack.Screen
          name="View Group"
          component={GroupView}
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
export default GroupsNavigation;