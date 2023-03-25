import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Image, RefreshControl, AppState, Text, Button, Pressable, FlatList } from 'react-native';
import CustomText from '../../components/CustomText';
import layoutStyles from '../../styles/layout';
import globalStyles from '../../styles/global';
import groupViewStyle from '../../styles/screenStyles/groups/groupView';
import PostMessageCard from '../../components/groups/PostMessage';
import MessageCard from '../../components/groups/MessageCard';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearSelectedGroup, getOneGroupAsync } from '../../store/groupSlice';
import { clearPosts, createGroupPostAsync, CreateGroupPostDto, getAllGroupPostsAsync } from '../../store/groupPostSlice';
import { QueryObject, SortOrder } from '../../models/QueryObject';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRoute } from '@react-navigation/native';

interface Props {
  navigation: any
};

const ViewGroupMessage: React.FC<Props> = ({ navigation }) => {
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
  const [refreshing, setRefreshing] = useState(false);
  const scrollViewRef = useRef<KeyboardAwareScrollView|null>(null);
  const dispatch = useAppDispatch();
  const currentState = useAppSelector((state) => ({
    groupState: state.groupState,
    groupPostState: state.groupPostState,
  }));
  const { selectedGroup } = currentState.groupState;
  const { selectedPost } = currentState.groupPostState;

  useEffect(() => {
    if (selectedPost) {
      console.log('get post responses');
    }
    return () => {
      console.log('clear selected posts')
    }
  }, [navigation]);

  if (!selectedPost) {
    return (<View />);
  }

  const onRefresh = async () => {
    setRefreshing(true);
      console.log('refreshing');
    setRefreshing(false);
  }

  return (
    <View style={[layoutStyles.screenContainer]}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ref={scrollViewRef}
      >
        <View style={[layoutStyles.mb_3]}>
          <View style={[layoutStyles.mb_2]}>
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
              navigation
            />
          </View>
          <View>
            <CustomText>This is where the responses go to</CustomText>
          </View>
          <View>
            <CustomText>The respond widget goes here.</CustomText>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ViewGroupMessage;