import React from 'react';
import { View, Image, ImageSourcePropType, Pressable, TextInput } from 'react-native';

interface Props {
  placeholderText: string,
  buttonText: string,
  groupId: string,
};

const PostMessageCard: React.FC<Props> = (props: Props) => {
  const {
    placeholderText,
    buttonText,
    groupId,
  } = props;

  return (
    <View style={[postMessageStyle.cardContainer]}>
      <View style={[inputStyle.fullWidthInputContainer]}>
        <TextInput
          placeholder={placeholderText}
          style={[inputStyle.fullWidthInput]}
        />
      </View>
      <View style={[layoutStyles.flexRow, layoutStyles.mt_2]}>
        <View style={[layoutStyles.flexRow, { width: '50%'}, layoutStyles.alignItemCenter]}>
          <Pressable
            onPress={() => console.log('upload image')}
            style={[layoutStyles.mr_2]}
          >
            <Image
              source={require('../../assets/icons/photo.png')}
              style={[{ width: 24, height: 24, resizeMode: 'contain'}]}
            />
          </Pressable>
          <Pressable
            onPress={() => console.log('upload icons')}
            style={[layoutStyles.mr_2]}
          >
            <Image
              source={require('../../assets/icons/Group.png')}
              style={[{ width: 24, height: 24, resizeMode: 'contain'}]}
            />
          </Pressable>
          <Pressable
            onPress={() => console.log('upload attachment')}
            style={[layoutStyles.mr_2]}
          >
            <Image
              source={require('../../assets/icons/Vector.png')}
              style={[{ width: 24, height: 24, resizeMode: 'contain'}]}
            />
          </Pressable>
        </View>
        <View style={[layoutStyles.dFlex, { width: '50%'}]}>
          <Pressable
            style={[postMessageStyle.postButton]}
            onPress={() => console.log(`Submit post to ${groupId}`)}
          >
            <CustomText bold style={[{ color: 'white' }]}>{buttonText}</CustomText>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default PostMessageCard;

import { StyleSheet } from 'react-native';
import inputStyle from '../../styles/componentStyles/inputBar';
import layoutStyles from '../../styles/layout';
import CustomText from '../CustomText';

const postMessageStyle = StyleSheet.create({
  postButton: {
    backgroundColor: '#CB1406',
    width: '100%',
    height: 55,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  cardContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 16,
  }
});