import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView, RefreshControl, Pressable, TextInput } from 'react-native';
import CustomText from '../../components/CustomText';
import GroupCard from '../../components/GroupCard';
import { getAllGroupsAsync } from '../../store/groupSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import globalStyles from '../../styles/global';
import layoutStyles from '../../styles/layout';
import searchLandingStyle from '../../styles/screenStyles/search/searchLanding';

interface Props {
  navigation: any
};

const SearchLanding: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useAppDispatch();
  const currentState = useAppSelector((state) => ({
    groupState: state.groupState,
  }));
  const { searchForGroups } = currentState.groupState;

  useEffect(() => {
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
    await dispatch(getAllGroupsAsync({
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
          <CustomText style={[globalStyles.mutedText]}>{!searchForGroups.groups || searchForGroups.groups.length <= 0 ? 'No' : searchForGroups.groups.length} results found.</CustomText>
        </View>
        <View>
          {
            searchForGroups &&
            searchForGroups.groups &&
            searchForGroups.groups.length > 0 ?
            searchForGroups.groups.map((group) => (
              <Pressable key={`userGroupCard-${group.id}`} onPress={() => console.log('review group screen, whatev')}>
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
      </ScrollView>
    </View>
  );
};

export default SearchLanding;