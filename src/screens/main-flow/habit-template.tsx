import * as React from 'react';
import { HabitTemplateProps } from '../../models';
import { View, StyleSheet, Image } from 'react-native';
import HiveText from '../../componets/hive-text';
import sharedNavigationService from '../../services/navigation-service';
import colors from '../../utils/colors';
import NavButton from '../../componets/nav-button';

export default (props: HabitTemplateProps) => {
  props.navigation.setOptions({
    headerTitle: () => (
      <Image
        style={styles.titleIcon}
        source={require('../../assets/ideas-icon.png')} // UPDATE WITH REAL ICON
      />
    ),
    headerLeft: () => (
      <NavButton
        onPress={() => {
          sharedNavigationService.navigate({
            page: 'HomeReset',
          });
        }}
        title={'Cancel'}
        position={'left'}
      />
    ),
    headerStyle: { shadowColor: colors.lightGray },
  });
  return (
    <View style={styles.container}>
      <HiveText variant={'bold'}>{'Habit Settings Page'}</HiveText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
  },
  titleIcon: {
    height: 44,
    width: 44,
  },
});
