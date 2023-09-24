import { ImageSourcePropType } from "react-native";
import { ActivityType } from "../store/activityTypeSlice";

export const selectDefaultImage = (activityType: ActivityType): ImageSourcePropType => {
  if (activityType.activityTitle === 'Backcountry Skiing') {
    return require('../assets/profilePhotos/testSportImage.jpg');
  } else if (activityType.activityTitle === 'Paddling') {
    return require('../assets/defaultImages/canoeDefault.png');
  }
  return require('../assets/defaultImages/defaultRunning.png');
};
