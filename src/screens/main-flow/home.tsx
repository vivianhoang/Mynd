import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import sharedAuthService from '../../services/auth-service';
import FirebaseFirestore from '@react-native-firebase/firestore';
import sharedNavigationService from '../../services/navigation-service';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';

interface Category {
  id: string;
  title: string;
  count: number;
}

type Categories = Category[];

interface HomeProps {
  navigation: StackNavigationProp<any>;
}

export default (props: HomeProps) => {
  const [categoryList, setCategoryList] = useState<Categories>([]);
  const dispatch = useDispatch();

  props.navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity
        onPress={() => {
          sharedNavigationService.navigate('CreateNote');
        }}
      >
        <Text>{'Add'}</Text>
      </TouchableOpacity>
    ),
  });

  const getCategories: () => () => void = () => {
    const path = `users/${sharedAuthService.userId}/categories`;
    const categoriesSnapshot = FirebaseFirestore()
      .collection(path)
      .onSnapshot(snapshot => {
        if (!snapshot.empty) {
          // adding type to the returned snapshot
          const newCategoryList = snapshot.docs.map(snapshot => {
            const category = snapshot.data() as Category;
            return category;
          });
          setCategoryList(newCategoryList);
        }
      });
    return categoriesSnapshot;
  };

  useEffect(() => {
    const unsubscribe = getCategories();

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={categoryList}
        keyExtractor={category => category.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ height: 50, backgroundColor: 'red' }}
            onPress={() => {
              sharedNavigationService.navigate('CategoryFlow');
            }}
          >
            <Text>{item.title}</Text>
            <Text>{item.count}</Text>
          </TouchableOpacity>
        )}
      ></FlatList>
      <TouchableOpacity
        style={styles.button}
        onPress={() => sharedAuthService.logout()}
      >
        <Text>{'Logout'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => dispatch({ type: 'GET_CATEGORIES', payload: ['abc'] })}
      >
        <Text>{'trigger action'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'yellow',
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
  },
});
