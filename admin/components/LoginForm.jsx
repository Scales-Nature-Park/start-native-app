import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/LoginStyles';
import { url } from '../utils/SyncState';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Image,
    Alert,
} from 'react-native';

const LoginForm = ({ params, setScreen }) => {
    const [username, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [id, setID] = useState('');

    const AuthenticateCredentials = () => {
      setScreen({val: 'Dashboard', params: {username, id}});

      // axios({
      //   method: 'get',
      //   url: url + '/admin-signin',
      //   params: {
      //     "username": username,
      //     "password": password
      //   }
      // }).then(response => {
      //   setScreen({val: 'Dashboard', params: {username, id}});
      // }).catch(error => {
      //   Alert.alert('ERROR', error?.response?.data || error.message);
      //   return;
      // });
    };
    
    return (
      <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
            <Text style={styles.headText}>Admin Portal</Text>
            <Image style={styles.image} source={require('../assets/logo.webp')}/>
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
        
            <TouchableOpacity style={styles.loginBtn}
            onPress = {() => AuthenticateCredentials()}>
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
      </SafeAreaView>
    );   
};

export default LoginForm;