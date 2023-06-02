import React, {useCallback, useEffect, useState} from 'react';
import useEvent from 'react-use-event-hook';
import {
  NativeModules,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import SendbirdChat from '@sendbird/chat';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import type {PushNotification} from '@react-native-community/push-notification-ios';
import {useAppState} from '@react-native-community/hooks';

import IcNotifications from './src/assets/ic-notifications.svg';

const Colors = {
  black: '#000000',
  white: '#ffffff',
  border: 'rgba(0 0 0 / 0.3)',
  borderDark: 'rgba(255 255 255 / 0.3)',
  primary: '#6210cc',
  bg3: 'rgba(0 0 0 / 0.07)',
  bg3Dark: 'rgba(255 255 255 / 0.07)',
};

const sendbird = SendbirdChat.init({
  appId: '5884F3E6-135C-445B-8791-05B5D8DA6BB9',
});

function App(): JSX.Element {
  const [currentUserId, setCurrentUserId] = useState('');
  const [userId, setUserId] = useState('');
  const [nativeSendbirdUserId, setNativeSendbirdUserId] = useState('');
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'black' : 'white',
  };

  const currentAppState = useAppState();

  useEffect(() => {
    if (currentAppState === 'active') {
      if (Platform.OS === 'ios') {
        PushNotificationIOS.setApplicationIconBadgeNumber(0);
      }
      sendbird.setForegroundState();
    } else {
      sendbird.setBackgroundState();
    }
  }, [currentAppState]);

  const openNotifications = useCallback(() => {
    if (!userId.trim()) {
      return;
    }

    const disconnectFirst = !!nativeSendbirdUserId;
    NativeModules.SendbirdNotifications.open(
      userId,
      isDarkMode ? 'dark' : 'light',
      disconnectFirst,
      (nativeModuleUserId: string) => {
        setNativeSendbirdUserId(nativeModuleUserId);
      },
      console.error,
    );
  }, [isDarkMode, nativeSendbirdUserId, userId]);

  const onRemoteNotification = useEvent((notification: PushNotification) => {
    const data = notification.getData();

    if (data.sendbird) {
      const channelUrl = data.sendbird.channel.channel_url;
      if (channelUrl === 'notification_143867_feed') {
        openNotifications();
      }
    }

    // Use the appropriate result based on what you needed to do for this notification
    const result = PushNotificationIOS.FetchResult.NoData;
    notification.finish(result);
  });

  useEffect(() => {
    PushNotificationIOS.addEventListener('notification', onRemoteNotification);
    PushNotificationIOS.addEventListener(
      'localNotification',
      onRemoteNotification,
    );
    PushNotificationIOS.addEventListener('register', async token => {
      await sendbird.registerAPNSPushTokenForCurrentUser(token);
      console.log('Registered APNS push token:', token);
    });
    PushNotificationIOS.addEventListener('registrationError', error => {
      console.error('Failed to register APNS push token:', error);
    });
    return () => {
      PushNotificationIOS.removeEventListener('notification');
      PushNotificationIOS.removeEventListener('register');
      PushNotificationIOS.removeEventListener('registrationError');
    };
  }, [onRemoteNotification]);

  const signIn = async () => {
    const trimmedUserId = userId.trim();
    if (!trimmedUserId) {
      return;
    }

    try {
      await sendbird.connect(trimmedUserId);
      setCurrentUserId(trimmedUserId);
      PushNotificationIOS.requestPermissions();
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = async () => {
    try {
      if (sendbird.apnsPushToken) {
        await sendbird.unregisterAPNSPushTokenForCurrentUser(
          sendbird.apnsPushToken,
        );
      }
      await sendbird.disconnect();
      setCurrentUserId('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={[backgroundStyle, styles.wrapper]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <View style={styles.container}>
            <Text style={styles.headerText}>
              {currentUserId ? `Logged in as: ${currentUserId}` : 'Log in'}
            </Text>
            {currentUserId && (
              <TouchableOpacity onPress={openNotifications}>
                <IcNotifications />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.main}>
            {currentUserId ? (
              <View style={styles.buttons}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {backgroundColor: isDarkMode ? Colors.bg3Dark : Colors.bg3},
                  ]}
                  onPress={signOut}>
                  <Text
                    style={[
                      styles.buttonText,
                      {color: isDarkMode ? Colors.white : Colors.black},
                    ]}>
                    Sign out
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View>
                  <Text
                    style={[
                      styles.label,
                      {color: isDarkMode ? Colors.white : Colors.black},
                    ]}>
                    User ID
                  </Text>
                  <TextInput
                    accessibilityLabel="User ID"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={userId}
                    onChangeText={setUserId}
                    onEndEditing={signIn}
                    style={[
                      styles.input,
                      {
                        borderColor: isDarkMode
                          ? Colors.borderDark
                          : Colors.border,
                        color: isDarkMode ? Colors.white : Colors.black,
                      },
                    ]}
                  />
                </View>
                <TouchableOpacity
                  style={styles.button}
                  disabled={!userId.trim()}
                  onPress={signIn}>
                  <Text style={styles.buttonText}>Sign in</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {fontSize: 20, fontWeight: '700'},
  input: {
    borderRadius: 4,
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
  },
  main: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 4,
    padding: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
  },
});
