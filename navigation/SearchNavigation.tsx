import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GroupsLanding from '../screens/Groups/GroupsLanding';
import SearchLanding from '../screens/Search/SearchLanding';
import globalStyles from '../styles/global';



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
      </RootStack.Navigator >
    </>
  );
}
export default SearchNavigation;