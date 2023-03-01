import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, Text, Image, Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginSignup from '../screens/Auth/SignIn';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import TabNavigator from './TabNavigator';
import { getCurrentUserAsync, updateCurrentUserAsync } from '../store/userSlice';
import { loginAction } from '../store/authSlice';
import SignIn from '../screens/Auth/SignIn';
import SignUp from '../screens/Auth/SignUp';
import globalStyles from '../styles/global';

interface Props {
  expoPushToken: string;
}

const RootNavigation: React.FC<Props> = ({ expoPushToken }) => {
  const RootStack = createNativeStackNavigator();
  const currentState = useAppSelector((state) => ({
    authState: state.authState,
    userState: state.userState,
  }));
  const dispatch = useAppDispatch();
  const { currentAuth } = currentState.authState;
  const { currentUser } = currentState.userState;

  const checkUser = async () => {
    try {
      const loginStatus = await dispatch(getCurrentUserAsync());
      if (loginStatus.payload.email) {
        dispatch(loginAction({
          loggedIn: true,
          email: loginStatus.payload.email,
          accessToken: null,
        }))
      }
    } catch (e: any) {
      return e;
    }
  }

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (currentUser && expoPushToken) {
      if (currentUser.expoPushToken !== expoPushToken) {
        dispatch(updateCurrentUserAsync({
          id: currentUser.id,
          updateBody: {
            expoPushToken,
          },
        }));
      };
    }
  }, [expoPushToken, currentUser])

  return (
    <>
      {
        !currentAuth || !currentAuth.loggedIn ? (
          <RootStack.Navigator initialRouteName="SignIn" >
            <RootStack.Screen
              name="SignIn"
              component={SignIn}
              options={
                {
                  contentStyle: globalStyles.navigationStackScreen,
                  title: 'Welcome',
                }
              }

            />
            <RootStack.Screen
              name="SignUp"
              component={SignUp}
              options={
                {
                  contentStyle: globalStyles.navigationStackScreen,
                  title: 'Welcome',
                }
              }

            />
          </RootStack.Navigator >
        ) : (
          <RootStack.Navigator initialRouteName="UserTabNavigator">
            <RootStack.Screen
                name="UserTabNavigator"
                component={TabNavigator}
                options={
                  { headerShown: false,
                    contentStyle: {
                      backgroundColor: '#FAFAFA'
                    }
                  }
                  
                }
              />
          </RootStack.Navigator>
        )
      }
    </>
  );
}
export default RootNavigation;