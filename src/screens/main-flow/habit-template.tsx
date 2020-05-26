import React, { useState } from 'react';
import {
  HabitTemplateProps,
  ActionSheetOwnProps,
  ReduxState,
} from '../../models';
import {
  View,
  StyleSheet,
  Image,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import sharedNavigationService from '../../services/navigation-service';
import colors from '../../utils/colors';
import NavButton from '../../componets/nav-button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { useSelector } from 'react-redux';
import {
  deleteHabit,
  updateHabit,
  createHabit,
} from '../../services/firebase-service';
import _ from 'lodash';
import DoneButton from '../../componets/done-button';
import HiveText from '../../componets/hive-text';
import moment from 'moment';

export default (props: HabitTemplateProps) => {
  const existingHabit = props.route.params?.habit;

  // month starts at index 0
  const today = `${moment()
    .year()
    .toString()}-${moment().month().toString()}-${moment().date().toString()}`;

  const [habitTitle, setHabitTitle] = useState(existingHabit?.title || '');
  const [count, setCount] = useState(existingHabit?.count || 0);
  const [currentStreak, setCurrentStreak] = useState(
    existingHabit?.streak.currentStreak || 0,
  );
  const [bestStreak, setBestStreak] = useState(
    existingHabit?.streak.bestStreak || 0,
  );
  const [latestTimestamp, setLatestTimestamp] = useState(
    existingHabit?.streak.latestTimestamp || today,
  );
  const userId = useSelector<ReduxState, string>((state) => state.userId);
  const savedTime = moment(latestTimestamp, 'YYYY-MM-DD');

  const updateOrCreateHabit = async () => {
    try {
      if (existingHabit) {
        sharedNavigationService.navigate({ page: 'Loader' });
        await updateHabit({
          id: existingHabit.id,
          title: _.trim(habitTitle) || `Untitled`,
          count: count,
          timestamp: existingHabit.timestamp,
          streak: {
            currentStreak: currentStreak,
            bestStreak: bestStreak,
            latestTimestamp: latestTimestamp,
          },
          userId,
        });
        sharedNavigationService.navigate({ page: 'HomeReset' });
      } else {
        const newHabitTitle = _.trim(habitTitle);

        if (newHabitTitle) {
          sharedNavigationService.navigate({ page: 'Loader' });
          await createHabit({
            title: newHabitTitle,
            count: count,
            userId,
          });
          sharedNavigationService.navigate({ page: 'HomeReset' });
        } else {
          Alert.alert('You must give your habit a title before creating it!');
        }
      }
    } catch (error) {
      // Same as dismissing loader
      sharedNavigationService.goBack();
      Alert.alert('Uh oh!', `Couldn't save habit. ${error.message}`);
    }
  };

  const triggerDeleteHabit = () => {
    Alert.alert(
      'Are you sure you want to delete this habit?',
      'This action cannot be undone.',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            sharedNavigationService.navigate({ page: 'Loader' });
            try {
              await deleteHabit({ id: existingHabit.id, userId });
              sharedNavigationService.navigate({ page: 'HomeReset' });
            } catch (error) {
              // Same as dismissing loader
              sharedNavigationService.navigate({
                page: 'HabitTemplate',
                props: {
                  habit: existingHabit || null,
                },
              });
              Alert.alert('Uh oh!', `Couldn't delete habit. ${error.message}`);
            }
          },
        },
      ],
    );
  };

  const subMenuOptions: ActionSheetOwnProps = {
    options: [
      {
        onPress: triggerDeleteHabit,
        buttonType: 'third',
        title: 'Delete Habit',
      },
    ],
  };

  props.navigation.setOptions({
    headerTitle: () => (
      <Image
        style={styles.templateIcon}
        source={require('../../assets/habit-icon.png')}
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
    headerRight: () =>
      existingHabit ? (
        <NavButton
          onPress={() =>
            sharedNavigationService.navigate({
              page: 'ActionSheet',
              props: subMenuOptions,
            })
          }
          position={'right'}
          icon={'subMenu'}
        />
      ) : null,
    headerStyle: { shadowColor: colors.lightGray },
  });

  const renderHabitTitleSection = () => {
    return (
      <View style={styles.habitContainer}>
        <TextInput
          selectionColor={colors.salmonRed}
          placeholderTextColor={colors.lightPurple}
          style={styles.titleInput}
          placeholder={'Untitled'}
          value={habitTitle}
          onChangeText={(text) => setHabitTitle(text)}
        />
      </View>
    );
  };

  const renderCountSection = () => {
    const updateStreak = () => {
      const convertedToday = moment(today, 'YYYY-MM-DD');
      const distanceInDays = moment
        .duration(convertedToday.diff(savedTime))
        .asDays();

      console.log('today', convertedToday);
      console.log('difference in ms:', convertedToday.diff(savedTime));
      console.log('difference in days: ' + distanceInDays);

      // set streak to zero if more than one day has passed
      if (distanceInDays > 1) {
        console.log('clear streak');
        setCurrentStreak(0);
      }

      // if one day has passed, increment streak
      else if (distanceInDays == 1) {
        console.log('increment once');
        setCurrentStreak(currentStreak + 1);
      }

      if (currentStreak > bestStreak) {
        console.log('best');
        setBestStreak(currentStreak);
      }

      setLatestTimestamp(today);
    };

    return (
      <View style={styles.countSection}>
        <HiveText style={styles.countDescriptionLabel} variant={'bold'}>
          {'NUMBER OF TIMES COMPLETED'}
        </HiveText>
        <View style={styles.countBar}>
          <View style={styles.countButtonContainer}>
            <TouchableOpacity
              style={styles.buttonIconContainer}
              onPress={() => {
                if (count) {
                  setCount(count - 1);
                  updateStreak();
                }
              }}
            >
              <Image
                style={styles.buttonIcon}
                resizeMode={'contain'}
                source={require('../../assets/minus-icon.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.countLabelContainer}>
            <HiveText variant={'bold'} style={styles.countLabel}>
              {count.toString()}
            </HiveText>
          </View>
          <View style={styles.countButtonContainer}>
            <TouchableOpacity
              style={styles.buttonIconContainer}
              onPress={() => {
                setCount(count + 1);
                updateStreak();
              }}
            >
              <Image
                style={styles.buttonIcon}
                resizeMode={'contain'}
                source={require('../../assets/add-icon.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderStreakSection = () => {
    return (
      <View style={styles.streakSection}>
        <View style={styles.currentStreakSection}>
          <HiveText
            style={styles.currentStreakDescriptionLabel}
            variant={'bold'}
          >
            {'CURRENT STREAK'}
          </HiveText>
          <View style={styles.currentStreakLabel}>
            <HiveText variant={'bold'} style={styles.currentStreakValue}>
              {currentStreak.toString()}
            </HiveText>
          </View>
        </View>
        <View style={styles.bestStreakSection}>
          <HiveText style={styles.bestStreakDescriptionLabel} variant={'bold'}>
            {'BEST STREAK'}
          </HiveText>
          <View style={styles.bestStreakLabel}>
            <HiveText variant={'bold'} style={styles.bestStreakLabelValue}>
              {bestStreak.toString()}
            </HiveText>
          </View>
        </View>
      </View>
    );
  };

  // const renderColorPaletteSection = () => {
  //   <View style={styles.colorPaletteSection}>
  //      <HiveText variant={'semi-bold'}>{'Select a Color:'}</HiveText>
  //   </View>
  // }

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 130 }}
        keyboardShouldPersistTaps={'handled'}
        automaticallyAdjustContentInsets={false}
      >
        {renderHabitTitleSection()}
        {renderCountSection()}
        {renderStreakSection()}
        {/* {renderColorPalette()} */}
      </KeyboardAwareScrollView>
      <DoneButton onPress={updateOrCreateHabit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
  },
  templateIcon: {
    height: 44,
    width: 44,
  },
  habitContainer: {
    flex: 1,
  },
  titleInput: {
    fontFamily: 'PulpDisplay-Bold',
    color: colors.offBlack,
    marginVertical: 8,
    fontSize: 30,
  },
  countSection: {
    paddingVertical: 24,
  },
  countDescriptionLabel: {
    color: colors.offBlack,
    fontSize: 16,
    fontFamily: 'PulpDisplay-Bold',
  },
  countBar: {
    flexDirection: 'row',
    height: 50,
    width: 220,
    backgroundColor: 'rgba(203, 192, 211, 0.2)', // light purple w/ opacity
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  countButtonContainer: {
    height: 40,
    width: 40,
    borderRadius: 999,
    backgroundColor: colors.skyBlue,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    width: 35,
  },
  buttonIcon: {
    height: 32,
    width: 32,
    tintColor: colors.white,
  },
  countLabelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countLabel: {
    fontSize: 30,
  },
  streakSection: {
    flex: 1,
  },
  currentStreakSection: {
    marginBottom: 24,
  },
  currentStreakDescriptionLabel: {
    color: colors.offBlack,
    fontSize: 16,
    fontFamily: 'PulpDisplay-Bold',
    marginBottom: 4,
  },
  currentStreakLabel: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  currentStreakValue: {
    fontSize: 30,
  },
  bestStreakSection: {
    flex: 1,
  },
  bestStreakDescriptionLabel: {
    color: colors.offBlack,
    fontSize: 16,
    fontFamily: 'PulpDisplay-Bold',
    marginBottom: 4,
  },
  bestStreakLabel: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  bestStreakLabelValue: {
    fontSize: 30,
  },
});
