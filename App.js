import React, { useState } from 'react';
import LoginForm from './Components/LoginForm'; 
import DataInput from './Components/DataInput';
import {StyleSheet, useColorScheme,} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerTitleAlign: 'center',}}>
        <Stack.Screen name='Login' component={LoginForm}>
        </Stack.Screen>

        <Stack.Screen name='DataEntry' component={DataInput}>
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
