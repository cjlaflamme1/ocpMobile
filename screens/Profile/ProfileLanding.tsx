import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Image, RefreshControl, AppState, Text, Button, Pressable, TextInput } from 'react-native';
import ProfileActivityCard from '../../components/ProfileActivityCard';
import CustomText from '../../components/CustomText';
import globalStyles from '../../styles/global';
import imageStyles from '../../styles/images';
import layoutStyles from '../../styles/layout';
import profileLandingStyles from '../../styles/screenStyles/profileLanding';
import { logoutAction } from '../../store/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import * as ImagePicker from 'expo-image-picker';
import {Buffer} from "buffer";
import * as FileSystem from "expo-file-system";
import { postPresignedUrl, putImageOnS3 } from '../../api/s3API';
import { getCurrentUserAsync, updateCurrentUserAsync } from '../../store/userSlice';
import { NavigationProp } from '@react-navigation/native';
import inputStyle from '../../styles/componentStyles/inputBar';

interface Props {
  navigation: NavigationProp<any, any>
};

const ProfileLanding: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [debounceHandle, setDebounceHandle] = useState<any>();
  const [debounceFNHandle, setDebounceFNHandle] = useState<any>();
  const [debounceLNHandle, setDebounceLNHandle] = useState<any>();
  const currentState = useAppSelector((state) => ({
    userState: state.userState,
  }));
  const dispatch = useAppDispatch();
  const onRefresh = async () => {
    setRefreshing(true);
    // Refresh functions here
      await dispatch(getCurrentUserAsync());
    setRefreshing(false);
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={[layoutStyles.flexRow, layoutStyles.alignItemCenter]}
          onPress={() => setEditMode((editMode) => !editMode)}
        >
          <Image
            source={require('../../assets/icons/Edit.png')}
            style={[{ height: 16, width: 16, resizeMode: 'contain'}, layoutStyles.mr_1]}
          />
          <CustomText>
            Edit Profile
          </CustomText>
        </Pressable>
      )
    })
  }, [navigation])

  const { currentUser } = currentState.userState;
  if (!currentUser) {
    return (<View />);
  }

  const updatePersonalBio = (data: string, location: 'location' | 'firstName' | 'lastName') => {
    if (currentUser && location === 'location') {
      dispatch(updateCurrentUserAsync({ id: currentUser.id, updateBody: {
        location: data,
      }}));
    } else if (currentUser && location === 'firstName') {
      dispatch(updateCurrentUserAsync({ id: currentUser.id, updateBody: {
        firstName: data,
      }}));
    } else if (currentUser && location === 'lastName') {
      dispatch(updateCurrentUserAsync({ id: currentUser.id, updateBody: {
        lastName: data,
      }}));
    }
  }

  const updateResolutionDetails = async (resolution: string, location: 'location' | 'firstName' | 'lastName') => {
    if (currentUser && resolution) {
      updatePersonalBio(resolution, location);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      aspect: [3, 3],
      quality: 0,
    });

    if ((result.canceled === false) && result.assets.length > 0 && result.assets[0].base64) {
      console.log(result);
      const imageExt = result.assets[0].uri.split('.').pop();
      const imageFileName = currentUser.id;

      const buff = Buffer.from(result.assets[0].base64, "base64");
      const preAuthPostUrl = await postPresignedUrl({ fileName: imageFileName, fileType: `${result.assets[0].type}/${imageExt}`, fileDirectory: 'profileImage'}).then((response) => response).catch((e) => {
        return e;
      });
      if (preAuthPostUrl.status === 201 && preAuthPostUrl.data) {
        await putImageOnS3(preAuthPostUrl.data, buff, `${result.assets[0].type}/${imageExt}`).catch((e) => console.log(e));
        dispatch(updateCurrentUserAsync({ id: currentUser.id, updateBody: {
          profilePhoto: `profileImage/${imageFileName}`,
        }}));
      }
    };
  };

  return (
    <View style={[layoutStyles.screenContainer]}>
      <ScrollView showsVerticalScrollIndicator={false}  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={[layoutStyles.m_1, layoutStyles.mt_3, layoutStyles.mb_3]}>
          <View style={[imageStyles.profileImageContainer]}>
            <View>
              <Image
                source={
                  currentUser.imageGetUrl ?
                    { uri: currentUser.imageGetUrl }
                    : require("../../assets/profilePhotos/testProfile.jpg")
                }
                style={[imageStyles.profileImage]}
              />
              {
                editMode
                && (
                  <Pressable
                    onPress={pickImage}
                    style={[profileLandingStyles.editImagePressable]}
                  >
                    <Image
                      source={require("../../assets/icons/CameraWhite.png")}
                      style={[profileLandingStyles.editImageIcon]}
                    />
                  </Pressable>
                )
              }
            </View>
          </View>
          {
            editMode
            ? (
              <View>
                <View style={[layoutStyles.mt_2]}>
                  <CustomText style={[layoutStyles.mb_1]}>
                    First Name
                  </CustomText>
                  <View style={[inputStyle.fullWidthInputContainer]}>
                    <TextInput
                      defaultValue={currentUser.firstName || ''}
                      textContentType='givenName'
                      onChangeText={(e) => {
                        if (debounceFNHandle) {
                          clearTimeout(debounceFNHandle);
                        } 
                        const handle = setTimeout(() => updateResolutionDetails(e, 'firstName'), 1000);
                        setDebounceFNHandle(handle);
                      }}
                      placeholder='First Name'
                      autoCorrect={false}
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
                      defaultValue={currentUser.lastName || ''}
                      textContentType='familyName'
                      onChangeText={(e) => {
                        if (debounceLNHandle) {
                          clearTimeout(debounceLNHandle);
                        } 
                        const handle = setTimeout(() => updateResolutionDetails(e, 'lastName'), 1000);
                        setDebounceLNHandle(handle);
                      }}
                      placeholder='Last Name'
                      autoCorrect={false}
                      style={[inputStyle.fullWidthInput]}
                    />
                  </View>
                </View>
                <View style={[layoutStyles.mt_2]}>
                  <CustomText style={[layoutStyles.mb_1]}>
                    Location
                  </CustomText>
                  <View style={[inputStyle.fullWidthInputContainer]}>
                    <TextInput
                      defaultValue={currentUser.location || ''}
                      textContentType='addressCityAndState'
                      onChangeText={(e) => {
                        if (debounceHandle) {
                          clearTimeout(debounceHandle);
                        } 
                        const handle = setTimeout(() => updateResolutionDetails(e, 'location'), 1000);
                        setDebounceHandle(handle);
                      }}
                      placeholder='Location (ie: City, State)'
                      autoCorrect={false}
                      style={[inputStyle.fullWidthInput]}
                    />
                  </View>
                </View>
              </View>
            ) : (
              <View>
                <CustomText h2 bold center>
                  {`${currentUser.firstName} ${currentUser.lastName}`}
                </CustomText>
                <View style={[layoutStyles.flexRow, layoutStyles.jCenter, layoutStyles.m_1]}>
                  <Image 
                    source={require('../../assets/icons/location.png')}
                    style={[{width: 16, height: 16, alignSelf: 'center'}]}
                  />
                  <CustomText style={[globalStyles.mutedText]}>{currentUser.location || 'Edit profile to add location'}</CustomText>
                </View>
              </View>
            )
          }
        </View>
        {
          !editMode
          && (
            <View>
              <View style={[layoutStyles.flexRow, layoutStyles.jBetween]}>
                <CustomText h4 bold>User Activities</CustomText>
                <Pressable onPress={() => dispatch(logoutAction())}>
                  <CustomText style={[globalStyles.redLink]}>+ Add Activity</CustomText>
                </Pressable>
              </View>
              <View style={[profileLandingStyles.cardRow]}>
                <View style={[profileLandingStyles.cardColumn]}>
                  <Pressable onPress={() => navigation.navigate('Activity Description')}>
                    <ProfileActivityCard imageSource={require('../../assets/profilePhotos/testSportImage.jpg')}>
                      Skiing
                    </ProfileActivityCard>
                  </Pressable>
                </View>
                <View style={[profileLandingStyles.cardColumn]}>
                  <Pressable onPress={() => console.log('pressed')}>
                    <ProfileActivityCard imageSource={require('../../assets/profilePhotos/testSportImage.jpg')}>
                      Skiing again
                    </ProfileActivityCard>
                  </Pressable>
                </View>
                <View style={[profileLandingStyles.cardColumn]}>
                  <Pressable onPress={() => console.log('pressed')}>
                    <ProfileActivityCard imageSource={require('../../assets/profilePhotos/testSportImage.jpg')}>
                      Skiing again
                    </ProfileActivityCard>
                  </Pressable>
                </View>
                <View style={[profileLandingStyles.cardColumn]}>
                  <Pressable onPress={() => console.log('pressed')}>
                    <ProfileActivityCard imageSource={require('../../assets/profilePhotos/testSportImage.jpg')}>
                      Skiing again
                    </ProfileActivityCard>
                  </Pressable>
                </View>
              </View>
            </View>
          )
        }
      </ScrollView>
    </View>
  );
};

export default ProfileLanding;