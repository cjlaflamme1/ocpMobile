import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, Text, Image, Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginSignup from '../screens/loginSignup/LoginSignup';
// import SignUp from '../screens/loginSignup/SignUp';
import { useAppDispatch, useAppSelector } from '../store/hooks';
// import TabNavigator from './TabNavigator';
// import SignIn from '../screens/loginSignup/SignIn';
// import { getCurrentUserAsync, updateCurrentUserAsync } from '../store/userSlice';
import { loginAction } from '../store/authSlice';
import TabNavigator from './TabNavigator';

interface Props {
  expoPushToken: string;
}

const RootNavigation: React.FC<Props> = ({ expoPushToken }) => {
  const RootStack = createNativeStackNavigator();
  const currentState = useAppSelector((state) => ({
    authState: state.authState,
  }));
  const dispatch = useAppDispatch();
  const { currentAuth } = currentState.authState;

  // const checkUser = async () => {
  //   try {
  //     const loginStatus = await dispatch(getCurrentUserAsync());
  //     if (loginStatus.payload.email) {
  //       dispatch(loginAction({
  //         loggedIn: true,
  //         email: loginStatus.payload.email,
  //         accessToken: null,
  //       }))
  //     }
  //   } catch (e: any) {
  //     return e;
  //   }
  // }

  // useEffect(() => {
  //   checkUser();
  // }, []);

  // useEffect(() => {
  //   if (currentUser && expoPushToken) {
  //     if (currentUser.expoPushToken !== expoPushToken) {
  //       dispatch(updateCurrentUserAsync({
  //         id: currentUser.id,
  //         updateBody: {
  //           expoPushToken,
  //         },
  //       }));
  //     };
  //   }
  // }, [expoPushToken, currentUser])

  return (
    <>
      {/* {
        !currentAuth || !currentAuth.loggedIn ? (
          <RootStack.Navigator initialRouteName="SignIn/SignUp" >
            <RootStack.Screen
              name="SignIn/SignUp"
              component={LoginSignup}
              options={
                {
                  contentStyle:
                  {
                    alignItems: 'center',
                    backgroundColor: '#DAEAEF',
                  },
                  title: 'Welcome',
                  headerStyle: {
                    backgroundColor: '#9DBDC6',
                  }
                }
              }

            />
          </RootStack.Navigator >

        ) : (
        <RootStack.Navigator initialRouteName="UserTabNavigator">
          <RootStack.Screen
              name="UserTabNavigator"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
        </RootStack.Navigator>
      )
      } */}
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
    </>
  );
}
export default RootNavigation;