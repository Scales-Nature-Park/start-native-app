import React, { useState } from 'react';
import axios from 'axios';
import storage, { url } from '../utils/SyncState';
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Image,
    Alert,
} from 'react-native';

const scalesColors = require('../utils/colors.json');

const LoginForm = ({ navigation }) => {
    console.log('hello');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [id, setID] = useState('');
    
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
            onPress = {() => AuthenticateCredentials(user, password, navigation, id, setID)}>
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
      </SafeAreaView>
    );   
};

function AuthenticateCredentials(username, password, navigation, id, setID) {
  axios({
    method: 'get',
    url: url + '/admin-signin',
    params: {
      "username": username,
      "password": password
    }
  }).then((response) => {
    navigation.navigate('Dash');
  }).catch(function (error) {
    Alert.alert('ERROR', error.response.data);
    console.log(error);
    return;
  });
};

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#fff',    
      paddingTop: StatusBar.currentHeight * 70 / 100,
      paddingBottom: StatusBar.currentHeight * 70 / 100,
    },

    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 100,
    },

    headText: {
      color: '#000000',
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 30,
    },
   
    image: {
      marginTop: 40,
      marginBottom: 40,
    },
   
    inputView: {
      backgroundColor: scalesColors.LightGreen,
      borderRadius: 15,
      width: "50%",
      height: 45,
      marginBottom: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
   
    TextInput: {
      height: 50,
      width: '100%',
      flex: 1,
      padding: 10,
      color:'#000000',
      textAlign: 'left',
    },

    loginBtn: {
      width: "60%",
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
});

export default LoginForm;