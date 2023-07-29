import React from 'react';
import { View, Image, ImageSourcePropType, Modal, StyleSheet, Pressable, ScrollView } from 'react-native';
import { User } from '../../store/userSlice';
import CustomText from '../CustomText';
import UserIconSmall from '../UserIconSmall';
import { NavigationProp } from '@react-navigation/native';

interface Props {
  isVisible: boolean;
  userList: User[];
  closeModal: () => void;
  navigation: NavigationProp<any, any>;
};

const UserListModal: React.FC<Props> = (props: Props) => {
  const {
    userList,
    isVisible,
    closeModal,
    navigation
  } = props;

  const viewUser = (userId: string) => {
    navigation.navigate('Search', { screen: 'View User', initial: false, params: { userId: userId } })
    closeModal();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}
    >
      <View style={[modalStyle.centeredView]}>
        <View style={[modalStyle.modalView]}>
          <Pressable style={[{ position: 'absolute', right: 20, top: 20}]} onPress={closeModal}>
            <CustomText>
              X
            </CustomText>
          </Pressable>
          <View style={[{ maxHeight: 500, paddingTop: 20, paddingBottom: 20 }]}>
            <ScrollView>
              {
                userList &&
                userList.length > 0 &&
                userList
                  .slice()
                  .map((user) => (
                    <Pressable style={[modalStyle.userListItem]} onPress={() => viewUser(user.id)}>
                      {
                        user.imageGetUrl &&
                        (
                          <Image
                              source={{ uri: user.imageGetUrl }}
                              style={[{ width: 72, height: 72, borderRadius: 50, marginRight: 10 }]}
                            />
                        )
                      }
                      <CustomText>{`${user.firstName} ${user.lastName}`}</CustomText>
                    </Pressable>
                  ))
              }
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UserListModal;

const modalStyle = StyleSheet.create({
  userListItem: {
    display: 'flex',
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center'
  },
  cardContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 16,
  },
  postProfileImage: {
    width: 32,
    height: 32,
    borderRadius: 25,
    resizeMode: 'contain',
  },
  iconStyle: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%'
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});