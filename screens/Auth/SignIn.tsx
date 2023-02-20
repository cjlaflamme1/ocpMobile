import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Text, Image, Button, TextInput, Pressable } from 'react-native';
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
  }, [])
  const imageUri = "../../assets/favicon.png";
  return (
    <View style={[layoutStyles.screenContainer]}>
      <View style={[layoutStyles.mt_3]}>
        <CustomText h1 bold>Sign In</CustomText>
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
      <View style={[layoutStyles.mt_2, layoutStyles.mb_3]}>
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
      <View>
        <PrimaryButton
          buttonText='Sign in'
          callback={() => console.log('signin')}
        />
      </View>
      <View style={[layoutStyles.mt_3]}>
        <View
          style={[globalStyles.hr]}
        />
      </View>
      <View style={[layoutStyles.flexRow, layoutStyles.jCenter, layoutStyles.mt_2]}>
        <CustomText>Don't have an account? </CustomText>
        <Pressable
          onPress={() => navigation.navigate('SignUp')}
        >
          <CustomText style={[globalStyles.redLink]}>Sign up</CustomText>
        </Pressable>
      </View>
    </View>
  )
};

export default SignIn;