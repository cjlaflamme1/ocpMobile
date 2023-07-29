import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GroupsLanding from '../screens/Groups/GroupsLanding';
import SearchLanding from '../screens/Search/SearchLanding';
import globalStyles from '../styles/global';
import ViewUser from '../screens/Search/ViewUser';
import ViewUserActivity from '../screens/Search/ViewUserActivity';



const SearchNavigation: React.FC = () => {
  const RootStack = createNativeStackNavigator();

  return (
    <>
      <RootStack.Navigator initialRouteName="Search Landing" >
        <RootStack.Screen
          name="Search Landing"
          component={SearchLanding}
          options={
            {
              contentStyle: globalStyles.navigationStackScreen,
            }
          }
        />
        <RootStack.Screen
          name="View User"
          component={ViewUser}
          options={
            {
              contentStyle: globalStyles.navigationStackScreen,
            }
          }
        />
        <RootStack.Screen
          name="View User Activity"
          component={ViewUserActivity}
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
export default SearchNavigation;