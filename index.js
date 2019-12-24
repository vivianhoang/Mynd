/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/root';
import {name as appName} from './app.json';
import * as auth from './src/services/auth-service';

AppRegistry.registerComponent(appName, () => App);
