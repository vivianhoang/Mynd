import React, { useState, useRef } from 'react';
import {
  View,
  Platform,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { IdeaTemplateProps, ReduxState, ActionSheetOwnProps } from '../../models';
import NavButton from '../../componets/nav-button';
import sharedNavigationService from '../../services/navigation-service';
import colors from '../../utils/colors';
import { useSelector } from 'react-redux';
import * as _ from 'lodash';
import { TouchableOpacity } from 'react-native';
import {
  deleteIdea,
  updateIdea,
  createIdea,
} from '../../services/firebase-service';
import { topSpace } from '../../utils/layout';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import DoneButton from '../../componets/done-button';

export default (props: IdeaTemplateProps) => {
  const existingIdea = props.route.params?.idea;

  const [ideaTitle, setIdeaTitle] = useState(existingIdea?.title || '');
  const [ideaDescription, setIdeaDescription] = useState(
    existingIdea?.description || '',
  );

  const userId = useSelector<ReduxState, string>(state => state.userId);
  const descriptionInputRef = useRef<TextInput>(null);

  const updateOrCreateIdea = async () => {
    sharedNavigationService.navigate({ page: 'Loader' });
    try {
      if (existingIdea) {
        await updateIdea({
          id: existingIdea.id,
          title: _.trim(ideaTitle) || `Untitled`,
          description: ideaDescription,
          timestamp: existingIdea.timestamp,
          userId,
        });
      } else {
        const newIdeaDescription =
          _.trim(ideaDescription) || `What's your idea?`;
        const newIdeaTitle = _.trim(ideaTitle) || `Untitled`;

        await createIdea({
          title: newIdeaTitle,
          description: newIdeaDescription,
          userId,
        });
      }
      sharedNavigationService.navigate({ page: 'HomeReset' });
    } catch (error) {
      // Same as dismissing loader
      sharedNavigationService.navigate({
        page: 'IdeaTemplate',
        props: {
          idea: existingIdea
            ? {
                type: 'Idea',
                id: existingIdea.id,
                title: _.trim(ideaTitle) || `Untitled`,
                description: _.trim(ideaDescription) || `What's your idea?`,
                timestamp: existingIdea.timestamp,
              }
            : null,
        },
      });
      Alert.alert('Uh oh!', `Couldn't save idea. ${error.message}`);
    }
  };

  const triggerDeleteIdea = () => {
    Alert.alert(
      'Are you sure you want to delete this idea?',
      'This action cannot be undone.',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            sharedNavigationService.navigate({ page: 'Loader' });
            try {
              await deleteIdea({ id: existingIdea.id, userId });
              sharedNavigationService.navigate({ page: 'HomeReset' });
            } catch (error) {
              // Same as dismissing loader
              sharedNavigationService.navigate({
                page: 'IdeaTemplate',
                props: {
                  idea: existingIdea || null,
                },
              });
              Alert.alert(
                'Uh oh!',
                `Couldn't delete idea. ${error.message}`,
              );
            }
          },
        },
      ],
    );
  }

  const subMenuOptions: ActionSheetOwnProps = {
    options: [{onPress: triggerDeleteIdea, buttonType: 'third', title: 'Delete Idea'}],
  }

  props.navigation.setOptions({
    headerTitle: () => (
      <Image
        style={styles.titleIcon}
        source={require('../../assets/ideas-icon.png')}
      />
    ),
    headerLeft: () => (
      <NavButton
        onPress={() => {
          const finalTitleAndDescription = {
            title: ideaTitle,
            description: ideaDescription,
          };
          const initialTitleAndDescription = {
            title: existingIdea ? existingIdea.title : '',
            description: existingIdea ? existingIdea.description : '',
          };
          if (_.isEqual(finalTitleAndDescription, initialTitleAndDescription)) {
            sharedNavigationService.navigate({
              page: 'HomeReset',
            });
          } else {
            Alert.alert(
              'It looks like you have some unsaved changes',
              'Do you wish to continue?',
              [
                {
                  text: 'No',
                },
                {
                  text: 'Yes',
                  onPress: () =>
                    sharedNavigationService.navigate({ page: 'HomeReset' }),
                },
              ],
            );
          }
        }}
        title={'Cancel'}
        position={'left'}
      />
    ),
    headerRight: existingIdea
      ? () => (
          <NavButton
            onPress={() => sharedNavigationService.navigate({
              page: 'ActionSheet',
              props: subMenuOptions,
            })}
            icon={'subMenu'}
            position={'right'}
          />
        )
      : null,
    headerStyle: { shadowColor: colors.lightGray },
  });

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 130 }}
        keyboardShouldPersistTaps={'handled'}
        automaticallyAdjustContentInsets={false}
      >
        <TextInput
          selectionColor={colors.salmonRed}
          placeholderTextColor={colors.lightPurple}
          style={styles.titleInput}
          placeholder={'Untitled'}
          value={ideaTitle}
          onChangeText={text => setIdeaTitle(text)}
          onSubmitEditing={() => {
            descriptionInputRef.current.focus();
          }}
        />
        <TextInput
          ref={descriptionInputRef}
          selectionColor={colors.salmonRed}
          placeholderTextColor={colors.lightPurple}
          style={styles.ideaInput}
          scrollEnabled={false}
          multiline={true}
          placeholder={'Start writing something here...'}
          value={ideaDescription}
          onChangeText={text => setIdeaDescription(text)}
        />
      </KeyboardAwareScrollView>
      <DoneButton onPress={updateOrCreateIdea} />
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
  titleInput: {
    fontFamily: 'PulpDisplay-Bold',
    fontSize: 30,
    color: colors.offBlack,
    marginVertical: 8,
  },
  ideaInput: {
    flex: 1,
    fontFamily: 'PulpDisplay-Regular',
    fontSize: 20,
    color: colors.offBlack,
  },
});
