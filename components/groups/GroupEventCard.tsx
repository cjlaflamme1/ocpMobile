import React, { useEffect } from 'react';
import { View, Image, ImageSourcePropType, Pressable, TextInput, StyleSheet } from 'react-native';
import CustomText from '../CustomText';
import globalStyles from '../../styles/global';
import layoutStyles from '../../styles/layout';
import { timeSince } from '../../services/timeAndDate';
import { useAppDispatch } from '../../store/hooks';
import { getOneGroupPostAsync } from '../../store/groupPostSlice';
import { useRoute } from '@react-navigation/native';
import { getOneGroupEventAsync } from '../../store/groupEventSlice';

interface Props {
  userPosted: { name: string, profile: ImageSourcePropType },
  event: { id: string, postImage?: ImageSourcePropType, title: string, createdAt: Date, eventDate: Date },
  responseCount: number;
  joiningCount: number;
  navigation: any,
};

const EventCard: React.FC<Props> = (props: Props) => {
  const {
    userPosted,
    event,
    responseCount,
    joiningCount,
    navigation,
  } = props;
  const dispatch = useAppDispatch();
  const route = useRoute();

  const viewEvent = async (id: string) => {
    const post = await dispatch(getOneGroupEventAsync(id));
    if (post && post.meta.requestStatus === 'fulfilled') {
      navigation.navigate('View Group Event');
    }
  }

  return (
    <View style={[eventStyle.cardContainer]}>
      <Pressable
        onPress={() => viewEvent(event.id)}
      >
        <View style={[layoutStyles.flexRow, layoutStyles.jBetween, layoutStyles.mt_1, layoutStyles.mb_1]}>
          <View style={[layoutStyles.flexRow, layoutStyles.alignItemCenter]}>
            <Image
              source={userPosted.profile}
              style={[eventStyle.postProfileImage, layoutStyles.mr_2]}
            />
            <CustomText>{userPosted.name}</CustomText>
          </View>
          <View>
            <CustomText style={[ globalStyles.mutedText]}>
              {timeSince(new Date(event.createdAt))} ago
            </CustomText>
          </View>
        </View>
        {
          event &&
          event.postImage &&
          (
            <View>
              <Image
                source={event.postImage}
                style={[{ width: '100%', height: 150, borderRadius: 25}]}
              />
            </View>
          )
        }
        <View style={[layoutStyles.mt_1, layoutStyles.mb_1]}>
          <CustomText>
            {event.title}
          </CustomText>
        </View>
        <View style={[layoutStyles.flexRow, layoutStyles.jBetween, layoutStyles.mt_2, layoutStyles.mb_1]}>
          {/* TODO: replace 'likes' with clickable response options that are set by posting user: such as 'yes', 'no' 'maybe', whatev */}
          {/* <View style={[layoutStyles.flexRow]}>
            <Pressable onPress={() => console.log('I like it!')}>
              <Image
                style={[eventStyle.iconStyle]}
                source={require('../../assets/icons/heartempty.png')}
              />
            </Pressable>
            <CustomText style={[globalStyles.mutedText, layoutStyles.ml_1]}>1k</CustomText>
          </View> */}
          {
            route.name !== "View Comment" &&
            (
              <View style={[layoutStyles.flexRow]}>
                <Image
                  style={[eventStyle.iconStyle]}
                  source={require('../../assets/icons/comment.png')}
                />
                <CustomText style={[globalStyles.mutedText, layoutStyles.ml_1]}>
                  {`${responseCount} comment${(responseCount !== 1) ? 's' : ''}`}
                </CustomText>
              </View>
            )
          }
          {
            route.name !== "View Comment" &&
            (
              <View style={[layoutStyles.flexRow]}>
                <Image
                  style={[eventStyle.iconStyle]}
                  source={require('../../assets/icons/GroupsUnfocused.png')}
                />
                <CustomText style={[globalStyles.mutedText, layoutStyles.ml_1]}>
                  {`${joiningCount} joining`}
                </CustomText>
              </View>
            )
          }
          {/* TODO: Share will be added when/if direct messaging exists */}
          {/* <View style={[layoutStyles.flexRow]}>
            <Pressable onPress={() => console.log('I want to share it!')}>
              <Image
                style={[eventStyle.iconStyle]}
                source={require('../../assets/icons/share.png')}
              />
            </Pressable>
            <CustomText style={[globalStyles.mutedText, layoutStyles.ml_1]}>1k</CustomText>
          </View> */}
        </View>
      </Pressable>
    </View>
  );
};

export default EventCard;

const eventStyle = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    padding: 10,
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