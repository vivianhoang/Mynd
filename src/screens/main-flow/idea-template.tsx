import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { IdeaTemplateProps, DispatchAction } from '../../models';
import NavButton from '../../componets/nav-button';
import sharedNavigationService from '../../services/navigation-service';
import colors from '../../utils/colors';
import { useDispatch } from 'react-redux';
import * as _ from 'lodash';

export default (props: IdeaTemplateProps) => {
  const existingIdea = props.route.params?.idea;
  const dispatch = useDispatch<DispatchAction>();

  const [ideaTitle, setIdeaTitle] = useState(existingIdea?.title || '');
  const [ideaDescription, setIdeaDescription] = useState(
    existingIdea?.description || '',
  );

  const rightNavOnPress = () => {
    if (existingIdea) {
      dispatch({
        type: 'UPDATE_IDEA',
        id: existingIdea.id,
        title: ideaTitle,
        description: ideaDescription,
      });
    } else {
      const newIdeaDescription = _.trim(ideaDescription) || `What's your idea?`;

      const newIdeaTitle = _.trim(ideaTitle) || `What's your idea?`;

      dispatch({
        type: 'CREATE_IDEA',
        title: newIdeaTitle,
        description: newIdeaDescription,
      });
    }
  };

  props.navigation.setOptions({
    headerTitle: () => (
      <Image
        style={styles.titleIcon}
        source={require('../../assets/ideas-icon.png')}
      />
    ),
    headerLeft: () => (
      <NavButton
        onPress={() => sharedNavigationService.goBack()}
        title={'Cancel'}
        position={'left'}
      />
    ),
    headerRight: () => (
      <NavButton
        onPress={rightNavOnPress}
        title={'Done'}
        position={'right'}
        color={colors.honeyOrange}
      />
    ),
    headerStyle: { shadowColor: colors.lightGray },
  });

  return (
    <View style={styles.container}>
      <TextInput
        selectionColor={colors.salmonRed}
        placeholderTextColor={colors.lightPurple}
        style={styles.titleInput}
        placeholder={'Untitled'}
        value={ideaTitle}
        onChangeText={text => setIdeaTitle(text)}
      />
      <TextInput
        selectionColor={colors.salmonRed}
        placeholderTextColor={colors.lightPurple}
        style={styles.ideaInput}
        multiline={true}
        placeholder={'Start writing something here...'}
        value={ideaDescription}
        onChangeText={text => setIdeaDescription(text)}
      />
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
