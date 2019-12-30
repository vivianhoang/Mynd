import React, { useEffect } from 'react';
import { FlatList, TouchableOpacity, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  DispatchAction,
  ReduxState,
  Notes,
  CategoryProps,
} from '../../../models';
import sharedNavigationService from '../../../services/navigation-service';

export default (props: CategoryProps) => {
  const categoryId: string = props.route.params.categoryId;
  const dispatch = useDispatch<DispatchAction>();
  const noteList = useSelector<ReduxState, Notes>(
    state => state.notesByCategoryId[categoryId],
  );
  const categoryName = useSelector<ReduxState, string>(state => {
    return state.categoriesById[categoryId].title;
  });

  props.navigation.setOptions({
    headerTitle: categoryName,
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => {
          sharedNavigationService.goBack();
        }}
      >
        <Text>{'Back'}</Text>
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
            // sharedNavigationService.navigate({
            //   page: 'CategoryFlow',
            //   props: { categoryId: item.id },
            // });
          }}
        >
          <Text>{item.description}</Text>
        </TouchableOpacity>
      )}
    ></FlatList>
  );
};
