import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import home from './screens/main-flow/home';
import templateSelection from './screens/main-flow/template-selection';
import Splash from './screens/auth-flow/splash';
import Landing from './screens/auth-flow/landing';
import login from './screens/auth-flow/login';
import signup from './screens/auth-flow/signup';
import IdeaTemplate from './screens/main-flow/idea-template';
import ChecklistTemplate from './screens/main-flow/checklist-template';
import sharedNavigationService from './services/navigation-service';
import { Provider } from 'react-redux';
import store from './services/redux-service';
import { Page } from './models';
import colors from './utils/colors';

const ModalStack = createStackNavigator();
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

function ModalFlow() {
  return (
    <ModalStack.Navigator
      initialRouteName={'RootFlow'}
      mode={'modal'}
      screenOptions={{
        headerStyle: { shadowColor: colors.lightGray },
        gestureEnabled: false,
      }}
    >
      <ModalStack.Screen
        name={'RootFlow'}
        component={RootFlow}
        options={{ headerShown: false }}
      />
      <ModalStack.Screen
        name={Page.TemplateSelection}
        component={TemplateSelectionFlow}
        options={{ headerShown: false }}
      />
    </ModalStack.Navigator>
  );
}

export default () => {
  return (
    <Provider store={store}>
      <NavigationContainer ref={sharedNavigationService.navRef}>
        <ModalFlow />
      </NavigationContainer>
    </Provider>
  );
};
