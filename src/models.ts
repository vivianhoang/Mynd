import { StackNavigationProp } from '@react-navigation/stack';
import { Dispatch } from 'redux';
import { RouteProp } from '@react-navigation/native';

//---------State-related interfaces-----------//
export interface ReduxState {
  userId: string;
  hiveData: HiveData;
  tempGoal: Goal;
}

export type TemplateData = Checklist | Idea | Goal | Habit;

export type JsonHiveData = { [key in TemplateType]: TemplateData[] };

export type HiveData = {
  title: TemplateType;
  data: TemplateData[][];
}[];

export type TemplateType = 'Idea' | 'Checklist' | 'Goal' | 'Habit';

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
  tasks?: Goals;
  completed: boolean;
  type: 'Goal';
}

export interface Habit {
  id: string;
  title: string;
  timestamp: string;
  count: number;
  streak: {
    currentStreak: number;
    bestStreak: number;
    latestTimestamp: string;
  };
  type: 'Habit';
}

export type Templates = Idea | Checklist | Goal | Habit;

export type Ideas = Idea[];
export type Checklists = Checklist[];
export type Goals = Goal[];
export type Habits = Habit[];

//---------Actions-related interfaces-----------//

export interface SetUser {
  type: 'SET_USER';
  userId: string;
}

export interface SetHiveData {
  type: 'SET_HIVE_DATA';
  hiveData: HiveData;
}

export interface ResetRedux {
  type: 'RESET_REDUX';
}

export interface UpdateTempGoal {
  type: 'UPDATE_TEMP_GOAL';
  goal: Goal;
}

export type ReduxActions = SetUser | SetHiveData | ResetRedux | UpdateTempGoal;

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
  | 'GoalTemplate'
  | 'GoalTaskCreation'
  | 'GoalTaskDetails'
  | 'HabitTemplate'
  | 'ActionSheet';

export const Page: { [key in PageName]: PageName } = {
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
  GoalTaskDetails: 'GoalTaskDetails',
  GoalTaskCreation: 'GoalTaskCreation',
  HabitTemplate: 'HabitTemplate',
  ActionSheet: 'ActionSheet',
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

export interface GoalTaskCreationOwnProps {
  onCreateTask: (params: { title: string; description: string }) => void;
}
export interface GoalTaskCreationPage {
  page: 'GoalTaskCreation';
  props: GoalTaskCreationOwnProps;
}

export interface GoalTaskDetailsOwnProps {
  // task: Goal | null;
  breadcrumbs: { title: string; taskIndex: number }[];
  // taskIndex: number;
  // onSaveTask: (task: Goal) => void;
}
export interface GoalTaskDetailsPage extends BasePageInterface {
  page: 'GoalTaskDetails';
  props: GoalTaskDetailsOwnProps;
}

export interface HabitTemplateOwnProps {
  habit: Habit | null;
}

export interface HabitTemplatePage extends BasePageInterface {
  page: 'HabitTemplate';
  props: HabitTemplateOwnProps;
}

export interface ActionSheetOwnProps {
  options: {
    onPress: () => void;
    buttonType: 'first' | 'second' | 'third';
    title: string;
  }[];
}

export interface ActionSheetPage extends BasePageInterface {
  page: 'ActionSheet';
  props: ActionSheetOwnProps;
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
  | GoalTaskDetailsPage
  | GoalTaskCreationPage
  | HabitTemplatePage
  | ActionSheetPage
  | SignupPage;

export type RouteParamsList = {
  IdeaTemplate: IdeaTemplateOwnProps;
  ChecklistTemplate: ChecklistTemplateOwnProps;
  GoalTemplate: GoalTemplateOwnProps;
  GoalTaskDetails: GoalTaskDetailsOwnProps;
  GoalTaskCreation: GoalTaskCreationOwnProps;
  HabitTemplate: HabitTemplateOwnProps;
  ActionSheet: ActionSheetOwnProps;
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

export interface GoalTaskDetailsProps extends NavigationProps {
  route: RouteProp<RouteParamsList, 'GoalTaskDetails'>;
}

export interface GoalTaskCreationProps extends NavigationProps {
  route: RouteProp<RouteParamsList, 'GoalTaskCreation'>;
}

export interface HabitTemplateProps extends NavigationProps {
  route: RouteProp<RouteParamsList, 'HabitTemplate'>;
}

export interface ActionSheetProps extends NavigationProps {
  route: RouteProp<RouteParamsList, 'ActionSheet'>;
}
