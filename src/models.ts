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

export type TemplateType = 'Idea' | 'Checklist' | 'Goal';

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

export interface Goal {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  tasks?: Goal[];
  completed: boolean;
  type: 'Goal';
}

export type Templates = Idea | Checklist | Goal;

export type Ideas = Idea[];
export type Checklists = Checklist[];
export type Goals = Goal[];

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

export interface CreateGoal {
  type: 'CREATE_GOAL';
  title: string;
  description: string;
  tasks?: Goal[];
}

export interface UpdateGoal {
  type: 'UPDATE_GOAL';
  title: string;
  description: string;
  tasks?: Goal[];
  completed: boolean;
}

export interface DeleteGoal {
  type: 'DELETE_GOAL';
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
  | CreateGoal
  | UpdateGoal
  | DeleteGoal
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
  | 'ChecklistTemplate'
  | 'GoalTemplate';

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
  GoalTemplate: 'GoalTemplate',
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

export interface GoalTemplateOwnProps {
  goal: Goal | null;
}

export interface GoalTemplatePage extends BasePageInterface {
  page: 'GoalTemplate';
  props: GoalTemplateOwnProps;
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
  | GoalTemplatePage
  | SignupPage;

export type RouteParamsList = {
  IdeaTemplate: IdeaTemplateOwnProps;
  ChecklistTemplate: ChecklistTemplateOwnProps;
  GoalTemplate: GoalTemplateOwnProps;
};

//---------Component-based interfaces-----------//

export interface NavigationProps {
  navigation: StackNavigationProp<any>;
}

export interface LoginProps extends NavigationProps {}

export interface ForgotPasswordProps extends NavigationProps {}

export interface SignupProps extends NavigationProps {}

export interface IdeaTemplateProps extends NavigationProps {
  route: RouteProp<RouteParamsList, 'IdeaTemplate'>;
}

export interface ChecklistTemplateProps extends NavigationProps {
  route: RouteProp<RouteParamsList, 'ChecklistTemplate'>;
}

export interface GoalTemplateProps extends NavigationProps {
  route: RouteProp<RouteParamsList, 'GoalTemplate'>;
}
