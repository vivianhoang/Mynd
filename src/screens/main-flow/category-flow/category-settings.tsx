import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { DispatchAction } from '../../../models';
import HiveText from '../../../componets/hive-text';
import NavButton from '../../../componets/nav-button';
import sharedNavigationService from '../../../services/navigation-service';
import HiveTextInput from '../../../componets/hive-text-input';
import colors from '../../../utils/colors';

export default props => {
  const category = props.route.params.category;
  const dispatch = useDispatch<DispatchAction>();
  const [categoryTitle, setCategoryTitle] = useState(category?.title);

  const headerLabel = (
    <View style={styles.headerLabelContainer}>
      <HiveText
        style={styles.headerLabel}
      >{`${category.title.toUpperCase()}`}</HiveText>
      <HiveText style={styles.headerSubTitleLabel}>{'Settings'}</HiveText>
    </View>
  );

  // props.navigation.setOptions({
  //   headerTitle: () => headerLabel,
  //   headerLeft: () => (
  //     <NavButton
  //       onPress={() => {
  //         if (category?.title !== categoryTitle) {
  //           dispatch({
  //             type: 'UPDATE_CATEGORY',
  //             category: {
  //               id: category?.id,
  //               title: categoryTitle,
  //             },
  //           });
  //         }

  //         sharedNavigationService.goBack();
  //       }}
  //       icon={'arrow-left'}
  //       position={'left'}
  //     />
  //   ),
  // });

  return (
    <View style={styles.container}>
      {/* <HiveText style={styles.categoryNameLabel}>{'Category Name'}</HiveText>
      <HiveTextInput
        style={styles.input}
        value={categoryTitle}
        onChangeText={title => {
          setCategoryTitle(title);
        }}
      />
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
                text: 'Delete Forever',
                onPress: promptText => {
                  if (
                    promptText.toUpperCase() === category.title.toUpperCase()
                  ) {
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
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  categoryNameLabel: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    padding: 8,
  },
  deleteButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 8,
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
  input: {
    marginBottom: 8,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.lightGray,
  },
});
