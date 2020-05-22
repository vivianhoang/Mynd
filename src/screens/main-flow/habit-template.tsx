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
      <TextInput
          selectionColor={colors.salmonRed}
          placeholderTextColor={colors.lightPurple}
          style={styles.titleInput}
          placeholder={'Untitled'}
          value={habitTitle}
          onChangeText={text => setHabitTitle(text)}
        />
    </View>)
  }

  const renderCountSection = () => {
    return (

    <View style={styles.countSectionContainer}>
      <HiveText style={styles.countDescriptionLabel} variant={'bold'}>{'NUMBER OF TIMES COMPLETED'}</HiveText>
      <View style={styles.countBar}>
        <View style={styles.countButtonContainer}>
          <TouchableOpacity style={styles.buttonIconContainer} onPress={() => {
            if (count) {
              setCount(count - 1);
            }
          }}>
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
          <TouchableOpacity style={styles.buttonIconContainer} onPress={() => {
            setCount(count + 1);
          }}>
            <Image
              style={styles.buttonIcon}
              resizeMode={'contain'}
              source={require('../../assets/add-icon.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
    )
  }

  // const renderColorPaletteSection = () => {
  //   <View style={styles.colorPaletteSection}>
  //      <HiveText variant={'semi-bold'}>{'Select a Color:'}</HiveText>
  //   </View>
  // }

  return (
    <View style={{flex: 1}}>
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
  titleInput: {
    fontFamily: 'PulpDisplay-Bold',
    color: colors.offBlack,
    marginVertical: 8,
    fontSize: 30
  },
  countSectionContainer: {
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
    marginTop: 16
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
    color: colors.white
  },
  countLabelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  countLabel: {
    fontSize: 30,
  }
});
