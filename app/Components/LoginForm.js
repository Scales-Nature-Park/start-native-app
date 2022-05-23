import React, { useState } from 'react';
import axios from 'axios';
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollViewBase,
    ScrollView,
    SafeAreaView,
    Alert,
} from 'react-native';

const scalesColors = require('../colors.json');
const url = 'http://192.168.68.122:5000';

const LoginForm = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
            onPress = {() => AuthenticateCredentials(email, password, navigation)}>
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signupBtn}
            onPress = {() => navigation.navigate('SignUp')}>
                <Text style={styles.loginText}>SIGNUP</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
      </SafeAreaView>
    );   
};

function AuthenticateCredentials(email, password, navigation) {
  axios({
    method: 'get',
    url: url + '/signin',
    params: {
      "email": email,
      "password": password
    }
  }).then((response) => {
    console.log(response);
    navigation.navigate('Home');
  }).catch(function (error) {
    Alert.alert(error.message);
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
      marginTop: 40,
      backgroundColor: "#FFFFFF",
      borderColor: scalesColors.DeepGreen,
      borderWidth: 1.5,
    },
});

export default LoginForm;