import React, { useState } from 'react';
import LoginForm from './Components/LoginForm'; 
import DataInput from './Components/DataInput';
import Signup from './Components/Signup';
import Home from './Components/Home';
import PrevEntries from './Components/PrevEntries';
import Search from './Components/Search';
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

        <Stack.Screen name='Home' component={Home} options={{title: 'Home'}}>
        </Stack.Screen>

        <Stack.Screen name='PrevEntries' component={PrevEntries} options={{title: 'Saved Entries'}}>
        </Stack.Screen>

        <Stack.Screen name='Search' component={Search} options={{title: 'Search'}}>
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
