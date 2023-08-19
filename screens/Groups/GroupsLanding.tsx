import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView, RefreshControl, Pressable, TextInput } from 'react-native';
import CustomText from '../../components/CustomText';
import GroupCard from '../../components/GroupCard';
import InviteModal from '../../components/groups/InviteModal';
import PrimaryButton from '../../components/PrimaryButton';
import { getAllGroupsAsync, getAllInvitationsAsync, getAllUserGroupsAsync, getOneGroupAsync, updateGroupInviteAsync } from '../../store/groupSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import globalStyles from '../../styles/global';
import layoutStyles from '../../styles/layout';
import groupsLandingStyle from '../../styles/screenStyles/groups/groupsLanding';
import { NavigationProp } from '@react-navigation/native';

interface Props {
  navigation: NavigationProp<any, any>;
};

const GroupsLanding: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState('');
  const [exploreInvitations, setExploreInvitations] = useState(false);
  const dispatch = useAppDispatch();
  const allGroups = useAppSelector((state) => state.groupState.allGroups);
  const allInvitations = useAppSelector((state) => state.groupState.allInvitations);

  useEffect(() => {
    if (allGroups && allGroups.count <= 0) {
      dispatch(getAllUserGroupsAsync({
        pagination: {
          take: 8,
          skip: 0,
        }
      }))
    }
    if (!allInvitations || allInvitations.length <= 0) {
      dispatch(getAllInvitationsAsync());
    }
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all(
      [
        dispatch(getAllUserGroupsAsync({
          pagination: {
            take: 8,
            skip: 0,
          }
        })),
        dispatch(getAllInvitationsAsync()),
      ],
    )
    setRefreshing(false);
  }

  const viewUserGroup = async (id: string) => {
    const res = await dispatch(getOneGroupAsync(id));
    if (res.meta.requestStatus === 'fulfilled') {
      navigation.navigate('View Group');
    };
  }

  const inviteResponse = async (inviteId: string, accept: boolean) => {
    await dispatch(updateGroupInviteAsync({
      id: inviteId,
      body: {
        accepted: accept,
      },
    }))
    dispatch(getAllInvitationsAsync());
    dispatch(getAllUserGroupsAsync({
      pagination: {
        take: 8,
        skip: 0,
      }
    }))
    setSelectedInvite('');
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
          <Pressable onPress={() => setExploreInvitations(false)} style={[(!exploreInvitations && groupsLandingStyle.bottomBorder)]}>
            <CustomText bold style={[groupsLandingStyle.radioText, (exploreInvitations && globalStyles.mutedText)]}>Your Groups</CustomText>
          </Pressable>
          <Pressable onPress={() => setExploreInvitations(true)} style={[(exploreInvitations && groupsLandingStyle.bottomBorder)]}>
            <CustomText style={[groupsLandingStyle.radioText, (!exploreInvitations && globalStyles.mutedText)]}>Your Invitations</CustomText>
          </Pressable>
        </View>
        {
          exploreInvitations ?
          (
            <View style={[layoutStyles.mb_3]}>
              {
                allInvitations &&
                allInvitations.length > 0 ?
                allInvitations.map((invite) => (
                  <Pressable key={`inviteCard-${invite.id}`} onPress={() => setSelectedInvite(invite.id)}>
                    <GroupCard
                      groupTitle={invite.group.title}
                      numberOfMembers={invite.group.users ? invite.group.users.length : 0}
                      imageSource={invite.group.imageGetUrl ? {
                        uri: invite.group.imageGetUrl
                      } : require('../../assets/150x150.png')}
                    />
                    <InviteModal
                      invite={invite}
                      closeModal={() => setSelectedInvite('')}
                      isVisible={selectedInvite === invite.id}
                      acceptAction={() => inviteResponse(invite.id, true)}
                      rejectAction={() => inviteResponse(invite.id, false)}
                    />
                  </Pressable>
                )) : (
                  <View style={[layoutStyles.alignItemCenter, layoutStyles.mt_3]}>
                    <CustomText style={[layoutStyles.mb_3]}>You don't have any invitations.</CustomText>
                    <PrimaryButton
                      outline
                      buttonText='Search For Groups'
                      callback={() => navigation.navigate('Search', { screen: 'Search Landing' })}
                    />
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
                  <Pressable key={`userGroupCard-${group.id}`} onPress={() => viewUserGroup(group.id)}>
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
                    <CustomText style={[layoutStyles.mb_3]}>You haven't joined any groups yet.</CustomText>
                    <PrimaryButton
                      outline
                      buttonText='Search For Groups'
                      callback={() => navigation.navigate('Search', { screen: 'Search Landing' })}
                    />
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