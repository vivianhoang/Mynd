import FirebaseAuth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import sharedNavigationService from './navigation-service';

class AuthService {
  async initialize() {
    const user = FirebaseAuth().currentUser;

    if (user) {
      // user is signed in
      sharedNavigationService.navigate('MainFlow');
    } else {
      // user is not signed in
      sharedNavigationService.navigate('Landing');
    }
  }

  signup(email: string, password: string): Promise<FirebaseAuthTypes.UserCredential> {
    return FirebaseAuth().createUserWithEmailAndPassword(email, password);
  }

  login(email: string, password: string): Promise<FirebaseAuthTypes.UserCredential> {
    return FirebaseAuth().signInWithEmailAndPassword(email, password);
  }

  logout() {
    FirebaseAuth().signOut();
    sharedNavigationService.navigate('Landing');
  }
}

const sharedAuthService = new AuthService();
export default sharedAuthService;