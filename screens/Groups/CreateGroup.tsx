import React, { useRef, useState } from 'react';
import { View, Image, ScrollView, RefreshControl, Pressable, TextInput } from 'react-native';
import CustomText from '../../components/CustomText';
import * as ImagePicker from 'expo-image-picker';
import {Buffer} from "buffer";
import GroupCard from '../../components/GroupCard';
import PrimaryButton from '../../components/PrimaryButton';
import UserIconSmall from '../../components/UserIconSmall';
import inputStyle from '../../styles/componentStyles/inputBar';
import globalStyles from '../../styles/global';
import layoutStyles from '../../styles/layout';
import createGroupStyles from '../../styles/screenStyles/groups/createGroup';
import groupsLandingStyle from '../../styles/screenStyles/groups/groupsLanding';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface Props {
  navigation: any
};

const CreateGroup: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset>();
  const scrollViewRef = useRef<KeyboardAwareScrollView|null>(null);

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

  return (
    <View style={[layoutStyles.screenContainer]}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        // onLayout={() => scrollViewRef?.current?.scrollToEnd()}
        // onContentSizeChange={() => scrollViewRef?.current?.scrollToEnd()}
      >
        <View style={[layoutStyles.mb_3]}>
          <View style={[layoutStyles.mt_2]}>
            <CustomText h1 bold>Create Group</CustomText>
          </View>
          {
            selectedImage ?
            (
              <View style={[layoutStyles.mt_2]}>
                <Image
                  source={{uri: selectedImage.uri}}
                  style={[{ width: '100%', height: 200, borderRadius: 25}]}
                />
                <Pressable
                    onPress={pickImage}
                    style={[createGroupStyles.editImagePressable]}
                  >
                    <Image
                      source={require("../../assets/icons/CameraWhite.png")}
                      style={[createGroupStyles.editImageIcon]}
                    />
                  </Pressable>
              </View>
            ) : (
              <View style={[createGroupStyles.addImageContainer, layoutStyles.mt_3]}>
                <Pressable
                  style={({pressed}) => {
                    if (pressed) {
                      return [createGroupStyles.addImagePressable, createGroupStyles.pressed]
                    } else {
                      return [createGroupStyles.addImagePressable]
                    }
                  }}
                  onPress={pickImage}
                >
                  <Image 
                    source={require('../../assets/icons/Camera.png')}
                    style={[{width: 24, height: 24}]}
                  />
                </Pressable>
              </View>
            )
          }
          <View style={[layoutStyles.mt_2]}>
            <CustomText style={[layoutStyles.mb_1]}>
              Group Name
            </CustomText>
            <View style={[inputStyle.fullWidthInputContainer]}>
              <TextInput
                placeholder='Enter group name'
                style={[inputStyle.fullWidthInput]}
              />
            </View>
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText style={[layoutStyles.mb_1]}>
              Group Description
            </CustomText>
            <View style={[inputStyle.fullWidthInputContainer]}>
              <TextInput
                placeholder='Enter group description'
                style={[inputStyle.fullWidthInput]}
                multiline
              />
            </View>
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText style={[layoutStyles.mb_1]}>
              Invite Members
            </CustomText>
            <View style={[inputStyle.fullWidthInputContainer]}>
              <TextInput
                placeholder='Enter name'
                style={[inputStyle.fullWidthInput]}
              />
            </View>
          </View>
          <View style={[layoutStyles.flexRow, { flexWrap: 'wrap'}, layoutStyles.mt_2]}>
            <Pressable>
              <UserIconSmall
                imageSource={require('../../assets/profilePhotos/testProfile.jpg')}
                userName='Chad Laflamme'
              />
            </Pressable>
            <Pressable>
              <UserIconSmall
                imageSource={require('../../assets/profilePhotos/testProfile.jpg')}
                userName='Chad Laflamme'
              />
            </Pressable>
            <Pressable>
              <UserIconSmall
                imageSource={require('../../assets/profilePhotos/testProfile.jpg')}
                userName='Chad Laflamme'
              />
            </Pressable>
            <Pressable>
              <UserIconSmall
                imageSource={require('../../assets/profilePhotos/testProfile.jpg')}
                userName='Chad Laflamme'
              />
            </Pressable>
            <Pressable>
              <UserIconSmall
                imageSource={require('../../assets/profilePhotos/testProfile.jpg')}
                userName='Chad Laflamme'
              />
            </Pressable>
            <Pressable>
              <UserIconSmall
                imageSource={require('../../assets/profilePhotos/testProfile.jpg')}
                userName='Chad Laflamme'
              />
            </Pressable>
            <Pressable>
              <UserIconSmall
                imageSource={require('../../assets/profilePhotos/testProfile.jpg')}
                userName='Chad Laflamme'
              />
            </Pressable>
            <Pressable>
              <UserIconSmall
                imageSource={require('../../assets/profilePhotos/testProfile.jpg')}
                userName='Chad Laflamme'
              />
            </Pressable>
          </View>
          <View style={[layoutStyles.mt_3]}>
            <PrimaryButton
              buttonText='Create'
              callback={() => console.log('clicky')}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default CreateGroup;