import React, { useState } from 'react';
import axios from 'axios';
import storage, { url } from '../utils/Storage';
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Alert,
} from 'react-native';

const scalesColors = require('../utils/colors.json');

const LoginForm = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [id, setID] = useState('');


    return (
      <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.inputView}>
                <TextInput
                style={styles.TextInput}
                placeholder="Email"
                placeholderTextColor="#000000"
                onChangeText={(email) => setEmail(email)}
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
                <Text style={styles.forgot_button}>Forgot Password?</Text>
            </TouchableOpacity>
        
            <TouchableOpacity style={styles.loginBtn}
            onPress = {() => AuthenticateCredentials(email, password, navigation, id, setID)}>
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signupBtn}
            onPress = {() => navigation.navigate('SignUp')}>
                <Text style={styles.loginText}>SIGNUP</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.offlineBtn}
            onPress = {() => navigation.navigate('Home', {id: '', onlineMode: false})}>
                <Text style={styles.loginText}>OFFLINE MODE</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
      </SafeAreaView>
    );   
};

function AuthenticateCredentials(email, password, navigation, id, setID) {
  axios({
    method: 'get',
    url: url + '/signin',
    params: {
      "email": email,
      "password": password
    }
  }).then((response) => {
    setID(response.data);
    storage.save({
      key: 'loginState', 
      data: {
        "email": email,
        "password": password,
        "id": response.data
      }
    }); 
    
    navigation.navigate('Home', {
      "id": id,
      "onlineMode": true,
    });
  }).catch(function (error) {
    Alert.alert('ERROR', error.response.data);
    console.log(error);
    return;
  });
};

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      paddingTop: StatusBar.currentHeight * 70 / 100,
      paddingBottom: StatusBar.currentHeight * 70 / 100,
      backgroundColor: '#fff',    
    },

    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 100,
    },
   
    image: {
      marginBottom: 40,
    },
   
    inputView: {
      backgroundColor: scalesColors.LightGreen,
      borderRadius: 30,
      width: "70%",
      height: 45,
      marginBottom: 20,
      alignItems: 'center',
    },
   
    TextInput: {
      height: 50,
      flex: 1,
      padding: 10,
      color:'#000000',
      textAlign: 'center',
    },
   
    forgot_button: {
      height: 30,
      marginBottom: 30,
      color: '#000000',
    },
   
    loginBtn: {
      width: "80%",
      borderRadius: 25,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 40,
      backgroundColor: scalesColors.DeepGreen,
    },

    loginText: {
      color: '#000000',
    },

    signupBtn: {
      width: "80%",
      borderRadius: 25,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 30,
      backgroundColor: "#FFFFFF",
      borderColor: scalesColors.DeepGreen,
      borderWidth: 1.5,
    },

    offlineBtn: {
      width: "80%",
      borderRadius: 25,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 30,
      backgroundColor: scalesColors.BlueRacer,
    },
});

export default LoginForm;