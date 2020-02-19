import { StackNavigationProp } from '@react-navigation/stack';
import { Dispatch } from 'redux';
import { RouteProp } from '@react-navigation/native';
import { ToastAndroidStatic, SectionListData } from 'react-native';

//---------State-related interfaces-----------//
export interface ReduxState {
  userId: string;
  hiveData: HiveData;
}

// export interface BaseTemplate {
//   type: TemplateType;
// }

export type TemplateData = Todo | Idea;

export type JsonHiveData = {
  [key in TemplateType]: TemplateData[];
};

export type HiveData = {
  title: TemplateType;
  data: TemplateData[][];
}[];

export type TemplateType = 'Idea' | 'Todo';

export interface Idea {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'Idea';
}

export interface Todo {
  id: string;
  title: string;
  checklist: string[];
  timestamp: string;
  type: 'Todo';
}

export type Templates = Idea | Todo;

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
export type Ideas = Idea[];
export type Todos = Todo[];

//---------Actions-related interfaces-----------//
export interface SetCategoriesById {
  type: 'SET_CATEGORIES_BY_ID';
  categoriesById: CategoriesById;
}

export interface CreateIdea {
  type: 'CREATE_IDEA';
  title: string;
  description: string;
}

export interface UpdateIdea {
  type: 'UPDATE_IDEA';
  title: string;
  description: string;
  id: string;
}

export interface DeleteIdea {
  type: 'DELETE_IDEA';
  id: string;
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

export interface UnsubscribeFromIdea {
  type: 'UNSUBSCRIBE_FROM_IDEA';
  id: string;
}

export interface SetHiveData {
  type: 'SET_HIVE_DATA';
  hiveData: HiveData;
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
  | CreateIdea
  | UpdateIdea
  | DeleteIdea
  | UpdateNote
  | CreateNote
  | UpdateNote
  | DeleteNote
  | SetUser
  | SetHiveData
  | UnsubscribeFromIdea
  | SubscribeToCategory
  | UnsubscribeFromCategory
  | SetNotesByCategoryId;

export type DispatchAction = Dispatch<ReduxActions>;

//---------------Navigation Actions-----------------//

export type PageName =
  | 'Home'
  | 'Splash'
  | 'Landing'
  | 'Login'
  | 'Signup'
  | 'TemplateSelection'
  | 'IdeaTemplate';

export const Page: {
  [key in PageName]: PageName;
} = {
  Home: 'Home',
  Splash: 'Splash',
  Landing: 'Landing',
  Login: 'Login',
  Signup: 'Signup',
  TemplateSelection: 'TemplateSelection',
  IdeaTemplate: 'IdeaTemplate',
};

export interface BasePageInterface {
  page: PageName;
}

export interface LoginPage extends BasePageInterface {
  page: 'Login';
}

export interface HomePage extends BasePageInterface {
  page: 'Home';
}

export interface LandingPage extends BasePageInterface {
  page: 'Landing';
}

export interface TemplateSelectionPage extends BasePageInterface {
  page: 'TemplateSelection';
}

export interface IdeaTemplateOwnProps {
  idea: Idea | null;
}
export interface IdeaTemplatePage extends BasePageInterface {
  page: 'IdeaTemplate';
  props: IdeaTemplateOwnProps;
}

export interface SignupPage extends BasePageInterface {
  page: 'Signup';
}

export type NavigationActions =
  | LoginPage
  | HomePage
  | LandingPage
  | TemplateSelectionPage
  | IdeaTemplatePage
  | SignupPage;

export type RouteParamsList = {
  IdeaTemplate: IdeaTemplateOwnProps;
};

//---------Component-based interfaces-----------//

export interface HomeProps {
  navigation: StackNavigationProp<any>;
}

export interface LoginProps {
  navigation: StackNavigationProp<any>;
}

export interface SignupProps {
  navigation: StackNavigationProp<any>;
}

export interface IdeaTemplateProps {
  navigation: StackNavigationProp<any>;
  route: RouteProp<RouteParamsList, 'IdeaTemplate'>;
}
