import LoginForm from './components/LoginForm'; 
import DataInput from './components/DataInput';
import Signup from './components/Signup';
import Home from './components/Home';
import PrevEntries from './components/PrevEntries';
import Search from './components/Search';
import Account from './components/Account';
import styles from './styles/GlobalStyles';
import Feather from 'react-native-vector-icons/Feather';
import Clipboard from '@react-native-clipboard/clipboard';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ToastProvider } from 'react-native-toast-notifications'
import { FetchFields } from './utils/Fields';
import { UserContext } from './utils/Storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

Feather.loadFont();
const Stack = createNativeStackNavigator();

const App = () => {
  const netInfo = useNetInfo();
  const [userInfo, setUserInfo] = useState({id: '', username: '', sharedEntries: []});

  if (netInfo?.isConnected) FetchFields();

  return (
    <ToastProvider
        placement='bottom'
        duration={5000}
        animationType='zoom-in'
        animationDuration={250}
        offset={50} 
        offsetTop={30}
        offsetBottom={40}
        swipeEnabled={true}
        renderType={{
          with_copy_button: toast => (
            <View style={styles.toastContainer}>
              <Text style={styles.text}>{toast.message}</Text>
              <TouchableOpacity onPress={() => Clipboard.setString(toast.message)} style={styles.toastButton}>
                <Feather name='copy' size={30} color='#fff' />
              </TouchableOpacity>
            </View>
          ),
        }}
    >
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
    </ToastProvider>
  );
};

export default App;
