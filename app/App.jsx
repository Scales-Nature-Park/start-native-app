import React from 'react';
import axios from 'axios';
import LoginForm from './components/LoginForm'; 
import DataInput from './components/DataInput';
import Signup from './components/Signup';
import Home from './components/Home';
import PrevEntries from './components/PrevEntries';
import Search from './components/Search';
import Account from './components/Account';
import storage, { url, ArrayEquals } from './utils/Storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert } from 'react-native';


const dataFields = require('./utils/fields.json');

/**
 * Asynchronous function that fetches data fields from the server and compares
 * them with local fields then prompts the user to download the "update" or skip it
 * for now.
 */
const FetchFields = async () => {
  try {
    let fields = [];
    let localFields = [];
    
    // fetch data fields from the database
    try {
      let res = await axios({
        method: 'get',
        url: url + '/fields'
      });

      fields = res.data;
    } catch (err) {
      fields = undefined;
    }
    
    // fetch local data fields from local mobile storage
    try {
      localFields = await storage.load({key: 'fields'});
    } catch (err) {
      // use fields.json if local data isn't found
      localFields = [...dataFields];
    }

    if (fields == undefined || ArrayEquals(localFields, fields, true)) return;
    
    // prompt user to download updated fields or skip download for now
    Alert.alert('New Update', 'A new update is currently available for download.', [
      {
        text: 'Remind Me Later',
        onPress: () => {}
      },
      {
        text: 'Download Now',
        onPress: () => {
          storage.save({
            key: 'fields',
            data: fields
          });
        }
      }
    ]);
  } catch (err) {}
};

const Stack = createNativeStackNavigator();

const App = () => {
  const netInfo = useNetInfo();

  if (netInfo?.isConnected) FetchFields();

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

        <Stack.Screen name='Account' component={Account} options={{title: 'Account'}}>
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
