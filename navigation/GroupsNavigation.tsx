import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, Image, Pressable } from 'react-native';
import GroupsLanding from '../screens/Groups/GroupsLanding';
import globalStyles from '../styles/global';
import CreateGroup from '../screens/Groups/CreateGroup';
import GroupView from '../screens/Groups/GroupView';
import ViewGroupMessage from '../screens/Groups/ViewGroupMessage';
import layoutStyles from '../styles/layout';
import CustomText from '../components/CustomText';
import CreateGroupEvent from '../screens/Groups/CreateGroupEvent';
import ViewGroupEvent from '../screens/Groups/ViewGroupEvent';
import EditGroup from '../screens/Groups/EditGroup';



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
          name="Edit Group"
          component={EditGroup}
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
              headerTitle: '',
              headerRight: () => (
                <Pressable style={[layoutStyles.flexRow, layoutStyles.alignItemCenter]}>
                  <Image
                    source={require('../assets/icons/Setting.png')}
                    style={[{ height: 24, width: 24, resizeMode: 'contain'}, layoutStyles.mr_1]}
                  />
                </Pressable>
              )
            }
          }
        />
        <RootStack.Screen
          name="View Comment"
          component={ViewGroupMessage}
          options={
            {
              contentStyle: globalStyles.navigationStackScreen,
            }
          }
        />
        <RootStack.Screen
          name="Create Group Event"
          component={CreateGroupEvent}
          options={
            {
              contentStyle: globalStyles.navigationStackScreen,
            }
          }
        />
        <RootStack.Screen
          name="View Group Event"
          component={ViewGroupEvent}
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