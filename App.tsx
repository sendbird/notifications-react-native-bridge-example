import React from 'react';
import {
  NativeModules,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import IcNotifications from './src/assets/ic-notifications.svg';

const Colors = {
  black: '#000000',
  white: '#ffffff',
};

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'black' : 'white',
  };

  const openNotifications = () => {
    NativeModules.SendbirdNotifications.open(
      'test',
      isDarkMode ? 'dark' : 'light',
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
});
