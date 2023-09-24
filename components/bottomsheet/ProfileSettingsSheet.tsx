import React, { useMemo } from 'react';
import { View, Image, Pressable } from 'react-native';
import layoutStyles from '../../styles/layout';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import CustomText from '../CustomText';
import bottomSheet from '../../styles/componentStyles/bottomSheet';

interface Props {
  customSnapPoints: number[] | string[];
  bottomSheetRef: React.RefObject<any>;
  closeSheet: () => void;
  editProfile: () => void;
  logout: () => void;
};

const ProfileSettingsSheet: React.FC<Props> = (props) => {
  const {
    customSnapPoints,
    closeSheet,
    bottomSheetRef,
    editProfile,
    logout,
  } = props;
  

  const snapPoints = useMemo(() => customSnapPoints, [customSnapPoints]);

  const edit = () => {
    closeSheet();
    editProfile();
  };

  const logoutPress = () => {
    closeSheet();
    logout();
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
    >
      <BottomSheetScrollView contentContainerStyle={[bottomSheet.scrollView]}>
        <View style={[bottomSheet.itemContainer]}>
          <Pressable
            style={[layoutStyles.flexRow, layoutStyles.alignItemCenter]}
            onPress={() => edit()}
          >
            <Image
              source={require('../../assets/icons/Edit.png')}
              style={[{ height: 16, width: 16, resizeMode: 'contain'}, layoutStyles.mr_1]}
            />
            <CustomText>
              Edit Profile
            </CustomText>
          </Pressable>
        </View>
        <View style={[bottomSheet.itemContainer]}>
          <Pressable
            style={[layoutStyles.flexRow, layoutStyles.alignItemCenter]}
            onPress={() => logoutPress()}
          >
            <Image
              source={require('../../assets/icons/Logout.png')}
              style={[{ height: 16, width: 16, resizeMode: 'contain'}, layoutStyles.mr_1]}
            />
            <CustomText>
              Logout
            </CustomText>
          </Pressable>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default ProfileSettingsSheet;
