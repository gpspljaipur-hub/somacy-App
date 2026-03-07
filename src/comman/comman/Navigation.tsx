import {handleNavigation as rootHandleNavigation} from '../navigation/RootNavigator';

export function openLogin(navigation: any, opts?: {type?: 'push' | 'navigate' | 'setRoot'}) {
  const type = opts?.type || 'push';
  if (typeof rootHandleNavigation === 'function') {
    rootHandleNavigation({type, navigation, page: 'Login'});
    return;
  }
  if (navigation && typeof navigation.navigate === 'function') {
    navigation.navigate('Login');
  }
}

export default {openLogin};
