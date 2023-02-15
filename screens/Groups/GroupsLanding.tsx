import React, { useState } from 'react';
import { View, Image, ScrollView, RefreshControl, Pressable, TextInput } from 'react-native';
import CustomText from '../../components/CustomText';
import globalStyles from '../../styles/global';
import layoutStyles from '../../styles/layout';
import groupsLandingStyle from '../../styles/screenStyles/groupsLanding';

interface Props {
  navigation: any
};

const GroupsLanding: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [radioSelector, setRadioSelector] = useState(0);
  const onRefresh = () => {
    setRefreshing(true);
    // Refresh functions here
    setRefreshing(false);
  }
  return (
    <View style={[layoutStyles.screenContainer]}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={[
          layoutStyles.flexRow,
          layoutStyles.jBetween,
          layoutStyles.alignItemCenter,
          layoutStyles.mt_3,
          layoutStyles.mb_2,
          ]}
        >
          <CustomText h1 bold>Groups</CustomText>
          <Pressable style={[{ alignSelf: 'flex-end'}]}>
              <CustomText style={[globalStyles.redLink]}>+ Create New</CustomText>
          </Pressable>
        </View>
        <View style={[groupsLandingStyle.searchContainer]}>
          <Pressable
            // style={[groupsLandingStyle.searchIconPressable]}
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
          <Pressable onPress={() => setRadioSelector(0)} style={[(radioSelector <= 0 && groupsLandingStyle.bottomBorder)]}>
            <CustomText bold style={[groupsLandingStyle.radioText, (radioSelector > 0 && globalStyles.mutedText)]}>Your Groups</CustomText>
          </Pressable>
          <Pressable onPress={() => setRadioSelector(1)} style={[(radioSelector > 0 && groupsLandingStyle.bottomBorder)]}>
            <CustomText style={[groupsLandingStyle.radioText, (radioSelector <= 0 && globalStyles.mutedText)]}>Explore Groups</CustomText>
          </Pressable>
        </View>
        <View>
          {/* Search result widgets */}
        </View>
      </ScrollView>
    </View>
  );
};

export default GroupsLanding;