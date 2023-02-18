import React, { useState } from 'react';
import { View, Image, ScrollView, RefreshControl, Pressable, TextInput } from 'react-native';
import CustomText from '../../components/CustomText';
import GroupCard from '../../components/GroupCard';
import PrimaryButton from '../../components/PrimaryButton';
import UserIconSmall from '../../components/UserIconSmall';
import inputStyle from '../../styles/componentStyles/inputBar';
import globalStyles from '../../styles/global';
import layoutStyles from '../../styles/layout';
import createGroupStyles from '../../styles/screenStyles/groups/createGroup';
import groupsLandingStyle from '../../styles/screenStyles/groups/groupsLanding';

interface Props {
  navigation: any
};

const CreateGroup: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    // Refresh functions here
    setRefreshing(false);
  }
  return (
    <View style={[layoutStyles.screenContainer]}>
      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={[layoutStyles.mb_3]}>
          <View style={[layoutStyles.mt_2]}>
            <CustomText h1 bold>Create Group</CustomText>
          </View>
          <View style={[createGroupStyles.addImageContainer, layoutStyles.mt_3]}>
            <Pressable
              // style={[createGroupStyles.addImagePressable]}
              style={({pressed}) => {
                if (pressed) {
                  return [createGroupStyles.addImagePressable, createGroupStyles.pressed]
                } else {
                  return [createGroupStyles.addImagePressable]
                }
              }}
            >
              <Image 
                source={require('../../assets/icons/Camera.png')}
                style={[{width: 24, height: 24}]}
              />
            </Pressable>
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText style={[layoutStyles.mb_1]}>
              Group Name
            </CustomText>
            <View style={[inputStyle.fullWidthInputContainer]}>
              <TextInput
                placeholder='Enter group name'
                style={[inputStyle.fullWidthInput]}
              />
            </View>
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText style={[layoutStyles.mb_1]}>
              Group Description
            </CustomText>
            <View style={[inputStyle.fullWidthInputContainer]}>
              <TextInput
                placeholder='Enter group description'
                style={[inputStyle.fullWidthInput]}
                multiline
              />
            </View>
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText style={[layoutStyles.mb_1]}>
              Invite Members
            </CustomText>
            <View style={[inputStyle.fullWidthInputContainer]}>
              <TextInput
                placeholder='Enter name'
                style={[inputStyle.fullWidthInput]}
              />
            </View>
          </View>
          <View style={[layoutStyles.flexRow, { flexWrap: 'wrap'}, layoutStyles.mt_2]}>
            <Pressable>
              <UserIconSmall
                imageSource={require('../../assets/profilePhotos/testProfile.jpg')}
                userName='Chad Laflamme'
              />
            </Pressable>
            <Pressable>
              <UserIconSmall
                imageSource={require('../../assets/profilePhotos/testProfile.jpg')}
                userName='Chad Laflamme'
              />
            </Pressable>
            <Pressable>
              <UserIconSmall
                imageSource={require('../../assets/profilePhotos/testProfile.jpg')}
                userName='Chad Laflamme'
              />
            </Pressable>
            <Pressable>
              <UserIconSmall
                imageSource={require('../../assets/profilePhotos/testProfile.jpg')}
                userName='Chad Laflamme'
              />
            </Pressable>
            <Pressable>
              <UserIconSmall
                imageSource={require('../../assets/profilePhotos/testProfile.jpg')}
                userName='Chad Laflamme'
              />
            </Pressable>
            <Pressable>
              <UserIconSmall
                imageSource={require('../../assets/profilePhotos/testProfile.jpg')}
                userName='Chad Laflamme'
              />
            </Pressable>
            <Pressable>
              <UserIconSmall
                imageSource={require('../../assets/profilePhotos/testProfile.jpg')}
                userName='Chad Laflamme'
              />
            </Pressable>
            <Pressable>
              <UserIconSmall
                imageSource={require('../../assets/profilePhotos/testProfile.jpg')}
                userName='Chad Laflamme'
              />
            </Pressable>
          </View>
          <View style={[layoutStyles.mt_3]}>
            <PrimaryButton
              buttonText='Create'
              callback={() => console.log('clicky')}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateGroup;