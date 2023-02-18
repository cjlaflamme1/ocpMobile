import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Image, RefreshControl, AppState, Text, Button, Pressable, FlatList } from 'react-native';
import { FlashList } from "@shopify/flash-list";
import CustomText from '../../components/CustomText';
import layoutStyles from '../../styles/layout';
import globalStyles from '../../styles/global';
import groupViewStyle from '../../styles/screenStyles/groups/groupView';
import PostMessageCard from '../../components/groups/PostMessage';
import MessageCard from '../../components/groups/MessageCard';

interface Props {
  navigation: any
};

const GroupView: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [radioSelector, setRadioSelector] = useState(0);
  const onRefresh = () => {
    setRefreshing(true);
    // Refresh functions here
    setRefreshing(false);
  }
  return (
    <View style={[layoutStyles.screenContainer]}>
      <ScrollView showsVerticalScrollIndicator={false}  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={[layoutStyles.mb_3]}>
          <View style={[layoutStyles.mt_2]}>
            <Image
              source={require('../../assets/profilePhotos/testSportImage.jpg')}
              style={[{ width: '100%', height: 200, borderRadius: 25}]}
            />
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText h1 bold>
              Backcountry Skiing
            </CustomText>
            <CustomText style={[globalStyles.mutedText]}>
              12 Members
            </CustomText>
          </View>
          <View style={[groupViewStyle.radioTextContainer]}>
            <Pressable onPress={() => setRadioSelector(0)} style={[(radioSelector <= 0 && groupViewStyle.bottomBorder)]}>
              <CustomText bold style={[groupViewStyle.radioText, (radioSelector > 0 && globalStyles.mutedText)]}>Message Board</CustomText>
            </Pressable>
            <Pressable onPress={() => setRadioSelector(1)} style={[(radioSelector > 0 && groupViewStyle.bottomBorder)]}>
              <CustomText style={[groupViewStyle.radioText, (radioSelector <= 0 && globalStyles.mutedText)]}>Events</CustomText>
            </Pressable>
          </View>
          <View style={[layoutStyles.mt_2, layoutStyles.mb_2]}>
            <PostMessageCard
              buttonText='Submit'
              placeholderText='Write post here.'
              groupId='12345'
            />
          </View>
          <View style={[layoutStyles.mb_2]}>
            <MessageCard
              userPosted={{
                name: 'Chad Laflamme',
                profile: require('../../assets/profilePhotos/testProfile.jpg')
              }}
              postId={{
                postText: 'We are hosting a new ski tour this weekend!',
                postImage: require('../../assets/profilePhotos/testSportImage.jpg')
              }}
              groupId={'1235677'}
            />
          </View>
          <View style={[layoutStyles.mb_2]}>
            <MessageCard
              userPosted={{
                name: 'Chad Laflamme',
                profile: require('../../assets/profilePhotos/testProfile.jpg')
              }}
              postId={{
                postText: 'Who is excited???  We are hosting a new ski tought coming up this weekend!!!  Get ready for the big announcement.',
              }}
              groupId={'1235677876'}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default GroupView;