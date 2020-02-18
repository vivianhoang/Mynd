import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import home from './screens/main-flow/home';
import templateSelection from './screens/main-flow/template-selection';
import splash from './screens/auth-flow/splash';
import landing from './screens/auth-flow/landing';
import login from './screens/auth-flow/login';
import signup from './screens/auth-flow/signup';
import sharedNavigationService from './services/navigation-service';
import { Provider } from 'react-redux';
import store from './services/redux-service';
import { TemplateSelectionProps } from './models';
import colors from './utils/colors';

const ModalStack = createStackNavigator();
const RootStack = createStackNavigator();
const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();
const TemplateSelectionStack = createStackNavigator();

function MainFlow() {
  return (
    <MainStack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerStyle: { shadowColor: 'transparent' } }}
    >
      <MainStack.Screen name="Home" component={home}></MainStack.Screen>
    </MainStack.Navigator>
  );
}

function AuthFlow() {
  return (
    <AuthStack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerStyle: { shadowColor: colors.lightGray } }}
    >
      <AuthStack.Screen
        name="Splash"
        component={splash}
        options={{ headerShown: false }}
      ></AuthStack.Screen>
      <AuthStack.Screen
        name="Landing"
        component={landing}
        options={{ headerShown: false }}
      ></AuthStack.Screen>
      <AuthStack.Screen name="Login" component={login}></AuthStack.Screen>
      <AuthStack.Screen name="Signup" component={signup}></AuthStack.Screen>
    </AuthStack.Navigator>
  );
}

function TemplateSelectionFlow(props: TemplateSelectionProps) {
  return (
    <TemplateSelectionStack.Navigator
      initialRouteName="TemplateSelection"
      screenOptions={{ headerStyle: { shadowColor: colors.lightGray } }}
    >
      <TemplateSelectionStack.Screen
        name="TemplateSelection"
        component={templateSelection}
        options={{ headerShown: false }}
      ></TemplateSelectionStack.Screen>
      {/* <TemplateSelectionStack.Screen
        name="IdeaTemplate"
        component={ideaTemplate}
        options={{ headerShown: false }}
      ></TemplateSelectionStack.Screen>
      <TemplateSelectionStack.Screen
        name="TodoTemplate"
        component={todoTemplate}
        options={{ headerShown: false }}
      ></TemplateSelectionStack.Screen>
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
      initialRouteName="AuthFlow"
      screenOptions={{ headerShown: false }}
    >
      <RootStack.Screen name="AuthFlow" component={AuthFlow} />
      <RootStack.Screen name="MainFlow" component={MainFlow} />
    </RootStack.Navigator>
  );
}

function ModalFlow() {
  return (
    <ModalStack.Navigator
      initialRouteName={'TemplateSelectionFlow'}
      mode={'modal'}
      screenOptions={{ headerStyle: { shadowColor: colors.lightGray } }}
    >
      <ModalStack.Screen
        name={'RootFlow'}
        component={RootFlow}
        options={{ headerShown: false }}
      />
      <ModalStack.Screen
        name={'TemplateSelectionFlow'}
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
