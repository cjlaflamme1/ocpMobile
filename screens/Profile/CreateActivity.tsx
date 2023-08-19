import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Image, RefreshControl, TextInput, Switch, Pressable, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomText from '../../components/CustomText';
import DropdownSelect, { DropdownData } from '../../components/DropdownSelect';
import { getAllActivityTypesAsync } from '../../store/activityTypeSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import * as ImagePicker from 'expo-image-picker';
import {Buffer} from "buffer";
import { createUserActivityAsync, CreateUserActivityDTO } from '../../store/userSlice';
import inputStyle from '../../styles/componentStyles/inputBar';
import layoutStyles from '../../styles/layout';
import createActivityStyles from '../../styles/screenStyles/profile/createActivity';
import { postPresignedUrl, putImageOnS3 } from '../../api/s3API';
import { getUserActivitiesAsync } from '../../store/userActivitySlice';
import PrimaryButton from '../../components/PrimaryButton';
import { NavigationProp } from '@react-navigation/native';

interface Props {
  navigation: NavigationProp<any, any>;
};

const CreateActivity: React.FC<Props> = ({ navigation }) => {
  const [newActivity, setNewActivity] = useState<CreateUserActivityDTO>();
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset>();
  const scrollViewRef = useRef<KeyboardAwareScrollView|null>(null);

  const dispatch = useAppDispatch();
  const activityTypes = useAppSelector((state) => state.activityTypeState.activityTypes);
  const currentUser = useAppSelector((state) => state.userState.currentUser);

  const resetActivity = () => {
    setNewActivity({
      information: '',
      favoriteLocations: '',
      yearsParticipating: '',
      preferredGroupDetails: '',
      seekingMentor: false,
      mentorNeedsDetails: '',
      offeringMentorship: false,
      provideMentorshipDetails: '',
      activityTypeId: '',
      coverPhoto: '',
    });
  };
  
  useEffect(() => {
    if (!newActivity) {
      resetActivity();
    }
    if (!activityTypes || activityTypes.length <= 0) {
      dispatch(getAllActivityTypesAsync());
    }
  }, []);

  if (!newActivity || !currentUser) {
    return (<View />);
  }

  const submitNewActivity = async () => {
    if (newActivity && currentUser) {
      const activityDTO: CreateUserActivityDTO = {...newActivity};
      if (selectedImage && selectedImage.base64) {
        const imageExt = selectedImage.uri.split('.').pop();
        const imageFileName = `${currentUser.id}/${activityDTO.activityTypeId}`;
  
        const buff = Buffer.from(selectedImage.base64, "base64");
        const preAuthPostUrl = await postPresignedUrl({ fileName: imageFileName, fileType: `${selectedImage.type}/${imageExt}`, fileDirectory: 'userActivityImages'}).then((response) => response).catch((e) => {
          return e;
        });
        if (preAuthPostUrl.status === 201 && preAuthPostUrl.data) {
          await putImageOnS3(preAuthPostUrl.data, buff, `${selectedImage.type}/${imageExt}`).catch((e) => console.log(e));
          activityDTO.coverPhoto = `userActivityImages/${imageFileName}`;
        }
      }
      await dispatch(createUserActivityAsync(activityDTO))
      dispatch(getUserActivitiesAsync());
      resetActivity();
      navigation.navigate('Profile Landing');
    }
  }

  const getActivities = () => {
    const newDropdown: DropdownData<string, string>[] = [];
    if (activityTypes && activityTypes.length > 0) {
      activityTypes.slice().map((type) => {
        newDropdown.push({
          key: type.id,
          value: type.activityTitle,
        });
      })
    }
    return newDropdown;
  }

  const returnSelected = () => {
    const activity = getActivities().find((item) => item.key === newActivity.activityTypeId);
    if (activity) {
      return activity;
    } else {
      return null;
    }
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      aspect: [4, 3],
      quality: Platform.OS === 'ios' ? 0 : .2,
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
                    style={[createActivityStyles.editImagePressable]}
                  >
                    <Image
                      source={require("../../assets/icons/CameraWhite.png")}
                      style={[createActivityStyles.editImageIcon]}
                    />
                  </Pressable>
              </View>
            ) : (
              <View style={[createActivityStyles.addImageContainer, layoutStyles.mt_3]}>
                <Pressable
                  style={({pressed}) => {
                    if (pressed) {
                      return [createActivityStyles.addImagePressable, createActivityStyles.pressed]
                    } else {
                      return [createActivityStyles.addImagePressable]
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
            <CustomText h1 bold>
              Select Activity
            </CustomText>
            <DropdownSelect
              testID='1234'
              testIDDropdown='1234567'
              data={getActivities()}
              placeholder={'Select activity.'}
              selected={returnSelected()}
              setSelected={(e) => setNewActivity({
                ...newActivity,
                activityTypeId: e.key,
              })}
            />
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText bold h4 style={[layoutStyles.mb_1]}>
              Information
            </CustomText>
            <View style={[inputStyle.fullWidthInputContainer]}>
              <TextInput
                defaultValue={newActivity.information || ''}
                multiline
                onChangeText={(e) => {
                  setNewActivity({
                    ...newActivity,
                    information: e,
                  })
                }}
                placeholder='Enter more information about your activity here...'
                autoCorrect={true}
                style={[inputStyle.fullWidthInput, inputStyle.multilineInput]}
              />
            </View>
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText bold h4 style={[layoutStyles.mb_1]}>
              Favorite Locations
            </CustomText>
            <View style={[inputStyle.fullWidthInputContainer]}>
              <TextInput
                defaultValue={newActivity.favoriteLocations || ''}
                multiline
                onChangeText={(e) => {
                  setNewActivity({
                    ...newActivity,
                    favoriteLocations: e,
                  })
                }}
                placeholder='What are some of your favorite spots?'
                autoCorrect={true}
                style={[inputStyle.fullWidthInput, inputStyle.multilineInput]}
              />
            </View>
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText bold h4 style={[layoutStyles.mb_1]}>
              Years Participating
            </CustomText>
            <View style={[inputStyle.fullWidthInputContainer]}>
              <TextInput
                defaultValue={newActivity.yearsParticipating || ''}
                multiline
                onChangeText={(e) => {
                  setNewActivity({
                    ...newActivity,
                    yearsParticipating: e,
                  })
                }}
                placeholder='How long have you been participating?'
                autoCorrect={true}
                style={[inputStyle.fullWidthInput, inputStyle.multilineInput]}
              />
            </View>
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText bold h4 style={[layoutStyles.mb_1]}>
              Are you looking for mentorship?
            </CustomText>
            <View style={[layoutStyles.flexRow, layoutStyles.jStart, layoutStyles.alignItemCenter]}>
              <CustomText>No</CustomText>
              <Switch
                trackColor={{false: '#767577', true: '#8A8A8A'}}
                style={[layoutStyles.m_2]}
                thumbColor={newActivity.seekingMentor ? '#CB1406' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(e) => {
                  setNewActivity({
                    ...newActivity,
                    seekingMentor: e,
                  })
                }}
                value={newActivity.seekingMentor}
              />
              <CustomText>Yes</CustomText>
            </View>
          </View>
          {
            newActivity.seekingMentor && (
              <View style={[layoutStyles.mt_2]}>
                <CustomText bold h4 style={[layoutStyles.mb_1]}>
                  Mentorship Needs
                </CustomText>
                <View style={[inputStyle.fullWidthInputContainer]}>
                  <TextInput
                    defaultValue={newActivity.mentorNeedsDetails || ''}
                    multiline
                    onChangeText={(e) => {
                      setNewActivity({
                        ...newActivity,
                        mentorNeedsDetails: e,
                      })
                    }}
                    placeholder='Provide details on how a mentor could support you.'
                    autoCorrect={true}
                    style={[inputStyle.fullWidthInput, inputStyle.multilineInput]}
                  />
                </View>
              </View>
            )
          }
          <View style={[layoutStyles.mt_2]}>
            <CustomText bold h4 style={[layoutStyles.mb_1]}>
              Are you willing to mentor others?
            </CustomText>
            <View style={[layoutStyles.flexRow, layoutStyles.jStart, layoutStyles.alignItemCenter]}>
              <CustomText>No</CustomText>
              <Switch
                trackColor={{false: '#767577', true: '#8A8A8A'}}
                style={[layoutStyles.m_2]}
                thumbColor={newActivity.offeringMentorship ? '#CB1406' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(e) => {
                  setNewActivity({
                    ...newActivity,
                    offeringMentorship: e,
                  })
                }}
                value={newActivity.offeringMentorship}
              />
              <CustomText>Yes</CustomText>
            </View>
          </View>
          {
            newActivity.offeringMentorship && (
              <View style={[layoutStyles.mt_2]}>
                <CustomText bold h4 style={[layoutStyles.mb_1]}>
                  Mentorship Availability
                </CustomText>
                <View style={[inputStyle.fullWidthInputContainer]}>
                  <TextInput
                    defaultValue={newActivity.provideMentorshipDetails || ''}
                    multiline
                    onChangeText={(e) => {
                      setNewActivity({
                        ...newActivity,
                        provideMentorshipDetails: e,
                      })
                    }}
                    placeholder='Provide details on the mentorship you can provide.'
                    autoCorrect={true}
                    style={[inputStyle.fullWidthInput, inputStyle.multilineInput]}
                  />
                </View>
              </View>
            )
          }
          <View style={[layoutStyles.mt_2, layoutStyles.mb_2]}>
            {/* <Pressable
              style={[layoutStyles.flexRow, layoutStyles.alignItemCenter]}
              onPress={submitNewActivity}
            >
              <Image
                source={require('../../assets/icons/Edit.png')}
                style={[{ height: 16, width: 16, resizeMode: 'contain'}, layoutStyles.mr_1]}
              />
              <CustomText>
                Save Activity
              </CustomText>
            </Pressable> */}
            <PrimaryButton
              buttonText='Save Activity'
              callback={() => submitNewActivity()}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default CreateActivity;