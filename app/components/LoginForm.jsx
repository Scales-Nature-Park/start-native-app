import React, { useState, useLayoutEffect, useContext } from 'react';
import axios from 'axios';
import styles from '../styles/LoginStyles';
import { url, UserContext } from '../utils/Storage';
import { useNetInfo } from "@react-native-community/netinfo";
import {
    StatusBar,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Image,
    Alert,
} from 'react-native';

const LoginForm = ({ navigation }) => {
    const [username, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [dark, setDark] = useState(true);
    const netInfo = useNetInfo();
    const user = useContext(UserContext);
        
    useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity onPress= {() => setDark(!dark)}>
                {
                    (dark) ? <Image source={require('../assets/sun.png')} style={styles.iconImage}/> :
                             <Image source={require('../assets/moon.png')} style={styles.iconImage}/>
                }
            </TouchableOpacity>
          ),
        });
    });

    const AuthenticateCredentials = (username, password) => {
      // validate network connection
      if (!netInfo.isConnected) {
        Alert.alert('Network Error', 'It seems that you are not connected to the internet. Please check your connection and try again later.');
        return;
      }

      axios({
        method: 'get',
        url: url + '/signin',
        params: {
          username,
          password
        }
      }).then(response => {
        if (!response?.data) throw 'Invalid credentials. Please verify you have entered the correct username and password.';

        user.setUserInfo({id: response?.data?.id || '', username: username || '', sharedEntries: (response?.data?.sharedEntries) ? [...response?.data?.sharedEntries] : []});
        navigation.navigate('Home');
      }).catch(error => {
        Alert.alert('ERROR', error.response.data || error.message);
        return;
      });
    };

    return (
      <SafeAreaView style={(dark) ? styles.safeAreaDark : styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.inputView}>
                <TextInput
                  style={styles.TextInput}
                  placeholder="Username"
                  placeholderTextColor="#000000"
                  onChangeText={username => setUser(username)}
                />
            </View>
        
            <View style={styles.inputView}>
                <TextInput
                  style={styles.TextInput}
                  placeholder="Password"
                  placeholderTextColor="#000000"
                  secureTextEntry={true}
                  onChangeText={password => setPassword(password)}
                />
            </View>
        
            <TouchableOpacity>
                <Text style={(dark) ? styles.forgotDark : styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>
        
            <TouchableOpacity style={styles.loginBtn}
            onPress = {() => AuthenticateCredentials(username, password)}>
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signupBtn}
            onPress = {() => navigation.navigate('SignUp')}>
                <Text style={styles.loginText}>SIGNUP</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.offlineBtn}
            onPress = {() => {
              // reset user info to avoid registered user privileges
              user.setUserInfo({id: '', username: '', sharedEntries: []});
              navigation.navigate('Home');
            }}>
                <Text style={styles.loginText}>GUEST MODE</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
      </SafeAreaView>
    );   
};

export default LoginForm;