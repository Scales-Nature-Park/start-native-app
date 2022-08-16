import LoginForm from './components/LoginForm'; 
import DataInput from './components/DataInput';
import Signup from './components/Signup';
import Home from './components/Home';
import PrevEntries from './components/PrevEntries';
import Search from './components/Search';
import Account from './components/Account';
import React, { useState } from 'react';
import { FetchFields } from './utils/Fields';
import { UserContext } from './utils/Storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const App = () => {
  const netInfo = useNetInfo();
  const [userInfo, setUserInfo] = useState({id: '', username: '', sharedEntries: []});

  if (netInfo?.isConnected) FetchFields();

  return (
    <UserContext.Provider value={{userInfo, setUserInfo}}>
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

          <Stack.Screen name='Account' component={Account} options={{title: 'Account'}}>
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
};

export default App;
