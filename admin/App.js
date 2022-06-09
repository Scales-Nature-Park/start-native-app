import React from 'react';
import LoginForm from './Components/LoginForm'; 
import Dashboard from './Components/Dashboard';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Login' component={LoginForm}>
        </Stack.Screen>

        <Stack.Screen name='Dash' component={Dashboard}>
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
