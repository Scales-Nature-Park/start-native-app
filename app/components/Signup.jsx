import React, { useState, useLayoutEffect } from 'react';
import axios from 'axios';
import styles from '../styles/SignupStyles';
import { useNetInfo } from "@react-native-community/netinfo";
import { url } from '../utils/Storage'
import {
    StatusBar,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Alert,
} from 'react-native';

const Signup = ({ navigation }) => {
    const [username, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
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

    const RegisterUser = (username, password, password2) => {
      // validate network connection
      if (!netInfo.isConnected) {
        Alert.alert('Network Error', 'It seems that you are not connected to the internet. Please check your connection and try again later.');
        return;
      }

      // validate username and password to be of appropriate sizes
      if (username.toString().length < 1) {
        Alert.alert('ERROR', "Username needs to be at least 1 character.");
        return;
      }
      
      if (password.toString().length < 8) {
        Alert.alert('ERROR', "Password needs to be at least 8 characters.");
        return;
      }
      
      // validate both passwords to match
      if (password.toString() !== password2.toString()) {
        Alert.alert('ERROR', "Entered passwords don't match.");
        return;
      }

      axios({
        method: 'post',
        url: url + '/signup',
        params: {
          "username": username,
          "password": password
        }
      }).then((response) => {
        navigation.navigate('Login');
      }).catch((error) => {
        Alert.alert('ERROR', error.response.data);
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

            <View style={styles.inputView}>
                <TextInput
                style={styles.TextInput}
                placeholder="Verify Password"
                placeholderTextColor="#000000"
                secureTextEntry={true}
                onChangeText = {(pass) => setPassword2(pass)}
                />
            </View>
        
            <TouchableOpacity style={styles.loginBtn}
            onPress = {() => RegisterUser(username, password, password2)}>
                <Text style={styles.loginText}>REGISTER</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
      </SafeAreaView>
    );
}

export default Signup;