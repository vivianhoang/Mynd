import { StackNavigationProp } from '@react-navigation/stack';
import { Dispatch } from 'redux';
import { RouteProp } from '@react-navigation/native';

//---------State-related interfaces-----------//
export interface ReduxState {
  categoriesById: CategoriesById;
  notesByCategoryId: NotesByCategoryId;
  userId: string;
}

export interface NotesByCategoryId {
  [categoryId: string]: Note[];
}

export interface Category {
  id: string;
  title: string;
}

export interface CategoriesById {
  [id: string]: Category;
}

export interface Note {
  id: string;
  description: string;
}

export type Notes = Note[];

//---------Actions-related interfaces-----------//
export interface SetCategoriesById {
  type: 'SET_CATEGORIES_BY_ID';
  categoriesById: CategoriesById;
}

export interface CreateNote {
  type: 'CREATE_NOTE';
  categoryName: string;
  categoryId: string;
  noteDescription: string;
}

export interface UpdateNote {
  type: 'UPDATE_NOTE';
  note: Note;
  categoryId: string;
}

export interface DeleteNote {
  type: 'DELETE_NOTE';
  noteId: string;
  categoryId: string;
}

export interface SetUser {
  type: 'SET_USER';
  userId: string;
}

export interface SubscribeToCategory {
  type: 'SUBSCRIBE_TO_CATEGORY';
  categoryId: string;
}

export interface UnsubscribeFromCategory {
  type: 'UNSUBSCRIBE_FROM_CATEGORY';
  categoryId: string;
}

export interface SetNotesByCategoryId {
  type: 'SET_NOTES_BY_CATEGORY_ID';
  notes: Notes;
  categoryId: string;
}

export type ReduxActions =
  | SetCategoriesById
  | CreateNote
  | UpdateNote
  | DeleteNote
  | SetUser
  | SubscribeToCategory
  | UnsubscribeFromCategory
  | SetNotesByCategoryId;

export type DispatchAction = Dispatch<ReduxActions>;

//---------------Navigation Actions-----------------//
export interface CategoryPage {
  page: 'CategoryFlow';
  props: RouteParams['Category'];
}

export interface LoginPage {
  page: 'Login';
}

export interface HomePage {
  page: 'MainFlow';
}

export interface LandingPage {
  page: 'Landing';
}

export interface CreateNotePage {
  page: 'CreateNote';
  props?: RouteParams['CreateNote'];
}

export interface SignupPage {
  page: 'Signup';
}

export type NavigationActions =
  | CategoryPage
  | LoginPage
  | HomePage
  | LandingPage
  | CreateNotePage
  | SignupPage;

type RouteParams = {
  Category: { categoryId: string };
  CreateNote: { category?: Category; note?: Note };
};

//---------Component-based interfaces-----------//

export interface HomeProps {
  navigation: StackNavigationProp<any>;
}

export interface CategoryProps {
  navigation: StackNavigationProp<any>;
  route: RouteProp<RouteParams, 'Category'>;
}

export interface CreateNoteProps {
  navigation: StackNavigationProp<any>;
  route: RouteProp<RouteParams, 'CreateNote'>;
}
