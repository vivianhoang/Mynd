import React from 'react';
import { NavigationContainerRef, StackActions } from '@react-navigation/native';
import { NavigationActions } from '../models';

class NavigationService {
  navRef: React.MutableRefObject<NavigationContainerRef> = React.createRef();

  navigate(navAction: NavigationActions) {
    const props = (navAction as any).props;
    this.navRef.current && this.navRef.current.navigate(navAction.page, props);
  }

  push(navAction: NavigationActions) {
    const props = (navAction as any).props;
    this.navRef.current &&
      this.navRef.current.dispatch(StackActions.push(navAction.page, props));
  }

  goBack() {
    this.navRef.current && this.navRef.current.goBack();
  }
}

const sharedNavigationService = new NavigationService();
export default sharedNavigationService;
