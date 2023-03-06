import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Image, RefreshControl, Pressable, TextInput, Switch } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import {Buffer} from "buffer";
import CustomText from '../../components/CustomText';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getOneUserActivityAsync, updateUserActivityAsync } from '../../store/userActivitySlice';
import { UserActivity } from '../../store/userSlice';
import inputStyle from '../../styles/componentStyles/inputBar';
import layoutStyles from '../../styles/layout';
import createActivityStyles from '../../styles/screenStyles/profile/createActivity';
import { postPresignedUrl, putImageOnS3 } from '../../api/s3API';
import PrimaryButton from '../../components/PrimaryButton';

interface Props {
  navigation: any
};

const ActivityDescription: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [updatedActivity, setUpdatedActivity] = useState<Partial<UserActivity>>()
  const scrollViewRef = useRef<KeyboardAwareScrollView|null>(null);
  const currentState = useAppSelector((state) => ({
    userActivityState: state.userActivityState,
    userState: state.userState,
  }));
  const dispatch = useAppDispatch();

  const { selectedUserActivity } = currentState.userActivityState;
  const { currentUser } = currentState.userState;

  const onRefresh = async () => {
    setRefreshing(true);
      if (selectedUserActivity) {
        await dispatch(getOneUserActivityAsync(selectedUserActivity.id));
      }
    setRefreshing(false);
  }

  const pickImage = async (userId: string) => {
    // No permissions request is necessary for launching the image library
    if (selectedUserActivity) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        base64: true,
        aspect: [4, 3],
        quality: 0,
      });
      if ((result.canceled === false) && result.assets.length > 0 && result.assets[0].base64) {
        const currentFile = result.assets[0];
        const imageExt = currentFile.uri.split('.').pop();
          const imageFileName = `${userId}/${selectedUserActivity?.activityType.id}`;
  
        const buff = Buffer.from(result.assets[0].base64, "base64");
        const preAuthPostUrl = await postPresignedUrl({ fileName: imageFileName, fileType: `${result.assets[0].type}/${imageExt}`, fileDirectory: 'userActivityImages'}).then((response) => response).catch((e) => {
          return e;
        });
        if (preAuthPostUrl.status === 201 && preAuthPostUrl.data) {
          await putImageOnS3(preAuthPostUrl.data, buff, `${result.assets[0].type}/${imageExt}`).catch((e) => console.log(e));
          const updatedActivityImage = await dispatch(updateUserActivityAsync({ id: selectedUserActivity?.id, body: {
            coverPhoto: `userActivityImages/${imageFileName}`,
          }}));
          if (updatedActivityImage && updatedActivityImage.meta.requestStatus === "fulfilled") {
            setUpdatedActivity({
              ...updatedActivity,
              coverPhoto: updatedActivityImage.payload.coverPhoto,
              getImageUrl: updatedActivityImage.payload.getImageUrl,
            });
          }
        }
      };
    }
  };

  const saveUpdatedActivity = async () => {
    if (updatedActivity && selectedUserActivity) {
      if (updatedActivity !== selectedUserActivity) {
        await dispatch(updateUserActivityAsync({
          id: selectedUserActivity.id,
          body: updatedActivity
        }));
      }
    }
  };

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
    });
    setUpdatedActivity({
      ...selectedUserActivity
    });
  }, [navigation])

  if (!selectedUserActivity || !currentUser) {
    return (<View />)
  }

  return (
    <View style={[layoutStyles.screenContainer]}>
      {
        editMode && updatedActivity ? (
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
            // onLayout={() => scrollViewRef?.current?.scrollToEnd()}
            // onContentSizeChange={() => scrollViewRef?.current?.scrollToEnd()}
          >
            <View style={[layoutStyles.mb_3]}>
              <View style={[layoutStyles.mt_2]}>
                <Image
                  source={
                    updatedActivity.getImageUrl ? (
                      {uri: updatedActivity.getImageUrl}
                    ) : require('../../assets/300x200.png')
                  }
                  style={[{ width: '100%', height: 200, borderRadius: 25}]}
                />
                <Pressable
                    onPress={() => pickImage(currentUser.id)}
                    style={[createActivityStyles.editImagePressable]}
                  >
                    <Image
                      source={require("../../assets/icons/CameraWhite.png")}
                      style={[createActivityStyles.editImageIcon]}
                    />
                  </Pressable>
              </View>
              <View style={[layoutStyles.mt_2]}>
                <CustomText h1 bold>
                  {selectedUserActivity.activityType?.activityTitle || 'Activity type not selected.'}
                </CustomText>
              </View>
              <View style={[layoutStyles.mt_2]}>
                <CustomText bold h4 style={[layoutStyles.mb_1]}>
                  Information
                </CustomText>
                <View style={[inputStyle.fullWidthInputContainer]}>
                  <TextInput
                    defaultValue={updatedActivity.information || ''}
                    multiline
                    onChangeText={(e) => {
                      setUpdatedActivity({
                        ...updatedActivity,
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
                    defaultValue={updatedActivity.favoriteLocations || ''}
                    multiline
                    onChangeText={(e) => {
                      setUpdatedActivity({
                        ...updatedActivity,
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
                    defaultValue={updatedActivity.yearsParticipating || ''}
                    multiline
                    onChangeText={(e) => {
                      setUpdatedActivity({
                        ...updatedActivity,
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
                    thumbColor={updatedActivity.seekingMentor ? '#CB1406' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={(e) => {
                      setUpdatedActivity({
                        ...updatedActivity,
                        seekingMentor: e,
                      })
                    }}
                    value={updatedActivity.seekingMentor}
                  />
                  <CustomText>Yes</CustomText>
                </View>
              </View>
              {
                updatedActivity.seekingMentor && (
                  <View style={[layoutStyles.mt_2]}>
                    <CustomText bold h4 style={[layoutStyles.mb_1]}>
                      Mentorship Needs
                    </CustomText>
                    <View style={[inputStyle.fullWidthInputContainer]}>
                      <TextInput
                        defaultValue={updatedActivity.mentorNeedsDetails || ''}
                        multiline
                        onChangeText={(e) => {
                          setUpdatedActivity({
                            ...updatedActivity,
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
                    thumbColor={updatedActivity.offeringMentorship ? '#CB1406' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={(e) => {
                      setUpdatedActivity({
                        ...updatedActivity,
                        offeringMentorship: e,
                      })
                    }}
                    value={updatedActivity.offeringMentorship}
                  />
                  <CustomText>Yes</CustomText>
                </View>
              </View>
              {
                updatedActivity.offeringMentorship && (
                  <View style={[layoutStyles.mt_2]}>
                    <CustomText bold h4 style={[layoutStyles.mb_1]}>
                      Mentorship Availability
                    </CustomText>
                    <View style={[inputStyle.fullWidthInputContainer]}>
                      <TextInput
                        defaultValue={updatedActivity.provideMentorshipDetails || ''}
                        multiline
                        onChangeText={(e) => {
                          setUpdatedActivity({
                            ...updatedActivity,
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
              <View style={[layoutStyles.mt_2]}>
                <PrimaryButton
                  buttonText='Save Activity'
                  callback={() => {
                    saveUpdatedActivity();
                    navigation.goBack();
                    }
                  }
                />
              </View>
              <View style={[layoutStyles.mt_2, layoutStyles.mb_2]}>
                <PrimaryButton
                  buttonText='Delete Activity'
                  callback={() => {
                    console.log('delete info here')
                    }
                  }
                  outline
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <View style={[layoutStyles.mb_3]}>
              <View style={[layoutStyles.mt_2]}>
                {
                  selectedUserActivity.getImageUrl && (
                    <Image
                      source={{ uri: selectedUserActivity.getImageUrl }}
                      style={[{ width: '100%', height: 200, borderRadius: 25}]}
                    />
                  )
                }
              </View>
              <View style={[layoutStyles.mt_2]}>
                <CustomText h1 bold>
                  {selectedUserActivity.activityType?.activityTitle || 'Activity type not selected.'}
                </CustomText>
              </View>
              <View style={[layoutStyles.mt_2]}>
                <CustomText bold h4 style={[layoutStyles.mb_1]}>
                  Information
                </CustomText>
                <CustomText>
                  {selectedUserActivity.information}
                </CustomText>
              </View>
              <View style={[layoutStyles.mt_2]}>
                <CustomText bold h4 style={[layoutStyles.mb_1]}>
                  Favorite Locations
                </CustomText>
                <CustomText>{selectedUserActivity.favoriteLocations}</CustomText>
              </View>
              <View style={[layoutStyles.mt_2]}>
                <CustomText bold h4 style={[layoutStyles.mb_1]}>
                  Years Participating
                </CustomText>
                <CustomText>
                  {selectedUserActivity.yearsParticipating}
                </CustomText>
              </View>
              {
                selectedUserActivity.seekingMentor && (
                  <View style={[layoutStyles.mt_2]}>
                    <CustomText bold h4 style={[layoutStyles.mb_1]}>
                      Mentorship Needs
                    </CustomText>
                    <CustomText>
                      {selectedUserActivity.mentorNeedsDetails}
                    </CustomText>
                  </View>
                )
              }
              {
                selectedUserActivity.offeringMentorship && (
                  <View style={[layoutStyles.mt_2]}>
                    <CustomText bold h4 style={[layoutStyles.mb_1]}>
                      Mentorship Availability
                    </CustomText>
                    <CustomText>
                      {selectedUserActivity.provideMentorshipDetails}
                    </CustomText>
                  </View>
                )
              }
            </View>
          </ScrollView>
        )
      }
    </View>
  );
};

export default ActivityDescription;