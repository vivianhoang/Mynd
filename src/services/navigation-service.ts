import React from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

class NavigationService {
  navRef: React.MutableRefObject<NavigationContainerRef> = React.createRef();

  navigate(screenName: string) {
    this.navRef.current && this.navRef.current.navigate(screenName);
  }

  goBack() {
    this.navRef.current && this.navRef.current.goBack();
  }
}

const sharedNavigationService = new NavigationService();
export default sharedNavigationService;
