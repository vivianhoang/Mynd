import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { DispatchAction } from '../../../models';
import { CategorySettingsProps } from '../../../models';

export default (props: CategorySettingsProps) => {
  const category = props.route.params.category;
  const dispatch = useDispatch<DispatchAction>();

  const headerLabel = (
    <View style={styles.headerLabelContainer}>
      <Text style={styles.headerLabel}>{`${category.title}`}</Text>
      <Text style={styles.headerSubTitleLabel}>{'Settings'}</Text>
    </View>
  );

  props.navigation.setOptions({
    headerTitle: () => headerLabel,
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
        <Text style={styles.deleteLabel}>{'Delete'}</Text>
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
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubTitleLabel: {
    fontSize: 14,
    color: 'grey',
    textAlign: 'center',
  },
});
