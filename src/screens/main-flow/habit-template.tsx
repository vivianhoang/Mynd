import React, { useState, } from 'react';
import { HabitTemplateProps, ActionSheetOwnProps, ReduxState } from '../../models';
import { View, StyleSheet, Image, Alert, TextInput, TouchableOpacity } from 'react-native';
import sharedNavigationService from '../../services/navigation-service';
import colors from '../../utils/colors';
import NavButton from '../../componets/nav-button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { useSelector } from 'react-redux';
import { deleteHabit, updateHabit, createHabit } from '../../services/firebase-service';
import _ from 'lodash';
import DoneButton from '../../componets/done-button';
import HiveText from '../../componets/hive-text';

export default (props: HabitTemplateProps) => {
  const existingHabit = props.route.params?.habit;

  const [habitTitle, setHabitTitle] = useState(existingHabit?.title || '');
  const [count, setCount] = useState(existingHabit?.count || 0);
  const [color, setColor] = useState(existingHabit?.color);
  const userId = useSelector<ReduxState, string>(state => state.userId);

  const updateOrCreateHabit = async () => {
      sharedNavigationService.navigate({ page: 'Loader' });
      try {
        if (existingHabit) {
          await updateHabit({
            id: existingHabit.id,
            title: _.trim(habitTitle) || `Untitled`,
            color: color,
            count: count,
            timestamp: existingHabit.timestamp,
            userId,
          });
        } else {
          const newHabitTitle = _.trim(habitTitle)

          if (_.trim(habitTitle)) {
            await createHabit({
              title: newHabitTitle,
              color: color,
              count: count,
              userId,
            });
          } else {
            Alert.alert('You must give your habit a title before creating it!')
          }
  
        }
        sharedNavigationService.navigate({ page: 'HomeReset' });
      } catch (error) {
        // Same as dismissing loader
      sharedNavigationService.goBack();
        Alert.alert('Uh oh!', `Couldn't save habit. ${error.message}`);
    };
  }

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
              Alert.alert(
                'Uh oh!',
                `Couldn't delete habit. ${error.message}`,
              );
            }
          },
        },
      ],
    );
  }

  const subMenuOptions: ActionSheetOwnProps = {
    options: [{onPress: triggerDeleteHabit, buttonType: 'third', title: 'Delete Habit'}]
  }

  props.navigation.setOptions({
    headerTitle: () => (
      <Image
        style={styles.templateIcon}
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
    headerRight: () => existingHabit ?
      <NavButton 
      onPress={() => sharedNavigationService.navigate({
        page: 'ActionSheet',
        props: subMenuOptions
      })}
      position={'right'}
      icon={'subMenu'}
      />
    : null,
    headerStyle: { shadowColor: colors.lightGray },
  });
  const renderHabitTitleSection = () => {

    return (
    <View style={styles.habitContainer}>
      <HiveText style={styles.titleSection} variant={'semi-bold'}>{'Habit Name:'}</HiveText>
      <TextInput
          selectionColor={colors.salmonRed}
          placeholderTextColor={colors.lightPurple}
          style={styles.titleInput}
          placeholder={'Untitled'}
          value={habitTitle}
          onChangeText={text => setHabitTitle(text)}
        />
      <TextInput></TextInput>
    </View>)
  }

  const renderCountSection = () => {
    return (

    <View style={styles.countContainer}>
      <HiveText style={styles.titleSection} variant={'semi-bold'}>{'Current Count:'}</HiveText>
      <TextInput
        selectionColor={colors.salmonRed}
        placeholderTextColor={colors.lightPurple}
        style={styles.countInput}
        value={count.toString()}
      />
      <TouchableOpacity style={styles.iconContainer} onPress={() => {
        setCount(0);
      }}>
        <Image
          style={styles.clearIcon}
          source={require('../../assets/clear-icon.png')}
        ></Image>
      </TouchableOpacity>
    </View>
    )
  }

  // const renderColorPaletteSection = () => {
  //   <View style={styles.colorPaletteSection}>
  //      <HiveText variant={'semi-bold'}>{'Select a Color:'}</HiveText>
  //   </View>
  // }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView 
        style={styles.container}
        contentContainerStyle={{paddingBottom: 130}}
        keyboardShouldPersistTaps={'handled'}
        automaticallyAdjustContentInsets={false}
      >
        {renderHabitTitleSection()}
        {renderCountSection()}
        {/* {renderColorPalette()} */}
      </KeyboardAwareScrollView>
      <DoneButton onPress={updateOrCreateHabit}/>
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
    flex: 1
  },
  titleSection: {
    color: colors.offBlack,
    fontSize: 25,
    fontFamily: 'PulpDisplay-Bold',
  },
  titleInput: {
    fontFamily: 'PulpDisplay-Regular',
    color: colors.offBlack,
    marginVertical: 8,
    fontSize: 20
  },
  countContainer: {
    flex: 1,
  },
  countInput:{
    flex: 1,
    fontFamily: 'PulpDisplay-Medium',
    fontSize: 20,
    color: colors.offBlack,
    paddingLeft: 4,
  },
  iconContainer: {
    justifyContent: 'center',
  },
  clearIcon: {
    height: 32,
    width: 32,
    tintColor: colors.lightPurple,
  },
});
