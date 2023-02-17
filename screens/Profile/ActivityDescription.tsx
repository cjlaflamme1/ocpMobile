import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Image, RefreshControl, AppState, Text, Button, Pressable, FlatList } from 'react-native';
import { FlashList } from "@shopify/flash-list";
import CustomText from '../../components/CustomText';
import layoutStyles from '../../styles/layout';

interface Props {
  navigation: any
};

const ActivityDescription: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    // Refresh functions here
    setRefreshing(false);
  }
  const exampleList = [
    {
      text: 'The Troll Peninsula'
    },
    {
      text: 'Sogndal, Norway'
    },
    {
      text: 'Mt Washington, NH'
    }
  ]
  return (
    <View style={[layoutStyles.screenContainer]}>
      <ScrollView showsVerticalScrollIndicator={false}  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
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
        </View>
        <View style={[layoutStyles.mt_2]}>
          <CustomText bold h4 style={[layoutStyles.mb_1]}>
            Information
          </CustomText>
          <CustomText>
            Lorem ipsum dolor sit amet consectetur. Orci iaculis tristique facilisis tortor eu euismod purus lobortis. Leo maecenas tellus justo vel laoreet gravida.
          </CustomText>
        </View>
        <View style={[layoutStyles.mt_2]}>
          <CustomText bold h4 style={[layoutStyles.mb_1]}>
            Favorite Locations
          </CustomText>
          <View style={[layoutStyles.ml_2]}>
            {
              exampleList &&
              exampleList.length > 0 &&
              exampleList.map((item, index) => {
                return <CustomText key={`${index}-${item.text}`} style={[layoutStyles.ml_2, layoutStyles.mb_1]}>{item.text}</CustomText>
              })
            }
          </View>
        </View>
        <View style={[layoutStyles.mt_2]}>
          <CustomText bold h4 style={[layoutStyles.mb_1]}>
            Years Participating
          </CustomText>
          <CustomText>
            2 Years
          </CustomText>
        </View>
        <View style={[layoutStyles.mt_2]}>
          <CustomText bold h4 style={[layoutStyles.mb_1]}>
            Mentorship Needs
          </CustomText>
          <CustomText>
            I would love to find a ski partner who can help me develop in....
          </CustomText>
        </View>
        <View style={[layoutStyles.mt_2]}>
          <CustomText bold h4 style={[layoutStyles.mb_1]}>
            Mentorship Availability
          </CustomText>
          <CustomText>
            I'm happy to offer tips on how to ski horrendous New England conditions to skiers of any ability.
          </CustomText>
        </View>
      </ScrollView>
    </View>
  );
};

export default ActivityDescription;