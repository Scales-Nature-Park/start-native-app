import React, { useState } from 'react';
import LoginForm from './Components/LoginForm'; 
import {StyleSheet, useColorScheme,} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <>
      <LoginForm />
    </>
  );
};

export default App;
