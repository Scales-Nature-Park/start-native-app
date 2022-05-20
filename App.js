import React, { useState } from 'react';
import LoginForm from './Components/LoginForm'; 
import DataInput from './Components/DataInput';
import Signup from './Components/Signup'
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

        <Stack.Screen name='DataEntry' component={DataInput} options={{title: 'Data Entry'}}>
        </Stack.Screen>

        <Stack.Screen name='SignUp' component={Signup} options={{title: 'Sign Up'}}>
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
