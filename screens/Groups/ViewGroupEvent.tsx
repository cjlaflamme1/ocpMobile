import React, { useEffect, useRef, useState } from 'react';
import { View, RefreshControl } from 'react-native';
import layoutStyles from '../../styles/layout';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { QueryObject, SortOrder } from '../../models/QueryObject';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { clearSelectedEvent, getOneGroupEventAsync } from '../../store/groupEventSlice';
import ViewEvent from '../../components/events/ViewEvent';
import { NavigationProp } from '@react-navigation/native';
import TitleWithBackButton from '../../components/headers/TitleBackButton';

interface Props {
  navigation: NavigationProp<any, any>;
  route: any;
};

const ViewGroupEvent: React.FC<Props> = ({ navigation, route }) => {
  const [refreshing, setRefreshing] = useState(false);
  const eventId = route.params.eventId;
  const dispatch = useAppDispatch();
  const scrollViewRef = useRef<KeyboardAwareScrollView|null>(null);
  const selectedGroupEvent = useAppSelector((state) => state.groupEventState.selectedGroupEvent);
  const currentUser = useAppSelector((state) => state.userState.currentUser)

  useEffect(() => {
    if (!selectedGroupEvent || eventId !== selectedGroupEvent.id) {
      dispatch(getOneGroupEventAsync(eventId));
    }
    navigation.setOptions({
      header: () => (
        <TitleWithBackButton title='View Event' navigation={navigation} />
      )
    });
    return () => {
      dispatch(clearSelectedEvent());
    }
  }, [navigation]);

  if (!selectedGroupEvent || !currentUser) {
    return (<View />);
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(getOneGroupEventAsync(eventId));
    setRefreshing(false);
  }

  return (
    <View style={[layoutStyles.screenContainer, { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1}]}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ref={scrollViewRef}
      >
        <View style={[layoutStyles.mb_3]}>
          <View>
            <ViewEvent navigation={navigation} event={selectedGroupEvent} currentUser={currentUser} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ViewGroupEvent;
