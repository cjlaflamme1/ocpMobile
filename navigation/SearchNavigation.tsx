import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GroupsLanding from '../screens/Groups/GroupsLanding';
import SearchLanding from '../screens/Search/SearchLanding';



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
              contentStyle:
              {
                alignItems: 'center'
              },
            }
          }
        />
      </RootStack.Navigator >
    </>
  );
}
export default SearchNavigation;