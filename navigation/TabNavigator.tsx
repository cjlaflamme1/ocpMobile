import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileNavigation from './ProfileNavigation';
import { Image } from 'react-native';
import GroupsNavigation from './GroupsNavigation';
import SearchNavigation from './SearchNavigation';
import CalendarNavigation from './CalendarNavigation';

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Profile"
        component={ProfileNavigation}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Image
                style={{width: size, height: size, resizeMode: 'contain'}}
                source={focused ? require("../assets/icons/Profile.png") : require("../assets/icons/ProfileUnfocused.png")}
              />
            )
          },
          tabBarShowLabel: false,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Groups"
        component={GroupsNavigation}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Image
                style={{width: size, height: size, resizeMode: 'contain'}}
                source={focused ? require("../assets/icons/Groups.png") : require("../assets/icons/GroupsUnfocused.png")}
              />
            )
          },
          tabBarShowLabel: false,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchNavigation}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Image
                style={{width: size, height: size, resizeMode: 'contain'}}
                source={focused ? require("../assets/icons/Search.png") : require("../assets/icons/SearchUnfocused.png")}
              />
            )
          },
          tabBarShowLabel: false,
          headerShown: false,
        }}
        
      />
      <Tab.Screen
        name="Calendar Navigation"
        component={CalendarNavigation}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Image
                style={{width: size, height: size, resizeMode: 'contain'}}
                source={focused ? require("../assets/icons/Calendar.png") : require("../assets/icons/CalendarUnfocused.png")}
              />
            )
          },
          tabBarShowLabel: false,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  )
};

export default TabNavigator;