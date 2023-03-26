import React, { useState } from 'react';
import { View, Image, ImageSourcePropType, Pressable, TextInput, StyleSheet } from 'react-native';
import inputStyle from '../../styles/componentStyles/inputBar';
import layoutStyles from '../../styles/layout';
import CustomText from '../CustomText';
import { CreateGroupPostDto } from '../../store/groupPostSlice';
import * as ImagePicker from 'expo-image-picker';
import {Buffer} from "buffer";

interface Props {
  placeholderText: string,
  buttonText: string,
  handleSubmit: (newPost: CreateGroupPostDto) => void;
};

const CommentResponse: React.FC<Props> = (props: Props) => {
  const [postContent, setPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset>();
  const [submitting, setSubmitting] = useState(false);
  const {
    placeholderText,
    buttonText,
    handleSubmit,
  } = props;

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      aspect: [4, 3],
      quality: 0,
    });
    if ((result.canceled === false) && result.assets.length > 0 && result.assets[0].base64) {
      const currentFile = result.assets[0];
      setSelectedImage(currentFile);
    };
  };

  const clearPost = () => {
    setSelectedImage(undefined);
    setPostContent('');
  }

  return (
    <View style={[postMessageStyle.cardContainer]}>
      {
        selectedImage &&
        (
          <View>
            <Image
              source={{ uri: selectedImage.uri }}
              style={[{ width: '100%', height: 150, borderRadius: 25, marginBottom: 10}]}
            />
          </View>
        )
      }
      <View style={[inputStyle.fullWidthInputContainer]}>
        <TextInput
          placeholder={placeholderText}
          style={[inputStyle.fullWidthInput]}
          multiline
          value={postContent}
          onChangeText={(e) => setPostContent(e)}
        />
      </View>
      <View style={[layoutStyles.flexRow, layoutStyles.mt_2]}>
        <View style={[layoutStyles.dFlex, { width: '50%'}]}>
          <Pressable
            style={({ pressed }) => {
              if (pressed) {
                return [postMessageStyle.postButton, postMessageStyle.pressed];
              } else {
                return [postMessageStyle.postButton];
              }
            }}
            onPress={() => console.log('respond')}
            disabled={submitting}
          >
            <CustomText bold style={[{ color: 'white' }]}>{buttonText}</CustomText>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default CommentResponse;

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
  },
  pressed: {
    backgroundColor: "#e52e20",
  }
});