import React, { useState } from 'react';
import { View, Image, ScrollView, RefreshControl, Pressable, TextInput } from 'react-native';
import CustomText from '../../components/CustomText';
import GroupCard from '../../components/GroupCard';
import globalStyles from '../../styles/global';
import layoutStyles from '../../styles/layout';
import searchLandingStyle from '../../styles/screenStyles/search/searchLanding';

interface Props {
  navigation: any
};

const SearchLanding: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    // Refresh functions here
    setRefreshing(false);
  }
  return (
    <View style={[layoutStyles.screenContainer]}>
      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={[layoutStyles.mt_3, layoutStyles.mb_2]}>
          <CustomText h1 bold>Search Results</CustomText>
        </View>
        <View style={[searchLandingStyle.searchContainer]}>
          {/* TODO: Add more filter options here */}
          <Pressable
            // style={[groupsLandingStyle.searchIconPressable]}
            style={({pressed}) => {
              if (pressed) {
                return [searchLandingStyle.searchIconPressable, searchLandingStyle.searchIconPressed]
              } else {
                return [searchLandingStyle.searchIconPressable];
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
            style={[searchLandingStyle.searchBar]}
          />
        </View>
        <View style={[layoutStyles.mt_2]}>
          <CustomText style={[globalStyles.mutedText]}>4 results found for "Skiing"</CustomText>
        </View>
        <View>
          {/* Container for search results */}
          <GroupCard
            groupTitle='MWV Backgrountry Skiing'
            numberOfMembers={12}
            imageSource={require('../../assets/profilePhotos/testSportImage.jpg')}
          />
          <GroupCard
            groupTitle='Ski friends 4 ever'
            numberOfMembers={8}
            imageSource={require('../../assets/profilePhotos/testSportImage.jpg')}
          />
          <GroupCard
            groupTitle='Yay slippery sticks'
            numberOfMembers={12}
            imageSource={require('../../assets/profilePhotos/testSportImage.jpg')}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default SearchLanding;