import React, { useEffect } from 'react';
import { FlatList, TouchableOpacity, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  DispatchAction,
  ReduxState,
  Notes,
  CategoryProps,
  Category,
} from '../../../models';
import sharedNavigationService from '../../../services/navigation-service';

export default (props: CategoryProps) => {
  const categoryId: string = props.route.params.categoryId;
  const dispatch = useDispatch<DispatchAction>();
  const noteList = useSelector<ReduxState, Notes>(
    state => state.notesByCategoryId[categoryId],
  );
  const category = useSelector<ReduxState, Category>(state => {
    return state.categoriesById[categoryId];
  });

  props.navigation.setOptions({
    headerTitle: category.title,
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => {
          sharedNavigationService.goBack();
        }}
      >
        <Text>{'Back'}</Text>
      </TouchableOpacity>
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
