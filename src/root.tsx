import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import home from './screens/main-flow/home';
import templateSelection from './screens/main-flow/template-selection';
import Splash from './screens/auth-flow/splash';
import Landing from './screens/auth-flow/landing';
import login from './screens/auth-flow/login';
import ForgotPassword from './screens/auth-flow/forgot-pasword';
import signup from './screens/auth-flow/signup';
import Loader from './screens/main-flow/loader';
import IdeaTemplate from './screens/main-flow/idea-template';
import ChecklistTemplate from './screens/main-flow/checklist-template';
import sharedNavigationService from './services/navigation-service';
import { Provider } from 'react-redux';
import store from './services/redux-service';
import { Page } from './models';
import colors from './utils/colors';

const ModalStack0 = createStackNavigator();
const ModalStack1 = createStackNavigator();
const RootStack = createStackNavigator();
const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();
const TemplateSelectionStack = createStackNavigator();

function MainFlow() {
  return (
    <MainStack.Navigator
      initialRouteName={'HomeReset'}
      screenOptions={{ gestureEnabled: false }}
    >
      <MainStack.Screen
        options={{ headerShown: false }}
        name="HomeReset"
        component={home}
      ></MainStack.Screen>
      <MainStack.Screen
        name={Page.IdeaTemplate}
        component={IdeaTemplate}
      ></MainStack.Screen>
      <MainStack.Screen
        name={Page.ChecklistTemplate}
        component={ChecklistTemplate}
      ></MainStack.Screen>
    </MainStack.Navigator>
  );
}

function AuthFlow() {
  return (
    <AuthStack.Navigator
      initialRouteName={Page.Splash}
      screenOptions={{
        headerStyle: { shadowColor: colors.lightGray },
        gestureEnabled: false,
      }}
    >
      <AuthStack.Screen
        name={Page.Splash}
        component={Splash}
        options={{ headerShown: false }}
      ></AuthStack.Screen>
      <AuthStack.Screen
        name={Page.Landing}
        component={Landing}
        options={{ headerShown: false }}
      ></AuthStack.Screen>
      <AuthStack.Screen name={Page.Login} component={login}></AuthStack.Screen>
      <AuthStack.Screen
        name={Page.ForgotPassword}
        component={ForgotPassword}
      ></AuthStack.Screen>
      <AuthStack.Screen
        name={Page.Signup}
        component={signup}
      ></AuthStack.Screen>
    </AuthStack.Navigator>
  );
}

function TemplateSelectionFlow() {
  return (
    <TemplateSelectionStack.Navigator
      initialRouteName="TemplateSelectionNOTUSED"
      screenOptions={{
        headerStyle: { shadowColor: colors.lightGray },
        gestureEnabled: false,
      }}
    >
      <TemplateSelectionStack.Screen
        name="TemplateSelectionNOTUSED"
        component={templateSelection}
        options={{ headerShown: false }}
      ></TemplateSelectionStack.Screen>
      <TemplateSelectionStack.Screen
        name={Page.IdeaTemplate}
        component={IdeaTemplate}
      ></TemplateSelectionStack.Screen>
      <TemplateSelectionStack.Screen
        name={Page.ChecklistTemplate}
        component={ChecklistTemplate}
      ></TemplateSelectionStack.Screen>
      {/*
      <TemplateSelectionStack.Screen
        name="GoalTemplate"
        component={goalTemplate}
        options={{ headerShown: false }}
      ></TemplateSelectionStack.Screen> */}
    </TemplateSelectionStack.Navigator>
  );
}

function RootFlow() {
  return (
    <RootStack.Navigator
      initialRouteName={'AuthFlowNOTUSED'}
      screenOptions={{ headerShown: false, gestureEnabled: false }}
    >
      <RootStack.Screen name={'AuthFlowNOTUSED'} component={AuthFlow} />
      <RootStack.Screen name={Page.Home} component={MainFlow} />
    </RootStack.Navigator>
  );
}

function ModalStack1Flow() {
  return (
    <ModalStack1.Navigator
      initialRouteName={'RootFlow'}
      mode={'modal'}
      screenOptions={{
        headerStyle: { shadowColor: colors.lightGray },
        gestureEnabled: false,
      }}
    >
      <ModalStack1.Screen
        name={'RootFlow'}
        component={RootFlow}
        options={{ headerShown: false }}
      />
      <ModalStack1.Screen
        name={Page.TemplateSelection}
        component={TemplateSelectionFlow}
        options={{ headerShown: false }}
      />
    </ModalStack1.Navigator>
  );
}

function ModalStack0Flow() {
  return (
    <ModalStack0.Navigator
      initialRouteName={'ModalStack1Flow'}
      mode={'modal'}
      screenOptions={{
        headerStyle: { shadowColor: colors.lightGray },
        gestureEnabled: false,
        headerShown: false,
      }}
    >
      <ModalStack0.Screen
        name={'ModalStack1Flow'}
        component={ModalStack1Flow}
      />
      <ModalStack0.Screen
        name={Page.Loader}
        component={Loader}
        options={{
          cardStyle: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
          transitionSpec: {
            open: {
              animation: 'timing',
              config: {
                duration: 0,
              },
            },
            close: {
              animation: 'timing',
              config: {
                duration: 0,
              },
            },
          },
        }}
      />
    </ModalStack0.Navigator>
  );
}

export default () => {
  return (
    <Provider store={store}>
      <NavigationContainer ref={sharedNavigationService.navRef}>
        <ModalStack0Flow />
      </NavigationContainer>
    </Provider>
  );
};
