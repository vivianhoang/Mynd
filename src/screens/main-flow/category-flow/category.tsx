import React, { useEffect } from 'react';
import { FlatList, TouchableOpacity, StyleSheet, View } from 'react-native';
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
import HiveText from '../../../componets/hive-text';
import Icon from 'react-native-vector-icons/Feather';
import colors from '../../../utils/colors';

export default (props: CategoryProps) => {
  const categoryId: string = props.route.params.categoryId;
  const dispatch = useDispatch<DispatchAction>();
  const category = useSelector<ReduxState, Category>(state => {
    return state.categoriesById[categoryId];
  });
  const noteList = useSelector<ReduxState, Notes>(
    state => state.notesByCategoryId[categoryId],
  );
  const sortedNoteList = noteList
    ? noteList.sort(function(noteA, noteB) {
        const timestampA = parseInt(noteA.timestamp);
        const timestampB = parseInt(noteB.timestamp);

        return timestampB - timestampA;
      })
    : [];

  console.log(sortedNoteList);

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
      <HiveText style={styles.categoryLabel}>{category?.title}</HiveText>
      <Icon
        name={'chevron-down'}
        style={{ top: 2 }}
        color={colors.darkGray}
        size={20}
      />
    </TouchableOpacity>
  );

  props.navigation.setOptions({
    headerTitle: () => categorySettingsButton,
    headerLeft: () => (
      <NavButton
        onPress={() => {
          sharedNavigationService.goBack();
        }}
        icon={'arrow-left'}
        position={'left'}
      />
    ),
    headerRight: () => (
      <NavButton
        onPress={() => {
          sharedNavigationService.navigate({
            page: 'CreateNote',
            props: { category },
          });
        }}
        icon={'edit-3'}
        position={'right'}
      />
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
      data={sortedNoteList}
      keyExtractor={note => note.id}
      contentContainerStyle={{ padding: 16 }}
      style={styles.container}
      ItemSeparatorComponent={() => {
        return <View style={{ height: 8 }}></View>;
      }}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.noteContainer}
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
          <View style={styles.noteBackground} />
          <HiveText>{item.description}</HiveText>
        </TouchableOpacity>
      )}
    ></FlatList>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  categorySettingsButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  categoryLabel: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  noteContainer: {
    minHeight: 80,
    padding: 16,
  },
  noteBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.honeyOrange,
    borderRadius: 8,
    opacity: 0.75,
  },
});
