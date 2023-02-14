import { StyleSheet } from 'react-native';

const profileLandingStyles = StyleSheet.create({
  cardColumn: {
    maxWidth: '45%',
    width: '45%',
    marginTop: 20,
  },
  cardRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  }
});

export default profileLandingStyles;