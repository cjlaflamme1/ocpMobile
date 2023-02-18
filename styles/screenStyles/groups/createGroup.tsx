import { StyleSheet } from 'react-native';

const createGroupStyles = StyleSheet.create({
  addImagePressable: {
    height: 100,
    width: 100,
    backgroundColor: '#EDEDED',
    borderRadius: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  addImageContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  pressed: {
    backgroundColor: 'grey',
  }
});

export default createGroupStyles;