import React, { useEffect, useRef, useState } from 'react';
import { View, RefreshControl } from 'react-native';
import layoutStyles from '../../styles/layout';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { QueryObject, SortOrder } from '../../models/QueryObject';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { clearSelectedEvent } from '../../store/groupEventSlice';

interface Props {
  navigation: any
};

const ViewGroupEvent: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useAppDispatch();
  const scrollViewRef = useRef<KeyboardAwareScrollView|null>(null);
  const currentState = useAppSelector((state) => ({
    groupEventState: state.groupEventState,
  }));
  const { selectedGroupEvent } = currentState.groupEventState;

  useEffect(() => {
    return () => {
      dispatch(clearSelectedEvent());
    }
  }, [navigation]);

  if (!selectedGroupEvent) {
    return (<View />);
  }

  const onRefresh = async () => {
    setRefreshing(true);
      console.log('refreshing');
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
          <View style={[layoutStyles.mt_2]}>
            {/* Card for View Event goes here. */}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ViewGroupEvent;
