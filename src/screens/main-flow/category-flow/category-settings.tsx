import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { DispatchAction } from '../../../models';
import { CategorySettingsProps } from '../../../models';
import HiveText from '../../../componets/hive-text';
import NavButton from '../../../componets/nav-button';
import sharedNavigationService from '../../../services/navigation-service';
import colors from '../../../utils/colors';

export default (props: CategorySettingsProps) => {
  const category = props.route.params.category;
  const dispatch = useDispatch<DispatchAction>();

  const headerLabel = (
    <View style={styles.headerLabelContainer}>
      <HiveText
        style={styles.headerLabel}
      >{`${category.title.toUpperCase()}`}</HiveText>
      <HiveText style={styles.headerSubTitleLabel}>{'Settings'}</HiveText>
    </View>
  );

  props.navigation.setOptions({
    headerTitle: () => headerLabel,
    headerLeft: () => (
      <NavButton
        onPress={() => {
          sharedNavigationService.goBack();
        }}
        icon={'arrow-left'}
        position={'left'}
      />
    ),
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          Alert.prompt(
            'Are you sure you want to delete this category?',
            '!!THIS WILL REMOVE ALL NOTES!!\nType category name to confirm.',
            [
              {
                text: 'Cancel',
              },
              {
                text: 'Delete',
                onPress: promptText => {
                  if (promptText === category.title) {
                    dispatch({
                      type: 'DELETE_CATEGORY',
                      categoryId: category.id,
                    });
                  } else {
                    Alert.alert('Category name did not match for deleting.');
                  }
                },
              },
            ],
          );
        }}
      >
        <HiveText style={styles.deleteLabel}>{'Delete'}</HiveText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
  },
  deleteButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteLabel: {
    color: 'red',
    fontWeight: 'bold',
  },
  headerLabelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  headerSubTitleLabel: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
