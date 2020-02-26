import FirebaseAuth from '@react-native-firebase/auth';
import sharedNavigationService from './navigation-service';
import FirebaseFirestore from '@react-native-firebase/firestore';
import { startSaga, startSagaAfterLogin } from './redux-service';
import store from './redux-service';
import { unsubscribeFromAll } from './firebase-service';

class AuthService {
  setUser(userId: string) {
    store.dispatch({ type: 'SET_USER', userId });
  }

  async initialize() {
    startSaga();
    const user = FirebaseAuth().currentUser;

    if (user) {
      this.setUser(user.uid);
      // user is signed in
      sharedNavigationService.navigate({ page: 'Home' });
      startSagaAfterLogin();
    } else {
      // user is not signed in
      sharedNavigationService.navigate({ page: 'Landing' });
    }
  }

  async signup(email: string, password: string) {
    const userCredential = await FirebaseAuth().createUserWithEmailAndPassword(
      email,
      password,
    );
    await this.createNewUser(userCredential.user.uid);
    startSagaAfterLogin();
  }

  async login(email: string, password: string) {
    const userCredential = await FirebaseAuth().signInWithEmailAndPassword(
      email,
      password,
    );
    this.setUser(userCredential.user.uid);
    startSagaAfterLogin();
  }

  async forgotPassword(email: string) {
    await FirebaseAuth().sendPasswordResetEmail(email);
  }

  logout() {
    FirebaseAuth().signOut();
    unsubscribeFromAll();
    this.setUser(undefined);
    sharedNavigationService.navigate({ page: 'Landing' });
  }

  async createNewUser(userId: string) {
    await FirebaseFirestore()
      .collection('users')
      .doc(userId)
      .set({});
    this.setUser(userId);
  }
}

const sharedAuthService = new AuthService();
export default sharedAuthService;
