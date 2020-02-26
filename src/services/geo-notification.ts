import { Platform, AppState } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import Geolocation from 'react-native-geolocation-service';
import { Alert } from 'react-native';
import { PERMISSIONS, check, RESULTS, request } from 'react-native-permissions';
import BackgroundTimer from 'react-native-background-timer';

interface GeoNotificationAlert {
  name: string;
  enter: { message: string; triggered: boolean };
  exit: { message: string; triggered: boolean };
  coordinates: LatLng;
}

type LatLng = [number, number];

class GeoNotification {
  timer: any;

  alerts: GeoNotificationAlert[] = [
    {
      name: 'Home',
      enter: { message: '', triggered: false },
      exit: {
        message: `Did you remember to measure the pictures?`,
        triggered: false,
      },
      coordinates: [47.634133, -122.136151],
    },
    {
      name: 'Ikea',
      enter: {
        message: 'Remember to buy the picture frames!',
        triggered: false,
      },
      exit: { message: `Next stop is Lam's Supermarket!`, triggered: false },
      coordinates: [47.442835, -122.228563],
    },
    {
      name: `Lam's Supermarket`,
      enter: {
        message: `Remember to buy some short ribs for yakitori.`,
        triggered: false,
      },
      exit: { message: `Time to go home!`, triggered: false },
      coordinates: [47.598185, -122.3162],
    },
  ];

  pollForAlerts(currentLocation: LatLng) {
    for (const index in this.alerts) {
      const alert = this.alerts[index];
      const distance = this.getDistanceBetween({
        // pointA: currentLocation,
        pointA: currentLocation,
        pointB: alert.coordinates,
        unit: 'mi',
      });
      const threshold = 0.5; // miles

      // TODO: Add location updates to background modes , disabled for now
      if (!alert.enter.triggered) {
        // Trigger enter
        if (distance < threshold) {
          if (alert.enter.message) {
            this.generateGeoNotification({
              title: alert.name,
              message: alert.enter.message,
            });
          }
          alert.enter.triggered = true;
        }
      } else if (!alert.exit.triggered) {
        // Trigger exit
        if (distance > threshold) {
          if (alert.exit.message) {
            this.generateGeoNotification({
              title: alert.name,
              message: alert.exit.message,
            });
          }
          alert.exit.triggered = true;
        }
      }
    }
  }

  initialize() {
    this.requestPermissions();

    // Enable tracking in the background
    AppState.addEventListener('change', state => {
      if (state === 'active') {
        BackgroundTimer.clearInterval(this.timer);
        BackgroundTimer.stop();
      } else if (state === 'background') {
        BackgroundTimer.start();
        this.timer = BackgroundTimer.setInterval(async () => {
          // this will be executed every 200 ms
          // even when app is the the background
          const currentLocation = await new Promise<LatLng>(res => {
            Geolocation.getCurrentPosition(
              pos => {
                const coords: LatLng = [
                  pos.coords.latitude,
                  pos.coords.longitude,
                ];
                res(coords);
              },
              err => {
                res(null);
              },
            );
          });

          if (currentLocation) {
            this.pollForAlerts(currentLocation);
          }
        }, 15000);
      }
    });
  }

  async requestPermissions() {
    try {
      await PushNotificationIOS.requestPermissions({
        alert: true,
        badge: true,
        sound: true,
      });

      await this.checkLocationPermission();

      Geolocation.watchPosition(
        position => {
          const currentPosition: LatLng = [
            position.coords.latitude,
            position.coords.longitude,
          ];

          this.pollForAlerts(currentPosition);
          // this.generateGeoNotification({title: 'HEY', message: `${currentPosition[0]}`})
        },
        error => {
          Alert.alert('couldnt get current position!', `${error.message}`);
        },
        {
          distanceFilter: 10,
        },
      );
    } catch (error) {
      Alert.alert('Uh oh!', `Couldn't request permissions ${error.message}`);
    }
  }

  async checkLocationPermission() {
    try {
      const isPermissionsEnabled = await check(
        Platform.select({
          android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
          // Checking for always crashes
          // iOS 13 is different now, always prompts automatically when grabbing background data
        }),
      );
      let permissionStatus = '';
      switch (isPermissionsEnabled) {
        case RESULTS.BLOCKED:
          permissionStatus = 'blocked';
          break;
        case RESULTS.DENIED:
          permissionStatus = 'denied';
          break;
        case RESULTS.GRANTED:
          {
            permissionStatus = 'granted';
          }
          break;
        case RESULTS.UNAVAILABLE:
          permissionStatus = 'unavailable';
          break;
      }
      if (permissionStatus !== RESULTS.GRANTED) {
        const requestPermission = await request(
          Platform.select({
            android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
          }),
        );
        if (requestPermission !== RESULTS.GRANTED) {
        } else {
        }
        // this.updateCurrentLocationStatus(requestPermission);
      } else {
        // this.updateCurrentLocationStatus(permissionStatus);
      }
    } catch (error) {
      console.log('Failed to check for location', error);
    }
  }

  generateGeoNotification(params: { title: string; message: string }) {
    const { title, message } = params;
    PushNotificationIOS.presentLocalNotification({
      alertBody: title,
      alertTitle: message,
    });
  }

  getDistanceBetween(params: {
    pointA: LatLng;
    pointB: LatLng;
    unit: 'km' | 'ft' | 'mi';
  }) {
    const { pointA, pointB, unit } = params;
    const [lat1, lon1] = pointA;
    const [lat2, lon2] = pointB;
    var p = 0.017453292519943295; // Math.PI / 180
    var c = Math.cos;
    var a =
      0.5 -
      c((lat2 - lat1) * p) / 2 +
      (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;
    // Default km
    let distance = 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km

    if (unit === 'ft') {
      distance = distance * 3280.84;
    }
    if (unit === 'mi') {
      distance = distance * 0.621371;
    }

    return distance;
  }
}

const sharedGeoNotificationService = new GeoNotification();
export default sharedGeoNotificationService;
