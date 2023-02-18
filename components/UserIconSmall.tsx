import React from 'react';
import { View, Image, ImageSourcePropType } from 'react-native';
import globalStyles from '../styles/global';
import layoutStyles from '../styles/layout';
import groupCardStyles from '../styles/screenStyles/groups/groupCard';
import CustomText from './CustomText';

interface Props {
  userName: string,
  imageSource?: ImageSourcePropType,
};

const UserIconSmall: React.FC<Props> = (props: Props) => {
  const {
    userName,
    imageSource,
  } = props;

  return (
    <View style={[layoutStyles.mt_1]}>
      <View style={[layoutStyles.dFlex, layoutStyles.alignItemCenter, { maxWidth: '90%'}]}>
        {
          imageSource &&
          (
            <Image
              source={imageSource}
              style={[{ width: 72, height: 72, borderRadius: 50 }]}
            />
          )
        }
      </View>
      <View style={[{ maxWidth: '90%' }, layoutStyles.dFlex, layoutStyles.alignItemCenter]}>
        <CustomText style={[{ textAlign: 'center'}]}>{userName}</CustomText>
      </View>
    </View>
  );
};

UserIconSmall.defaultProps = {
  imageSource: undefined,
}

export default UserIconSmall;