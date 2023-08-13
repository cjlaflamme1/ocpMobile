import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Image, ScrollView, RefreshControl, Pressable, TextInput, Text } from 'react-native';
import layoutStyles from '../../styles/layout';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import CustomText from '../CustomText';
import bottomSheet from '../../styles/componentStyles/bottomSheet';

interface Props {
  customSnapPoints: number[] | string[];
  bottomSheetRef: React.RefObject<any>;
  closeSheet: () => void;
  inviteMembers: () => void;
  viewMembers: () => void;
  viewDescription: () => void;
  editGroup: () => void;
  adminView: boolean;
};

const SettingsSheet: React.FC<Props> = (props) => {
  const {
    customSnapPoints,
    closeSheet,
    bottomSheetRef,
    inviteMembers,
    viewMembers,
    viewDescription,
    editGroup,
    adminView,
  } = props;
  

  const snapPoints = useMemo(() => customSnapPoints, [customSnapPoints]);

  const inviteOthers = () => {
    closeSheet();
    inviteMembers();
  };

  const viewList = () => {
    closeSheet();
    viewMembers();
  };

  const openDescription = () => {
    closeSheet();
    viewDescription();
  };

  const submitEditGroup = () => {
    if (adminView) {
      closeSheet();
      editGroup();
    };
  };

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
            style={[layoutStyles.flexRow,
            layoutStyles.alignItemCenter]}
            onPress={() => inviteOthers()}
          >
            <Image
              source={require('../../assets/icons/Plus.png')}
              style={[bottomSheet.itemIcon]}
            />
            <CustomText>Invite Members</CustomText>
          </Pressable>
        </View>
        <View style={[bottomSheet.itemContainer]}>
          <Pressable
            style={[layoutStyles.flexRow,
            layoutStyles.alignItemCenter]}
            onPress={() => viewList()}
          >
            <Image
              source={require('../../assets/icons/GroupBlack.png')}
              style={[bottomSheet.itemIcon]}
            />
            <CustomText>View Member List</CustomText>
          </Pressable>
        </View>
        <View style={[bottomSheet.itemContainer]}>
          <Pressable
            style={[layoutStyles.flexRow,
            layoutStyles.alignItemCenter]}
            onPress={() => openDescription()}
          >
            <Image
              source={require('../../assets/icons/DescriptionBlack.png')}
              style={[bottomSheet.itemIcon]}
            />
            <CustomText>View Member Description</CustomText>
          </Pressable>
        </View>
        {
          adminView &&
          (
            <View style={[bottomSheet.itemContainer]}>
              <Pressable
                style={[layoutStyles.flexRow,
                layoutStyles.alignItemCenter]}
                onPress={() => submitEditGroup()}
              >
                <Image
                  source={require('../../assets/icons/Edit.png')}
                  style={[bottomSheet.itemIcon]}
                />
                <CustomText>Edit Group</CustomText>
              </Pressable>
            </View>
          )
        }
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default SettingsSheet;