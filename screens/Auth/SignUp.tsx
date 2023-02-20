import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Text, Image, Button, TextInput, Pressable, ScrollView } from 'react-native';
import CustomText from '../../components/CustomText';
import { useAppDispatch } from '../../store/hooks';
import inputStyle from '../../styles/componentStyles/inputBar';
import layoutStyles from '../../styles/layout';
import globalStyles from '../../styles/global';
import PrimaryButton from '../../components/PrimaryButton';
interface Props {
  navigation: any;
};

const SignIn: React.FC<Props> = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(true);
  const dispatch = useAppDispatch();
  useEffect(() => {
  }, []);
  return (
    <View style={[layoutStyles.screenContainer]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[layoutStyles.mb_3]}>
          <View style={[layoutStyles.mt_3]}>
            <CustomText h1 bold>Sign Up</CustomText>
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText style={[layoutStyles.mb_1]}>
              First Name
            </CustomText>
            <View style={[inputStyle.fullWidthInputContainer]}>
              <TextInput
                placeholder='First Name'
                style={[inputStyle.fullWidthInput]}
              />
            </View>
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText style={[layoutStyles.mb_1]}>
              Last Name
            </CustomText>
            <View style={[inputStyle.fullWidthInputContainer]}>
              <TextInput
                placeholder='Last Name'
                style={[inputStyle.fullWidthInput]}
              />
            </View>
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText style={[layoutStyles.mb_1]}>
              Email
            </CustomText>
            <View style={[inputStyle.fullWidthInputContainer]}>
              <TextInput
                placeholder='Enter email'
                style={[inputStyle.fullWidthInput]}
              />
            </View>
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText style={[layoutStyles.mb_1]}>
              Password
            </CustomText>
            <View style={[inputStyle.fullWidthInputContainer]}>
              <TextInput
                placeholder='Enter password'
                style={[inputStyle.fullWidthInput]}
                secureTextEntry={passwordVisible}
              />
            </View>
          </View>
          <View style={[layoutStyles.mt_2, layoutStyles.mb_3]}>
            <CustomText style={[layoutStyles.mb_1]}>
              Re-enter Password
            </CustomText>
            <View style={[inputStyle.fullWidthInputContainer]}>
              <TextInput
                placeholder='Enter password'
                style={[inputStyle.fullWidthInput]}
                secureTextEntry={passwordVisible}
              />
            </View>
          </View>
          <View>
            <PrimaryButton
              buttonText='Sign up'
              callback={() => console.log('signup')}
            />
          </View>
          <View style={[layoutStyles.mt_3]}>
            <View
              style={[globalStyles.hr]}
            />
          </View>
          <View style={[layoutStyles.flexRow, layoutStyles.jCenter, layoutStyles.mt_2, layoutStyles.mb_3]}>
            <CustomText>Already have an account? </CustomText>
            <Pressable
              onPress={() => navigation.navigate('SignIn')}
            >
              <CustomText style={[globalStyles.redLink]}>Sign In</CustomText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  )
};

export default SignIn;