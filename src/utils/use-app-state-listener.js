import {useEffect, useRef} from 'react';
import {AppState} from 'react-native';

export const useAppStateListener = (onForeground, onBackground) => {
  // appStateRef holds current app states.
  // Possible app states - 'active', 'background', 'inactive', 'unknown', 'extension'
  const appStateRef = useRef(AppState.currentState);
  const onForegroundRef = useRef(onForeground);
  const onBackgroundRef = useRef(onBackground);

  // Setting refs to avoid passing the functions as dependencies to useEffect
  useEffect(() => {
    onForegroundRef.current = onForeground;
    onBackgroundRef.current = onBackground;
  }, [onForeground, onBackground]);

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (nextAppState === 'active') {
        onForegroundRef.current?.();
      } else if (nextAppState.match(/inactive|background/)) {
        onBackgroundRef.current?.();
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      if (subscription?.remove) {
        subscription.remove();
      } else {
        AppState.removeEventListener('change', handleAppStateChange);
      }
    };
  }, []);

  return {
    appState: appStateRef.current,
  };
};
