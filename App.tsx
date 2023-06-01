import React, {useState} from 'react';
import {
  NativeModules,
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

import IcNotifications from './src/assets/ic-notifications.svg';

const Colors = {
  black: '#000000',
  white: '#ffffff',
  border: 'rgba(0 0 0 / 0.3)',
  borderDark: 'rgba(255 255 255 / 0.3)',
};

function App(): JSX.Element {
  const [userId, setUserId] = useState('');
  const [nativeSendbirdUserId, setNativeSendbirdUserId] = useState('');
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'black' : 'white',
  };

  const openNotifications = () => {
    if (!userId.trim()) {
      return;
    }

    const disconnectFirst = !!nativeSendbirdUserId;
    NativeModules.SendbirdNotifications.open(
      userId,
      isDarkMode ? 'dark' : 'light',
      disconnectFirst,
      setNativeSendbirdUserId,
      console.error,
    );
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
            <TouchableOpacity onPress={openNotifications}>
              <IcNotifications />
            </TouchableOpacity>
          </View>
          <View style={styles.inputWrapper}>
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
              value={userId}
              onChangeText={setUserId}
              style={[
                styles.input,
                {
                  borderColor: isDarkMode ? Colors.borderDark : Colors.border,
                  color: isDarkMode ? Colors.white : Colors.black,
                },
              ]}
            />
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
    justifyContent: 'flex-end',
  },
  input: {
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 16,
    lineHeight: 22,
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
  },
  inputWrapper: {
    padding: 16,
  },
});
