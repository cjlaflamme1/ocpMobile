import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, ScrollView, View, Image, RefreshControl, AppState, Text, Button, Pressable, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import CustomText from '../../components/CustomText';
import layoutStyles from '../../styles/layout';
import globalStyles from '../../styles/global';
import groupViewStyle from '../../styles/screenStyles/groups/groupView';
import PostMessageCard from '../../components/groups/PostMessage';
import MessageCard from '../../components/groups/MessageCard';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearSelectedGroup, getOneGroupAsync } from '../../store/groupSlice';
import { clearPosts, clearSelectedPost, createGroupPostAsync, CreateGroupPostDto, createPostResponseAsync, getAllGroupPostsAsync, getOneGroupPostAsync } from '../../store/groupPostSlice';
import { QueryObject, SortOrder } from '../../models/QueryObject';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationProp, useRoute } from '@react-navigation/native';
import CommentResponse from '../../components/groups/CommentResponse';
import { timeSince } from '../../services/timeAndDate';
import TitleWithBackButton from '../../components/headers/TitleBackButton';

interface Props {
  navigation: NavigationProp<any, any>;
  route: any;
};

const ViewGroupMessage: React.FC<Props> = ({ navigation, route }) => {
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
  const postId = route.params.postId;
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useAppDispatch();
  const scrollViewRef = useRef<KeyboardAwareScrollView|null>(null);
  const selectedPost = useAppSelector((state) => state.groupPostState.selectedPost);

  useEffect(() => {
    if (!selectedPost || selectedPost.id !== postId) {
      dispatch(getOneGroupPostAsync(postId));
    }
    navigation.setOptions({
      header: () => (
        <TitleWithBackButton title='View Message' navigation={navigation} />
      )
    });
    return () => {
      dispatch(clearSelectedPost());
    }
  }, [navigation, postId]);

  if (!selectedPost) {
    return (<View />);
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(getOneGroupPostAsync(postId));
    setRefreshing(false);
  }

  const submitPostResponse = async (postBody: string) => {
    const res = await dispatch(createPostResponseAsync({
      responseText: postBody,
      groupPostId: selectedPost.id,
    }));
    if (res.meta.requestStatus === 'fulfilled') {
      await dispatch(getOneGroupPostAsync(selectedPost.id));
      return true;
    } else {
      return false;
    }
  }

  return (
    <View style={[layoutStyles.screenContainer, { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1}]}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ref={scrollViewRef}
      >
        <View style={[layoutStyles.mb_3]}>
          <View style={[layoutStyles.mt_2]}>
            <MessageCard
              userPosted={{
                name: `${selectedPost.author.firstName} ${selectedPost.author.lastName}`,
                profile: selectedPost.authorImageUrl ? { uri: selectedPost.authorImageUrl } : require('../../assets/150x150.png'),
              }}
              postId={{
                id: selectedPost.id,
                postText: selectedPost.postText,
                postImage: selectedPost.imageGetUrl ? { uri: selectedPost.imageGetUrl } : undefined,
                createdAt: selectedPost.createdAt,
              }}
              navigation={navigation}
              responseCount={0}
            />
          </View>
          <View style={[layoutStyles.mb_3]}>
            <CommentResponse
              buttonText='Submit Response'
              placeholderText='Enter response here...'
              handleSubmit={(e) => submitPostResponse(e)}
              navigation={navigation}
            />
          </View>
          {
            selectedPost.responses &&
            selectedPost.responses.length > 0 ?
            selectedPost.responses.map((postResponse) => (
              <View key={`postResponse-${postResponse.id}`}>
                <View style={[layoutStyles.flexRow, layoutStyles.jBetween, layoutStyles.mt_1, layoutStyles.mb_1]}>
                  <View style={[layoutStyles.flexRow, layoutStyles.alignItemCenter]}>
                    <Image
                      source={
                          postResponse.author &&
                          postResponse.author.imageGetUrl ?
                           { uri: postResponse.author.imageGetUrl } :
                            require('../../assets/150x150.png')
                      }
                      style={[messageStyle.postProfileImage, layoutStyles.mr_2]}
                    />
                    <CustomText>{`${postResponse.author.firstName} ${postResponse.author.lastName}`}</CustomText>
                  </View>
                </View>
                <View style={[messageStyle.cardContainer]}>
                  <CustomText>{postResponse.responseText}</CustomText>
                </View>
                <View style={[layoutStyles.mt_1, layoutStyles.mb_1, layoutStyles.alignItemEnd]}>
                  <CustomText style={[ globalStyles.mutedText]}>
                    {timeSince(new Date(postResponse.createdAt))} ago
                  </CustomText>
                </View>
              </View>
            )) : (
              <View>
                <View style={[messageStyle.cardContainer]}>
                  <CustomText>No responses yet.</CustomText>
                </View>
              </View>
            )
          }
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ViewGroupMessage;

const messageStyle = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
  },
  postProfileImage: {
    width: 32,
    height: 32,
    borderRadius: 25,
    resizeMode: 'contain',
  },
  iconStyle: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  }
});