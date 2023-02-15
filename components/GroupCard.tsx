import React from 'react';
import { View, Image, ImageSourcePropType } from 'react-native';
import globalStyles from '../styles/global';
import groupCardStyles from '../styles/screenStyles/groups/groupCard';
import CustomText from './CustomText';

interface Props {
  groupTitle: string,
  numberOfMembers: number,
  imageSource?: ImageSourcePropType,
};

const GroupCard: React.FC<Props> = (props: Props) => {
  const {
    groupTitle,
    imageSource,
    numberOfMembers
  } = props;

  return (
    <View style={[groupCardStyles.cardBackground]}>
      <View style={[groupCardStyles.imageContainer]}>
        {
          imageSource &&
          (
            <Image
              source={imageSource}
              style={[groupCardStyles.image]}
            />
          )
        }
      </View>
      <View style={[groupCardStyles.textContainer]}>
        <CustomText bold>
          {groupTitle}
        </CustomText>
        <CustomText style={[globalStyles.mutedText]}>
          {`${numberOfMembers} member${(numberOfMembers !== 1) ? 's' : ''}`}
        </CustomText>
      </View>
    </View>
  );
};

GroupCard.defaultProps = {
  imageSource: undefined,
}

export default GroupCard;