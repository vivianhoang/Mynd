/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/root';
import { name as appName } from './app.json';
console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);
