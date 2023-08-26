import React from 'react';
import {
  View, Image, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import layoutStyles from '../../styles/layout';
import CustomText from '../CustomText';
import titleWithButtonStyle from '../../styles/headerStyles/titleWithButton';
import { NavigationProp } from '@react-navigation/native';

interface Props {
  navigation?: NavigationProp<any, any>;
  title: string;
  children?: any;
  // profileFunction: Function;
}

const TripleHeader: React.FC<Props> = ({ navigation, title, children }) => {
  // const { profileFunction } = props;
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[layoutStyles.flexRow, layoutStyles.alignItemCenter, layoutStyles.jBetween, titleWithButtonStyle.headerContainer, { paddingTop: insets.top + 5 }]}
    >
      <View>
        <Pressable
          onPress={() => navigation ? navigation.goBack() : null}
          style={[titleWithButtonStyle.iconButton, layoutStyles.alignItemCenter, layoutStyles.jCenter]}
        >
          <Image
            style={[titleWithButtonStyle.icon]}
            source={require('../../assets/icons/backButtonIcon.png')}
          />
        </Pressable>
      </View>
      <View style={[layoutStyles.mt_1, layoutStyles.mb_1, layoutStyles.dFlex]}>
        <CustomText style={[{ flexWrap: 'wrap', flexShrink: 1 }]} bold h4>{title}</CustomText>
      </View>
      {
        children ? (
          <View>
            {children}
          </View>
        ) : (
          <View style={[titleWithButtonStyle.iconButton]} />
        )
      }
    </View>
  );
};

export default TripleHeader;

TripleHeader.defaultProps = {
  navigation: undefined,
  children: undefined,
}