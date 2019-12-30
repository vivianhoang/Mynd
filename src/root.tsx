import React from 'react';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import home from './screens/main-flow/home';
import createNote from './screens/main-flow/create-note';
import splash from './screens/auth-flow/splash';
import landing from './screens/auth-flow/landing';
import login from './screens/auth-flow/login';
import category from './screens/main-flow/category-flow/category';
import categorySettings from './screens/main-flow/category-flow/category-settings';
import signup from './screens/auth-flow/signup';
import sharedNavigationService from './services/navigation-service';
import { Provider } from 'react-redux';
import store from './services/redux-service';

const RootStack = createStackNavigator();
const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();
const CategoryStack = createStackNavigator();

function MainFlow() {
  return (
    <MainStack.Navigator initialRouteName="Home">
      <MainStack.Screen name="Home" component={home}></MainStack.Screen>
      <MainStack.Screen
        name="CreateNote"
        component={createNote}
      ></MainStack.Screen>
      <MainStack.Screen
        name="CategoryFlow"
        component={CategoryFlow}
        options={{
          headerShown: false,
        }}
      ></MainStack.Screen>
    </MainStack.Navigator>
  );
}

function AuthFlow() {
  return (
    <AuthStack.Navigator initialRouteName="Splash">
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

function CategoryFlow(props) {
  return (
    <CategoryStack.Navigator initialRouteName="Category">
      <CategoryStack.Screen
        name="Category"
        component={category}
        initialParams={props.route.params}
      ></CategoryStack.Screen>
      <CategoryStack.Screen
        name="CategorySetting"
        component={categorySettings}
      ></CategoryStack.Screen>
    </CategoryStack.Navigator>
  );
}

export default () => {
  return (
    <Provider store={store}>
      <NavigationNativeContainer ref={sharedNavigationService.navRef}>
        <RootStack.Navigator
          initialRouteName="AuthFlow"
          screenOptions={{ headerShown: false }}
        >
          <RootStack.Screen name="AuthFlow" component={AuthFlow} />
          <RootStack.Screen name="MainFlow" component={MainFlow} />
        </RootStack.Navigator>
      </NavigationNativeContainer>
    </Provider>
  );
};
