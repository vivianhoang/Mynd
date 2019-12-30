import React, { useEffect } from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  DispatchAction,
  ReduxState,
  Notes,
  CategoryProps,
  Category,
} from '../../../models';
import sharedNavigationService from '../../../services/navigation-service';
import NavButton from '../../../componets/nav-button';

export default (props: CategoryProps) => {
  const categoryId: string = props.route.params.categoryId;
  const dispatch = useDispatch<DispatchAction>();
  const noteList = useSelector<ReduxState, Notes>(
    state => state.notesByCategoryId[categoryId],
  );
  const category = useSelector<ReduxState, Category>(state => {
    return state.categoriesById[categoryId];
  });

  const categorySettingsButton = (
    <TouchableOpacity
      style={styles.categorySettingsButton}
      onPress={() => {
        sharedNavigationService.navigate({
          page: 'CategorySettings',
          props: { category },
        });
      }}
    >
      <Text style={styles.categoryLabel}>{`${category?.title} v`}</Text>
    </TouchableOpacity>
  );

  props.navigation.setOptions({
    headerTitle: () => categorySettingsButton,
    headerLeft: () => (
      <NavButton
        onPress={() => {
          sharedNavigationService.goBack();
        }}
        title={'Back'}
        position={'left'}
      />
    ),
    headerRight: () => (
      <TouchableOpacity
        onPress={() => {
          sharedNavigationService.navigate({
            page: 'CreateNote',
            props: { category },
          });
        }}
      >
        <Text>{'Add'}</Text>
      </TouchableOpacity>
    ),
  });

  useEffect(() => {
    dispatch({ type: 'SUBSCRIBE_TO_CATEGORY', categoryId });

    return () => {
      dispatch({ type: 'UNSUBSCRIBE_FROM_CATEGORY', categoryId });
    };
  }, []);

  return (
    <FlatList
      data={noteList}
      keyExtractor={note => note.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={{ height: 50, backgroundColor: 'red' }}
          onPress={() => {
            sharedNavigationService.navigate({
              page: 'CreateNote',
              props: {
                category,
                note: item,
              },
            });
          }}
        >
          <Text>{item.description}</Text>
        </TouchableOpacity>
      )}
    ></FlatList>
  );
};

const styles = StyleSheet.create({
  categorySettingsButton: {
    justifyContent: 'center',
  },
  categoryLabel: {
    fontWeight: 'bold',
  },
});
