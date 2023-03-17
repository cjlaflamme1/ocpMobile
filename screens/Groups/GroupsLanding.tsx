import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView, RefreshControl, Pressable, TextInput } from 'react-native';
import CustomText from '../../components/CustomText';
import GroupCard from '../../components/GroupCard';
import { getAllGroupsAsync, getAllUserGroupsAsync } from '../../store/groupSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import globalStyles from '../../styles/global';
import layoutStyles from '../../styles/layout';
import groupsLandingStyle from '../../styles/screenStyles/groups/groupsLanding';

interface Props {
  navigation: any
};

const GroupsLanding: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [exploreGroups, setExploreGroups] = useState(false);
  const [radioSelector, setRadioSelector] = useState(0);
  const dispatch = useAppDispatch();
  const currentState = useAppSelector((state) => ({
    groupState: state.groupState,
  }));
  const { allGroups, searchForGroups } = currentState.groupState;

  useEffect(() => {
    if (allGroups && allGroups.count <= 0) {
      dispatch(getAllUserGroupsAsync({
        pagination: {
          take: 8,
          skip: 0,
        }
      }))
    }
    if (searchForGroups && searchForGroups.count <= 0) {
      dispatch(getAllGroupsAsync({
        pagination: {
          take: 8,
          skip: 0,
        }
      }));
    }
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(getAllUserGroupsAsync({
      pagination: {
        take: 8,
        skip: 0,
      }
    }))
    setRefreshing(false);
  }
  return (
    <View style={[layoutStyles.screenContainer]}>
      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={[
          layoutStyles.flexRow,
          layoutStyles.jBetween,
          layoutStyles.alignItemCenter,
          layoutStyles.mt_3,
          layoutStyles.mb_2,
          ]}
        >
          <CustomText h1 bold>Groups</CustomText>
          <Pressable onPress={() => navigation.navigate('Create Group')} style={[{ alignSelf: 'flex-end'}]}>
              <CustomText style={[globalStyles.redLink]}>+ Create New</CustomText>
          </Pressable>
        </View>
        <View style={[groupsLandingStyle.searchContainer]}>
          <Pressable
            style={({pressed}) => {
              if (pressed) {
                return [groupsLandingStyle.searchIconPressable, groupsLandingStyle.searchIconPressed]
              } else {
                return [groupsLandingStyle.searchIconPressable];
              }
            }}
          >
            <Image 
              source={require('../../assets/icons/searchBarIcon.png')}
              style={[{width: 24, height: 24}]}
            />
          </Pressable>
          <TextInput
            placeholder='Search'
            style={[groupsLandingStyle.searchBar]}
          />
        </View>
        <View style={[groupsLandingStyle.radioTextContainer]}>
          <Pressable onPress={() => setExploreGroups(false)} style={[(!exploreGroups && groupsLandingStyle.bottomBorder)]}>
            <CustomText bold style={[groupsLandingStyle.radioText, (exploreGroups && globalStyles.mutedText)]}>Your Groups</CustomText>
          </Pressable>
          <Pressable onPress={() => setExploreGroups(true)} style={[(exploreGroups && groupsLandingStyle.bottomBorder)]}>
            <CustomText style={[groupsLandingStyle.radioText, (!exploreGroups && globalStyles.mutedText)]}>Explore Groups</CustomText>
          </Pressable>
        </View>
        {
          exploreGroups ?
          (
            <View style={[layoutStyles.mb_3]}>
              {
                searchForGroups &&
                searchForGroups.groups &&
                searchForGroups.groups.length > 0 ?
                searchForGroups.groups.map((group) => (
                  <Pressable key={`userGroupCard-${group.id}`} onPress={() => navigation.navigate('View Group')}>
                    <GroupCard
                      groupTitle={group.title}
                      numberOfMembers={group.users ? group.users.length : 0}
                      imageSource={group.imageGetUrl ? {
                        uri: group.imageGetUrl
                      } : require('../../assets/150x150.png')}
                    />
                  </Pressable>
                )) : (
                  <View style={[layoutStyles.alignItemCenter, layoutStyles.mt_3]}>
                    <CustomText>No results, try other parameters.</CustomText>
                  </View>
                )
              }
            </View>
          ) : (
            <View style={[layoutStyles.mb_3]}>
              {
                allGroups &&
                allGroups.groups &&
                allGroups.groups.length > 0 ?
                allGroups.groups.map((group) => (
                  <Pressable key={`userGroupCard-${group.id}`} onPress={() => navigation.navigate('View Group')}>
                    <GroupCard
                      groupTitle={group.title}
                      numberOfMembers={group.users ? group.users.length : 0}
                      imageSource={group.imageGetUrl ? {
                        uri: group.imageGetUrl
                      } : require('../../assets/150x150.png')}
                    />
                  </Pressable>
                )) : (
                  <View style={[layoutStyles.alignItemCenter, layoutStyles.mt_3]}>
                    <CustomText>You haven't joined any groups yet.</CustomText>
                  </View>
                )
              }
            </View>
          )
        }
      </ScrollView>
    </View>
  );
};

export default GroupsLanding;