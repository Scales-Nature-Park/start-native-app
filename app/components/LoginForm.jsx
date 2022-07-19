import React, { useState, useLayoutEffect } from 'react';
import axios from 'axios';
import styles from '../styles/LoginStyles';
import storage, { url } from '../utils/Storage';
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
    const [id, setID] = useState('');
    const [dark, setDark] = useState(true);
    const netInfo = useNetInfo();

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
        setID(response.data);
        storage.save({
          key: 'loginState', 
          data: {
            username,
            password,
            "id": response.data
          }
        }); 
        
        navigation.navigate('Home', {
          "id": response.data,
          "onlineMode": true,
        });
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
                onChangeText={(username) => setUser(username)}
                />
            </View>
        
            <View style={styles.inputView}>
                <TextInput
                style={styles.TextInput}
                placeholder="Password"
                placeholderTextColor="#000000"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
                />
            </View>
        
            <TouchableOpacity>
                <Text style={(dark) ? styles.forgotDark : styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>
        
            <TouchableOpacity style={styles.loginBtn}
            onPress = {() => AuthenticateCredentials(username, password, id, setID)}>
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signupBtn}
            onPress = {() => navigation.navigate('SignUp')}>
                <Text style={styles.loginText}>SIGNUP</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.offlineBtn}
            onPress = {() => navigation.navigate('Home', {id: '', onlineMode: false})}>
                <Text style={styles.loginText}>GUEST MODE</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
      </SafeAreaView>
    );   
};

export default LoginForm;