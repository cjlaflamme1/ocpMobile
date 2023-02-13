import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, Text, Image, Button } from 'react-native';
import CustomText from '../../components/CustomText';
import { useAppDispatch } from '../../store/hooks';
interface Props {
  navigation: any;
};

const LoginSignup: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
  }, [])
  const imageUri = "../../assets/favicon.png";
  return (
    <View>
      <View>
        <CustomText>Outdoor Community</CustomText>
        <CustomText>Project</CustomText>
      </View>
      <View>
        <Image
          source={require(imageUri)}
          style={{width: 150, height: 150, maxHeight: 150, maxWidth: 150}}
          resizeMode={'center'}
        />
      </View>
      <View>
        <Button
          title="Login"
          onPress={() => navigation.navigate('SignIn')}
        />
        <Button
          title="Sign Up"
          onPress={() => navigation.navigate('SignUp')}
        />
      </View>
    </View>
  )
};

export default LoginSignup;