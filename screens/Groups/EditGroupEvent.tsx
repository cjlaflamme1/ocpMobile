import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, TextInput, Platform, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import CustomText from '../../components/CustomText';
import * as ImagePicker from 'expo-image-picker';
import {Buffer} from "buffer";
import PrimaryButton from '../../components/PrimaryButton';
import inputStyle from '../../styles/componentStyles/inputBar';
import { Picker } from '@react-native-picker/picker';
import layoutStyles from '../../styles/layout';
import createGroupStyles from '../../styles/screenStyles/groups/createGroup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { postPresignedUrl, putImageOnS3 } from '../../api/s3API';
import DateTimePicker from '@react-native-community/datetimepicker';
import { dateOnly } from '../../services/timeAndDate';
import { GroupEvent, UpdateGroupEventDto, getOneGroupEventAsync, updateGroupEventAsync } from '../../store/groupEventSlice';
import { NavigationProp } from '@react-navigation/native';
import TitleWithBackButton from '../../components/headers/TitleBackButton';
import { manipulateAsync } from 'expo-image-manipulator';

interface Props {
  navigation: NavigationProp<any, any>;
  route: any;
};

interface TimeSelection {
  hour: number;
  minute: number;
  ampm: 'AM' | 'PM'
}

interface CreateGroupEvent {
  title: string;
  description: string;
}

