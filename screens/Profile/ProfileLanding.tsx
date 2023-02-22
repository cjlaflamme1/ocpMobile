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
  return (
    <View style={[layoutStyles.screenContainer]}>
      <ScrollView showsVerticalScrollIndicator={false}  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={[layoutStyles.m_1, layoutStyles.mt_3, layoutStyles.mb_3]}>
          <View style={[imageStyles.profileImageContainer]}>
            <Image
              source={require("../../assets/profilePhotos/testProfile.jpg")}
              style={[imageStyles.profileImage]}
            />
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