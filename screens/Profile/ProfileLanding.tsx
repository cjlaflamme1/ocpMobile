import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Image, RefreshControl, AppState, Text, Button, Pressable } from 'react-native';
import ProfileActivityCard from '../../components/ProfileActivityCard';
import CustomText from '../../components/CustomText';
import globalStyles from '../../styles/global';
import imageStyles from '../../styles/images';
import layoutStyles from '../../styles/layout';
import profileLandingStyles from '../../styles/screenStyles/profileLanding';
import { logoutAction } from '../../store/authSlice';
import { useAppDispatch } from '../../store/hooks';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from "expo-file-system";

interface Props {
  navigation: any
};

const ProfileLanding: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useAppDispatch();
  const onRefresh = () => {
    setRefreshing(true);
    // Refresh functions here
    setRefreshing(false);
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      aspect: [3, 3],
      quality: 0,
    });

    if (result.canceled === false) {
      console.log(result);
      // const imageExt = result.uri.split('.').pop();
      // const imageFileName = currentUser.email.split('@')[0];
      // const base64 = await FileSystem.readAsStringAsync(result.uri, {
      //   encoding: FileSystem.EncodingType.Base64,
      // });
      // const buff = Buffer.from(base64, "base64");
      // const preAuthPostUrl = await postPresignedUrl({ fileName: imageFileName, fileType: `${result.type}/${imageExt}`}).then((response) => response).catch((e) => {
      //   return e;
      // });
      // if (preAuthPostUrl.status === 201 && preAuthPostUrl.data) {
      //   // await putImageOnS3(preAuthPostUrl.data, buff, `${result.type}/${imageExt}`).catch((e) => console.log(e));
      //   // dispatch(updateCurrentUserAsync({ id: currentUser.id, updateBody: {
      //   //   profilePhoto: imageFileName,
      //   // }}))
      // }
    };
  };
  return (
    <View style={[layoutStyles.screenContainer]}>
      <ScrollView showsVerticalScrollIndicator={false}  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={[layoutStyles.m_1, layoutStyles.mt_3, layoutStyles.mb_3]}>
          <View style={[imageStyles.profileImageContainer]}>
            <View>
              <Image
                source={require("../../assets/profilePhotos/testProfile.jpg")}
                style={[imageStyles.profileImage]}
              />
              <Pressable
                onPress={pickImage}
                style={[{ position: 'absolute', right: 0, bottom: 0, backgroundColor: 'white', borderRadius: 10}]}
              >
                <Image
                  source={require("../../assets/icons/Plus.png")}
                  style={[{ height: 35, width: 35, resizeMode: 'contain'}]}
                />
              </Pressable>
            </View>
          </View>
          <CustomText h2 bold center>
            Chad Laflamme
          </CustomText>
          <View style={[layoutStyles.flexRow, layoutStyles.jCenter, layoutStyles.m_1]}>
            <Image 
              source={require('../../assets/icons/location.png')}
              style={[{width: 16, height: 16, alignSelf: 'center'}]}
            />
            <CustomText style={[globalStyles.mutedText]}>Tamworth, NH</CustomText>
          </View>
        </View>
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
      </ScrollView>
    </View>
  );
};

export default ProfileLanding;