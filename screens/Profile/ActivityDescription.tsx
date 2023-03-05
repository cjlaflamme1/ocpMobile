import React, { useState } from 'react';
import { ScrollView, View, Image, RefreshControl } from 'react-native';
import CustomText from '../../components/CustomText';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getOneUserActivityAsync } from '../../store/userActivitySlice';
import layoutStyles from '../../styles/layout';

interface Props {
  navigation: any
};

const ActivityDescription: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const currentState = useAppSelector((state) => ({
    userActivityState: state.userActivityState,
  }));
  const dispatch = useAppDispatch();
  const { selectedUserActivity } = currentState.userActivityState;
  const onRefresh = async () => {
    setRefreshing(true);
      if (selectedUserActivity) {
        await dispatch(getOneUserActivityAsync(selectedUserActivity.id));
      }
    setRefreshing(false);
  }

  if (!selectedUserActivity) {
    return (<View />)
  }

  return (
    <View style={[layoutStyles.screenContainer]}>
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
    </View>
  );
};

export default ActivityDescription;