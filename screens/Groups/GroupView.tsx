import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Image, RefreshControl, AppState, Text, Button, Pressable, FlatList } from 'react-native';
import CustomText from '../../components/CustomText';
import layoutStyles from '../../styles/layout';
import globalStyles from '../../styles/global';
import groupViewStyle from '../../styles/screenStyles/groups/groupView';
import PostMessageCard from '../../components/groups/PostMessage';
import MessageCard from '../../components/groups/MessageCard';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearSelectedGroup, createGroupInvitesAsync, getOneGroupAsync } from '../../store/groupSlice';
import { clearPosts, createGroupPostAsync, CreateGroupPostDto, getAllGroupPostsAsync } from '../../store/groupPostSlice';
import { QueryObject, SortOrder } from '../../models/QueryObject';
import SendInviteModal from '../../components/groups/SendInviteModal';
import InviteModal from '../../components/groups/InviteModal';
import { User } from '../../store/userSlice';
import PrimaryButton from '../../components/PrimaryButton';
import { getAllGroupEventsAsync } from '../../store/groupEventSlice';
import EventCard from '../../components/groups/GroupEventCard';
import UserListModal from '../../components/modals/UserListModal';

interface Props {
  navigation: any
};

const GroupView: React.FC<Props> = ({ navigation }) => {
  const [queryParams, setQueryParams] = useState<QueryObject>({
    pagination: {
      skip: 0,
      take: 10,
    },
    orderBy: {
      column: 'createdAt',
      order: SortOrder.DESC,
    }
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [radioSelector, setRadioSelector] = useState(0);
  const dispatch = useAppDispatch();
  const currentState = useAppSelector((state) => ({
    groupState: state.groupState,
    groupPostState: state.groupPostState,
    groupEventState: state.groupEventState,
  }));
  const { selectedGroup } = currentState.groupState;
  const { currentGroupsPosts } = currentState.groupPostState;
  const { currentGroupEvents } = currentState.groupEventState;

  useEffect(() => {
    if (selectedGroup) {
      if (!currentGroupsPosts || currentGroupsPosts.count <= 0) {
        dispatch(getAllGroupPostsAsync({
          pagination: {
            skip: 0,
            take: 10,
          },
          orderBy: {
            column: 'createdAt',
            order: SortOrder.DESC,
          },
          filters: [{
            name: 'group.id',
            value: selectedGroup.id,
          }]
        }));
        dispatch(getAllGroupEventsAsync({
          pagination: {
            skip: 0,
            take: 10,
          },
          orderBy: {
            column: 'createdAt',
            order: SortOrder.DESC,
          },
          filters: [{
            name: 'group.id',
            value: selectedGroup.id,
          }]
        }))
      }
      navigation.setOptions({
        headerRight: () => (
          <Pressable
            style={[layoutStyles.flexRow,
            layoutStyles.alignItemCenter]}
            onPress={() => setModalVisible(true)}
          >
            <Image
              source={require('../../assets/icons/Plus.png')}
              style={[{ height: 20, width: 20, resizeMode: 'contain'}, layoutStyles.mr_1]}
            />
            <CustomText>
              Invite Members
            </CustomText>
          </Pressable>
        )
      });
    }
    return () => {
      dispatch(clearPosts());
      dispatch(clearSelectedGroup());
    }
  }, [navigation]);

  if (!selectedGroup) {
    return (<View />);
  }
  const memberNumber = (selectedGroup.groupAdmins ? selectedGroup.groupAdmins.length : 0) + (selectedGroup.users ? selectedGroup.users.length : 0);

  const onRefresh = async () => {
    setRefreshing(true);
      await dispatch(getOneGroupAsync(selectedGroup.id));
      await dispatch(getAllGroupPostsAsync({
        ...queryParams,
        filters: [{
          name: 'group.id',
          value: selectedGroup.id,
        }]
      }));
    setRefreshing(false);
  }

  const submitNewPost = async (post: CreateGroupPostDto) => {
    const newPost = await dispatch(createGroupPostAsync(post));
    if (newPost && newPost.meta.requestStatus === 'fulfilled') {
      dispatch(getAllGroupPostsAsync({
        ...queryParams,
        filters: [{
          name: 'group.id',
          value: selectedGroup.id,
        }]
      }));
    }
  }

  const submitInvites = async (invites: Partial<User>[]) => {
    console.log(invites);
    const inviteSubmission = await dispatch(createGroupInvitesAsync({
      groupid: selectedGroup.id,
      userIds: invites.map((user) => user.id || ''),
    }));
    if (inviteSubmission.meta.requestStatus === 'fulfilled') {
      setModalVisible(false);
      onRefresh();
    }
  }

  return (
    <View style={[layoutStyles.screenContainer]}>
      <ScrollView showsVerticalScrollIndicator={false}  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={[layoutStyles.mb_3]}>
          <View style={[layoutStyles.mt_2]}>
            <Image
              source={ selectedGroup.imageGetUrl ? {
                uri: selectedGroup.imageGetUrl
              } : require('../../assets/300x200.png')}
              style={[{ width: '100%', height: 200, borderRadius: 25}]}
            />
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText h1 bold>
              { selectedGroup.title }
            </CustomText>
            <View style={[layoutStyles.dFlex, layoutStyles.flexRow]}>
              <Pressable style={[groupViewStyle.viewMembersButton]} onPress={() => setUserModal(true)}>
                <CustomText style={[globalStyles.mutedText, { textDecorationLine: 'underline' }]}>
                  {`${memberNumber} Member${(memberNumber > 1) ? 's' : ''}`}
                </CustomText>
              </Pressable>
            </View>
          </View>
          <View style={[groupViewStyle.radioTextContainer]}>
            <Pressable onPress={() => setRadioSelector(0)} style={[(radioSelector <= 0 && groupViewStyle.bottomBorder)]}>
              <CustomText bold style={[groupViewStyle.radioText, (radioSelector > 0 && globalStyles.mutedText)]}>Message Board</CustomText>
            </Pressable>
            <Pressable onPress={() => setRadioSelector(1)} style={[(radioSelector > 0 && groupViewStyle.bottomBorder)]}>
              <CustomText style={[groupViewStyle.radioText, (radioSelector <= 0 && globalStyles.mutedText)]}>Events</CustomText>
            </Pressable>
          </View>
          {
            radioSelector === 0 &&
            (
              <View>
                <View style={[layoutStyles.mt_2, layoutStyles.mb_2]}>
                  <PostMessageCard
                    buttonText='Submit'
                    placeholderText='Write post here.'
                    groupId={selectedGroup.id}
                    handleSubmit={(post) => submitNewPost(post)}
                  />
                </View>
                {
                  currentGroupsPosts &&
                  currentGroupsPosts.count > 0 &&
                  currentGroupsPosts.groupPosts?.map((post) => (
                    <View key={`grouppost-${post.id}`} style={[layoutStyles.mb_2]}>
                      <MessageCard
                        navigation={navigation}
                        userPosted={{
                          name: `${post.author.firstName} ${post.author.lastName}`,
                          profile: post.authorImageUrl ? { uri: post.authorImageUrl } : require('../../assets/150x150.png'),
                        }}
                        postId={{
                          id: post.id,
                          postText: post.postText,
                          postImage: post.imageGetUrl ? { uri: post.imageGetUrl } : undefined,
                          createdAt: post.createdAt,
                        }}
                        responseCount={post.responses ? post.responses.length : 0}
                      />
                    </View>
                  ))
                }
              </View>
            )
          }
          {
            radioSelector === 1 &&
            (
              <View>
                <View style={[layoutStyles.mt_2, layoutStyles.mb_2]}>
                  <PrimaryButton
                    buttonText="Create New Event"
                    callback={() => navigation.navigate('Create Group Event')}
                  />
                </View>
                {
                  currentGroupEvents &&
                  currentGroupEvents.groupEvents &&
                  currentGroupEvents.groupEvents.length > 0 &&
                  currentGroupEvents.groupEvents.map((event) => (
                    <EventCard
                      key={`eventCard-${event.id}`}
                      userPosted={{
                        name: event.creator.firstName,
                        profile: event.creator.imageGetUrl ? { uri: event.creator.imageGetUrl } : require('../../assets/150x150.png'),
                      }}
                      event={{
                        id: event.id,
                        postImage: event.imageGetUrl ? { uri: event.imageGetUrl } : undefined,
                        title: event.title,
                        createdAt: event.createdAt,
                        eventDate: event.eventDate,
                      }}
                      responseCount={event.responses ? event.responses.length : 0}
                      joiningCount={event.attendingUsers ? event.attendingUsers.length : 0}
                      navigation={navigation}
                    />
                  ))
                }
              </View>
            )
          }
        </View>
      </ScrollView>
      <SendInviteModal
        groupId={selectedGroup.id}
        isVisible={modalVisible}
        closeModal={() => setModalVisible(false)}
        rejectAction={() => setModalVisible(false)}
        acceptAction={(e) => submitInvites(e)}
        navigation
        selectedGroup={selectedGroup}
      />
      <UserListModal
        navigation={navigation}
        isVisible={userModal}
        closeModal={() => setUserModal(false)}
        userList={[...new Set([...(selectedGroup.users || []), ...(selectedGroup.groupAdmins || [])])]}
      />
    </View>
  );
};

export default GroupView;