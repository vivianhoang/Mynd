import { StackNavigationProp } from '@react-navigation/stack';
import { Dispatch } from 'redux';

//---------State-related interfaces-----------//
export interface ReduxState {
  categories: Categories;
  notesByCategoryId: NotesByCategoryId;
}

export interface NotesByCategoryId {
  [categoryId: string]: Note[];
}

export interface Category {
  id: string;
  title: string;
  count: number;
}

export interface Note {
  id: string;
  description: string;
}

export type Categories = Category[];

//---------Actions-related interfaces-----------//
export interface SetCategoriesAction {
  type: 'SET_CATEGORIES';
  categories: Categories;
}

export interface CreateCategoriesAction {
  type: 'CREATE_NOTE';
  categoryName: string;
  categoryId: string;
  noteDescription: string;
}

export type ReduxActions = SetCategoriesAction | CreateCategoriesAction;

export type DispatchAction = Dispatch<ReduxActions>;

//---------Component-based interfaces-----------//
export interface HomeProps {
  navigation: StackNavigationProp<any>;
}
