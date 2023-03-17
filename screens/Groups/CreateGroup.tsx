import React, { useEffect, useRef, useState } from 'react';
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
import { createGroupAsync, CreateGroupDto, getAllGroupsAsync, getAllUserGroupsAsync } from '../../store/groupSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { postPresignedUrl, putImageOnS3 } from '../../api/s3API';
import { clearUserList, getAllUsersAsync, User } from '../../store/userSlice';
import DropdownSelect, { DropdownData } from '../../components/DropdownSelect';
import UserSearchDropdown from '../../components/UserSearchDropdown';

interface Props {
  navigation: any
};

const CreateGroup: React.FC<Props> = ({ navigation }) => {
  const [newGroupObj, setNewGroupObj] = useState<CreateGroupDto>();
  const [selectedUserIds, setSelectedUserIds] = useState<Partial<User>[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset>();
  const scrollViewRef = useRef<KeyboardAwareScrollView|null>(null);
  const dispatch = useAppDispatch();
  const currentState = useAppSelector((state) => ({
    userState: state.userState,
  }));

  const { currentUser } = currentState.userState;

  useEffect(() => {
    if (!newGroupObj) {
      setNewGroupObj({
        coverPhoto: '',
        title: '',
        description: '',
        groupAdminIds: [],
        pendingInvitationUserIds: [],
      });
    }
  }, [navigation]);

  if (!currentUser || !newGroupObj) {
    return (<View />);
  }

  const submitNewGroup = async () => {
    let newCoverImage = '';
    if (selectedImage && selectedImage.base64) {
      const imageExt = selectedImage.uri.split('.').pop();
      const imageFileName = `${newGroupObj.title}-${selectedImage.fileName}`;

      const buff = Buffer.from(selectedImage.base64, "base64");
      const preAuthPostUrl = await postPresignedUrl({ fileName: imageFileName, fileType: `${selectedImage.type}/${imageExt}`, fileDirectory: 'groupImages'}).then((response) => response).catch((e) => {
        return e;
      });
      if (preAuthPostUrl.status === 201 && preAuthPostUrl.data) {
        await putImageOnS3(preAuthPostUrl.data, buff, `${selectedImage.type}/${imageExt}`).catch((e) => console.log(e));
        newCoverImage = `groupImages/${imageFileName}`;
      }
    }
    if (newGroupObj.title && newGroupObj.description) {
      await dispatch(createGroupAsync({
        ...newGroupObj,
        coverPhoto: newCoverImage,
        pendingInvitationUserIds: (selectedUserIds && selectedUserIds.length > 0) ?
          selectedUserIds.map((user) => user.id ? user.id : '') :
          [],
      }));
      dispatch(getAllUserGroupsAsync({
        pagination: {
          take: 8,
          skip: 0,
        }
      }));
      navigation.navigate('Groups Landing');
    }
  };

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
                onChangeText={(e) => {
                  setNewGroupObj({
                    ...newGroupObj,
                    title: e,
                  })
                }}
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
                onChangeText={(e) => {
                  setNewGroupObj({
                    ...newGroupObj,
                    description: e,
                  })
                }}
              />
            </View>
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText style={[layoutStyles.mb_1]}>
              Invite Members
            </CustomText>
            <UserSearchDropdown
              testID='123455'
              testIDDropdown='lkjfsodijfe'
              placeholder='Search for users...'
              setSelected={(e) => {
                setSelectedUserIds([...selectedUserIds, e]);
              }}
              selected={selectedUserIds}
            />
          </View>
          <View style={[layoutStyles.flexRow, { flexWrap: 'wrap'}, layoutStyles.mt_2]}>
            {
              selectedUserIds
              && selectedUserIds.length > 0
              ? selectedUserIds.map((user) => (
                <Pressable key={`selectedUser-${user.id}`}>
                  <UserIconSmall
                    imageSource={{ uri: user.imageGetUrl }}
                    userName={`${user.firstName} ${user.lastName}`}
                  />
                </Pressable>
              )) : (
                <CustomText>No users selected for invite.</CustomText>
              )
            }
          </View>
          <View style={[layoutStyles.mt_3]}>
            <PrimaryButton
              buttonText='Create'
              disabled={!newGroupObj.title || !newGroupObj.description}
              callback={submitNewGroup}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default CreateGroup;