const EditGroupEvent: React.FC<Props> = ({ navigation, route }) => {
  const [eventObj, setEventObj] = useState<UpdateGroupEventDto>();
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset>();
  const scrollViewRef = useRef<KeyboardAwareScrollView|null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<TimeSelection>();
  // const [groupEvent, setGroupEvent] = useState<CreateGroupEvent>();
  const dispatch = useAppDispatch();

  const eventId = route.params.eventId;

  const currentUser = useAppSelector((state) => state.userState.currentUser);

  const clearState = () => {
    setEventObj(undefined);
    setSelectedImage(undefined);
  }

  useEffect(() => {
    if (!eventObj || eventObj.id !== eventId) {
      dispatch(getOneGroupEventAsync(eventId)).then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          const currEvent: GroupEvent = res.payload;
          setEventObj(currEvent);
          setSelectedDate(currEvent.eventDate);
          const eventHours = new Date(currEvent.eventDate).getHours();
          setSelectedTime({
            hour: eventHours <= 11 ? eventHours : eventHours - 12,
            minute: new Date(currEvent.eventDate).getMinutes(),
            ampm: eventHours > 11 ? 'PM' : 'AM'
          })
        }
      })
    }
    if (!selectedTime) {
      setSelectedTime({
        hour: 1,
        minute: 0,
        ampm: 'AM',
      });
    }
    const nav = { navigation: navigation, defaultView: 'Groups Landing'}
    navigation.setOptions({
      header: () => (
        <TitleWithBackButton title='Edit Event' nav={nav} />
      )
    });
    return () => {
      clearState();
    }
  }, [navigation]);

  if (!currentUser || !selectedTime || !eventObj || !eventObj) {
    return (<View />);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      aspect: [4, 3],
      quality: Platform.OS === 'ios' ? 0 : .2,
    });
    if ((result.canceled === false) && result.assets.length > 0 && result.assets[0].base64) {
      const currentFile = result.assets[0];
      setSelectedImage(currentFile);
    };
  };

  const submitGroupEvent = async () => {
    setSubmitting(true);
    let newCoverImage = eventObj.coverPhoto || '';
    if (selectedImage && selectedImage.base64) {
      const resizedImage = await manipulateAsync(selectedImage.uri, [{ resize: { width: 700 } }], { base64: true });
      if (!resizedImage.base64) {
        console.log('error');
        return;
      }
      const imageExt = selectedImage.uri.split('.').pop();
      const imageFileName = `${eventObj.title}-${selectedImage.fileName}`;

      const buff = Buffer.from(resizedImage.base64, "base64");
      const preAuthPostUrl = await postPresignedUrl({ fileName: imageFileName, fileType: `${selectedImage.type}/${imageExt}`, fileDirectory: 'groupEventImages'}).then((response) => response).catch((e) => {
        return e;
      });
      if (preAuthPostUrl.status === 201 && preAuthPostUrl.data) {
        await putImageOnS3(preAuthPostUrl.data, buff, `${selectedImage.type}/${imageExt}`).catch((e) => console.log(e));
        newCoverImage = `groupEventImages/${imageFileName}`;
      }
    }
    if (eventObj.title && eventObj.description && selectedDate) {
      const formattedEventDate: Date = new Date(selectedDate);
      if ((selectedTime.ampm === 'AM') || selectedTime.hour === 12) {
        formattedEventDate.setHours(selectedTime.hour, selectedTime.minute);
      } else if (selectedTime.hour !== 12) {
        formattedEventDate.setHours((selectedTime.hour + 12), selectedTime.minute);
      }
      const createdEvent = await dispatch(updateGroupEventAsync({
        id: eventId,
        data: {
          title: eventObj.title,
          description: eventObj.description,
          coverPhoto: newCoverImage,
          eventDate: formattedEventDate,
        }
      }));
      if (createdEvent.meta.requestStatus === 'fulfilled') {
        clearState();
        dispatch(getOneGroupEventAsync(eventId));
        navigation.goBack();
      } else {
        // TODO: add some error handling
      }
    }
    setSubmitting(false);
  };

  const { width } = Dimensions.get('window');

  return (
    <View style={[layoutStyles.screenContainer]}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
        // onLayout={() => scrollViewRef?.current?.scrollToEnd()}
        // onContentSizeChange={() => scrollViewRef?.current?.scrollToEnd()}
      >
        <View style={[layoutStyles.mb_3]}>
          <View style={[layoutStyles.mt_2]}>
            <CustomText h1 bold>Create Group Event</CustomText>
          </View>
          {
            eventObj.coverPhoto
            && !selectedImage
            && (
              <View style={[layoutStyles.mt_2]}>
                <Image
                  source={{uri: eventObj.coverPhoto}}
                  style={[{ width: '100%', height: (width * 0.75), borderRadius: 25}]}
                />
                <Pressable
                    onPress={pickImage}
                    style={[createGroupStyles.editImagePressable]}
                  >
                    <Image
                      source={require("../../assets/icons/CameraWhite.png")}
                      style={[createGroupStyles.editImageIcon]}
                      contentFit='contain'
                    />
                  </Pressable>
              </View>
            )
          }
          {
            selectedImage
            && (
              <View style={[layoutStyles.mt_2]}>
                <Image
                  source={{uri: selectedImage.uri}}
                  style={[{ width: '100%', height: (width * 0.75), borderRadius: 25}]}
                />
                <Pressable
                    onPress={pickImage}
                    style={[createGroupStyles.editImagePressable]}
                  >
                    <Image
                      source={require("../../assets/icons/CameraWhite.png")}
                      style={[createGroupStyles.editImageIcon]}
                      contentFit='contain'
                    />
                  </Pressable>
              </View>
            )
          }
          {
            !selectedImage
            && !eventObj.coverPhoto
            && (
              <View style={[createGroupStyles.addImageContainer, layoutStyles.mt_3]}>
                <Pressable
                  style={({pressed}) => {
                    if (pressed) {
                      return [createGroupStyles.addImagePressable, createGroupStyles.pressed]
                    } else {
                      return [createGroupStyles.addImagePressable]
                    }
                  }}
                  onPress={pickImage}
                >
                  <Image 
                    source={require('../../assets/icons/Camera.png')}
                    style={[{width: 24, height: 24}]}
                  />
                </Pressable>
              </View>
            )
          }
          <View style={[layoutStyles.mt_2]}>
            <CustomText bold style={[layoutStyles.mb_1]}>
              Event Name
            </CustomText>
            <View style={[inputStyle.fullWidthInputContainer]}>
              <TextInput
                placeholder='Enter event name'
                style={[inputStyle.fullWidthInput]}
                value={eventObj.title || ''}
                onChangeText={(e) => {
                  if (e) {
                    setEventObj({
                      ...eventObj,
                      title: e,
                    });
                  } else {
                    setEventObj({
                      ...eventObj,
                      title: '',
                    });
                  }
                }}
              />
            </View>
          </View>
          <View style={[layoutStyles.mt_2]}>
            <CustomText bold style={[layoutStyles.mb_1]}>
              Event Description
            </CustomText>
            <View style={[inputStyle.fullWidthInputContainer]}>
              <TextInput
                placeholder='Enter event description'
                style={[inputStyle.fullWidthInput, inputStyle.multilineInput]}
                multiline
                value={eventObj.description || ''}
                onChangeText={(e) => {
                  if (e) {
                    setEventObj({
                      ...eventObj,
                      description: e,
                    })
                  } else {
                    setEventObj({
                      ...eventObj,
                      description: '',
                    })
                  }
                }}
              />
            </View>
          </View>
          <View style={[layoutStyles.dFlex, layoutStyles.jCenter, layoutStyles.mt_3]}>
            {
              Platform.OS === 'android'
              && (
                <View style={[layoutStyles.mb_3]}>
                  {
                    showDatePicker
                    && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={selectedDate ? new Date(selectedDate) : new Date()}
                        minimumDate={new Date()}
                        mode={'date'}
                        is24Hour={true}
                        onChange={(value) => {
                          setShowDatePicker(!showDatePicker);
                          if (value.nativeEvent.timestamp) {
                            setSelectedDate(new Date(value.nativeEvent.timestamp));
                          }
                        }}
                      />
                    )
                  }
                    <CustomText bold style={[{ textAlign: 'center' }, layoutStyles.mt_3]}>{selectedDate ? dateOnly(selectedDate) : ''}</CustomText>
                    <PrimaryButton
                      outline
                      buttonText="Select Date"
                      styles={[layoutStyles.mt_3]}
                      callback={() => setShowDatePicker(!showDatePicker)}
                    />
                </View>
              )
            }
            {
              Platform.OS === 'ios'
              && (
              <View style={[layoutStyles.mb_2]}>
                <CustomText>Select Date</CustomText>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={selectedDate ? new Date(selectedDate) : new Date()}
                  minimumDate={new Date()}
                  mode={'date'}
                  display='inline'
                  onChange={(value) => {
                    if (value.nativeEvent.timestamp) {
                      setSelectedDate(new Date(value.nativeEvent.timestamp));
                    }
                  }}
                  style={[{ alignSelf: 'center', paddingTop: 10, paddingBottom: 10 }]}
                />
                <CustomText center>{(new Date(selectedDate || '')).toDateString()}</CustomText>
              </View>
              )
            }
            <View>
                <CustomText bold>Event Time</CustomText>
                <View style={[{ flexDirection: 'row' }]}>
                  <Picker
                    style={[{ width: '33%'}]}
                    selectedValue={selectedTime.hour}
                    onValueChange={(itemValue: number) => setSelectedTime({ ...selectedTime, hour: itemValue })}
                  >
                    {
                      [...Array(12).keys()].map((hour) => (
                        <Picker.Item
                          key={`hour=${hour}`}
                          label={`${hour + 1}`}
                          value={hour + 1}
                        />
                      ))
                    }
                  </Picker>
                  <Picker
                    style={[{ width: '33%'}]}
                    selectedValue={selectedTime.minute}
                    onValueChange={(itemValue: number) => setSelectedTime({ ...selectedTime, minute: itemValue })}
                  >
                    {
                      [0, 15, 30, 45].map((minute) => (
                        <Picker.Item
                          key={`minute-${minute}`}
                          label={minute <= 8 ? `0${minute}` : `${minute}`}
                          value={minute}
                        />
                      ))
                    }
                  </Picker>
                  <Picker
                    style={[{ width: '33%'}]}
                    selectedValue={selectedTime.ampm}
                    onValueChange={(itemValue: 'AM' | 'PM') => setSelectedTime({ ...selectedTime, ampm: itemValue })}
                  >
                    {
                      ['AM', 'PM'].map((val) => (
                        <Picker.Item
                          key={`ampm-${val}`}
                          label={val}
                          value={val}
                        />
                      ))
                    }
                  </Picker>
                </View>
              </View>
          </View>
          <View style={[layoutStyles.mt_3]}>
            <PrimaryButton
              buttonText='Update'
              disabled={submitting}
              callback={submitGroupEvent}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default EditGroupEvent;