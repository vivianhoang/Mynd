import { StackNavigationProp } from '@react-navigation/stack';
import { Dispatch } from 'redux';
import { RouteProp } from '@react-navigation/native';

//---------State-related interfaces-----------//
export interface ReduxState {
  userId: string;
  hiveData: HiveData;
}

// export interface BaseTemplate {
//   type: TemplateType;
// }

export type TemplateData = Checklist | Idea;

export type JsonHiveData = {
  [key in TemplateType]: TemplateData[];
};

export type HiveData = {
  title: TemplateType;
  data: TemplateData[][];
}[];

export type TemplateType = 'Idea' | 'Checklist';

export interface Idea {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'Idea';
}

export interface ChecklistItem {
  title: string;
  checked: boolean;
  timestamp: string;
}
export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
  timestamp: string;
  type: 'Checklist';
}

export type Templates = Idea | Checklist;

export type Ideas = Idea[];
export type Checklists = Checklist[];

//---------Actions-related interfaces-----------//

export interface CreateIdea {
  type: 'CREATE_IDEA';
  title: string;
  description: string;
}

export interface UpdateIdea {
  type: 'UPDATE_IDEA';
  title: string;
  description: string;
  ideaId: string;
  timestamp: string;
}

export interface DeleteIdea {
  type: 'DELETE_IDEA';
  id: string;
}

export interface CreateChecklist {
  type: 'CREATE_CHECKLIST';
  title: string;
  items: ChecklistItem[];
}

export interface UpdateChecklist {
  type: 'UPDATE_CHECKLIST';
  title: string;
  items: ChecklistItem[];
  id: string;
  timestamp: string;
}

export interface DeleteChecklist {
  type: 'DELETE_CHECKLIST';
  id: string;
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

export interface ResetRedux {
  type: 'RESET_REDUX';
}

export type ReduxActions =
  | CreateIdea
  | UpdateIdea
  | DeleteIdea
  | CreateChecklist
  | UpdateChecklist
  | DeleteChecklist
  | SetUser
  | SetHiveData
  | UnsubscribeFromIdea
  | ResetRedux;

export type DispatchAction = Dispatch<ReduxActions>;

//---------------Navigation Actions-----------------//

export type PageName =
  | 'Home'
  | 'HomeReset'
  | 'Splash'
  | 'Landing'
  | 'Login'
  | 'ForgotPassword'
  | 'Signup'
  | 'Loader'
  | 'TemplateSelection'
  | 'IdeaTemplate'
  | 'ChecklistTemplate';

export const Page: {
  [key in PageName]: PageName;
} = {
  Home: 'Home',
  HomeReset: 'HomeReset',
  Splash: 'Splash',
  Landing: 'Landing',
  Login: 'Login',
  ForgotPassword: 'ForgotPassword',
  Loader: 'Loader',
  Signup: 'Signup',
  TemplateSelection: 'TemplateSelection',
  IdeaTemplate: 'IdeaTemplate',
  ChecklistTemplate: 'ChecklistTemplate',
};

export interface BasePageInterface {
  page: PageName;
}

export interface LoaderPage extends BasePageInterface {
  page: 'Loader';
}

export interface LoginPage extends BasePageInterface {
  page: 'Login';
}

export interface ForgotPasswordPage extends BasePageInterface {
  page: 'ForgotPassword';
}

export interface HomePage extends BasePageInterface {
  page: 'Home';
}

export interface HomeReset extends BasePageInterface {
  page: 'HomeReset';
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

export interface ChecklistTemplateOwnProps {
  checklist: Checklist | null;
}
export interface ChecklistTemplatePage extends BasePageInterface {
  page: 'ChecklistTemplate';
  props: ChecklistTemplateOwnProps;
}

export interface SignupPage extends BasePageInterface {
  page: 'Signup';
}

export type NavigationActions =
  | LoaderPage
  | LoginPage
  | ForgotPasswordPage
  | HomePage
  | HomeReset
  | LandingPage
  | TemplateSelectionPage
  | IdeaTemplatePage
  | ChecklistTemplatePage
  | SignupPage;

export type RouteParamsList = {
  IdeaTemplate: IdeaTemplateOwnProps;
  ChecklistTemplate: ChecklistTemplateOwnProps;
};

//---------Component-based interfaces-----------//

export interface LoginProps {
  navigation: StackNavigationProp<any>;
}

export interface ForgotPasswordProps {
  navigation: StackNavigationProp<any>;
}

export interface SignupProps {
  navigation: StackNavigationProp<any>;
}

export interface IdeaTemplateProps {
  navigation: StackNavigationProp<any>;
  route: RouteProp<RouteParamsList, 'IdeaTemplate'>;
}

export interface ChecklistTemplateProps {
  navigation: StackNavigationProp<any>;
  route: RouteProp<RouteParamsList, 'ChecklistTemplate'>;
}
