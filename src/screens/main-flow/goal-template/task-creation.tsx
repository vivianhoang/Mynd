import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import colors from '../../../utils/colors';
import { GoalTaskCreationProps } from '../../../models';
import sharedNavigationService from '../../../services/navigation-service';
import HiveText from '../../../componets/hive-text';
import BigButton from '../../../componets/big-button';
import _ from 'lodash';

export default (props: GoalTaskCreationProps) => {
  const { onCreateTask } = props.route.params;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerButton} />
          <HiveText variant={'bold'} style={styles.headerLabel}>
            {'New Task'}
          </HiveText>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => sharedNavigationService.goBack()}
          >
            <Image
              style={styles.headerButtonIcon}
              resizeMode={'contain'}
              source={require('../../../assets/close-icon.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          <TextInput
            selectionColor={colors.salmonRed}
            placeholderTextColor={colors.lightPurple}
            style={styles.titleInput}
            placeholder={'Title'}
            value={title}
            onChangeText={setTitle}
            onSubmitEditing={() => {
              // descriptionInputRef.current.focus();
            }}
          />
          <TextInput
            selectionColor={colors.salmonRed}
            placeholderTextColor={colors.lightPurple}
            style={styles.descriptionInput}
            placeholder={'Describe task (Optional)'}
            value={description}
            onChangeText={setDescription}
            multiline={true}
            onSubmitEditing={() => {
              // descriptionInputRef.current.focus();
            }}
          />
          <BigButton
            title={'Done'}
            onPress={() => {
              if (_.trim(title)) {
                onCreateTask({ title, description });
                sharedNavigationService.goBack();
              }
            }}
            style={styles.doneButton}
          ></BigButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    height: 360,
    width: 310,
    backgroundColor: colors.white,
    borderRadius: 16,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.lightGray,
    alignItems: 'center',
  },
  headerButton: {
    width: 70,
    paddingRight: 16,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerButtonIcon: {
    flex: 1,
    tintColor: colors.offBlack,
    height: 26,
    width: 26,
  },
  headerLabel: {
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
  },
  contentContainer: {
    padding: 16,
    paddingTop: 8,
    flex: 1,
  },
  titleInput: {
    fontFamily: 'PulpDisplay-Bold',
    fontSize: 26,
    color: colors.offBlack,
    marginVertical: 8,
  },
  descriptionInput: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'PulpDisplay-Regular',
    color: colors.offBlack,
  },
  doneButton: {
    borderRadius: 8,
    marginTop: 24,
  },
});
