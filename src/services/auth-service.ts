import FirebaseAuth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import sharedNavigationService from './navigation-service';
import FirebaseFirestore from '@react-native-firebase/firestore';
import { startSaga } from './redux-service';

class AuthService {
  userId: string;

  async initialize() {
    const user = FirebaseAuth().currentUser;

    if (user) {
      this.userId = user.uid;
      // user is signed in
      sharedNavigationService.navigate('MainFlow');
      startSaga();
    } else {
      // user is not signed in
      sharedNavigationService.navigate('Landing');
    }
  }

  async signup(email: string, password: string) {
    const userCredential = await FirebaseAuth().createUserWithEmailAndPassword(
      email,
      password,
    );
    await this.createNewUser(userCredential.user.uid);
  }

  async login(email: string, password: string) {
    const userCredential = await FirebaseAuth().signInWithEmailAndPassword(
      email,
      password,
    );
    this.userId = userCredential.user.uid;
    startSaga();
  }

  logout() {
    FirebaseAuth().signOut();
    this.userId = undefined;
    sharedNavigationService.navigate('Landing');
  }

  async createNewUser(userId: string) {
    await FirebaseFirestore()
      .collection('users')
      .doc(userId)
      .set({});
    this.userId = userId;
    startSaga();
  }
}

const sharedAuthService = new AuthService();
export default sharedAuthService;
