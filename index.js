import { registerRootComponent } from 'expo';
// import { AppRegistry } from 'react-native';
// import { name as appName } from './app.json';
// import TrackPlayer from 'react-native-track-player';
import App from './App';
// import playbackService from './service'; // Ensure this path is correct

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
// AppRegistry.registerComponent(appName, () => App);
// TrackPlayer.registerPlaybackService(() => playbackService);
registerRootComponent(App);

