import { StackNavigationProp } from '@react-navigation/stack';
import { Dispatch } from 'redux';
import { RouteProp } from '@react-navigation/native';

//---------State-related interfaces-----------//
export interface ReduxState {
  userId: string;
}

// export type TemplateType = 'idea' | 'goal' | 'todo';

// export interface BaseTemplate {
//   type: TemplateType;
// }

export enum TemplateType {
  Idea,
  Todo,
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: TemplateType.Idea;
}

export interface Todo {
  id: string;
  title: string;
  checklist: string[];
  timestamp: string;
  type: TemplateType.Todo;
}

export type Templates = Idea | Todo;

// const templates = [] as Templates[];

// for (const val in templates) {
//   const template = templates[val];
//   switch (template.type) {
//     case TemplateType.Goal:
//     case TemplateType.Idea;
//   }
// }

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
  timestamp: string;
}

export type Notes = Note[];

//---------Actions-related interfaces-----------//
export interface SetCategoriesById {
  type: 'SET_CATEGORIES_BY_ID';
  categoriesById: CategoriesById;
}

export interface CreateNote {
  type: 'CREATE_NOTE';
  categoryTitle: string;
  categoryId: string;
  noteTimestamp: string;
  noteDescription?: string;
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

export interface LoginPage {
  page: 'Login';
}

export interface MainPage {
  page: 'MainFlow';
}

export interface HomePage {
  page: 'Home';
}

export interface LandingPage {
  page: 'Landing';
}

export interface TemplateSelectionPage {
  page: 'TemplateSelectionFlow';
}

export interface CreateIdeaPage {
  page: 'CreateIdea';
}

export interface SignupPage {
  page: 'Signup';
}

export type NavigationActions =
  | LoginPage
  | MainPage
  | HomePage
  | LandingPage
  | TemplateSelectionPage
  | SignupPage
  | CreateIdeaPage;

//---------Component-based interfaces-----------//

export interface HomeProps {
  navigation: StackNavigationProp<any>;
}

export interface TemplateSelectionProps {
  navigation: StackNavigationProp<any>;
}

export interface LoginProps {
  navigation: StackNavigationProp<any>;
}

export interface SignupProps {
  navigation: StackNavigationProp<any>;
}
