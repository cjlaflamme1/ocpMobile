import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Image, RefreshControl, AppState, Text } from 'react-native';
import CustomText from '../../components/CustomText';
import globalStyles from '../../styles/global';
import imageStyles from '../../styles/images';

interface Props {
  navigation: any
};

const ProfileLanding: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    // Refresh functions here
    setRefreshing(false);
  }
  return (
    <View>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View>
          <Image
            source={require("../../assets/profilePhotos/testProfile.jpg")}
            style={[imageStyles.profileImage]}
          />
          <CustomText h1 bold>
            Chad Laflamme
          </CustomText>
          <View>
            <Image 
              source={{uri: "https://via.placeholder.com/15"}}
              style={{width: 15, height: 15}}
            />
            <CustomText>Tamworth, NH</CustomText>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileLanding;