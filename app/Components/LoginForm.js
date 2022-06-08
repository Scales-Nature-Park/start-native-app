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
    Dimensions,
} from 'react-native';

const scalesColors = require('../utils/colors.json');

const LoginForm = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [id, setID] = useState('');
    const [dark, setDark] = useState(true);

    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity onPress= {() => setDark(!dark)}>
                {
                    // (dark) ? <Image source={photo} style={styles.image}/> :
                    //          <Image source={photo} style={styles.image}/>
                }
                <Text>Dark Mode</Text>
            </TouchableOpacity>
          ),
        });
    });

    return (
      <SafeAreaView style={(dark) ? styles.safeAreaDark : styles.safeArea}>
      <View style={styles.overlay} />
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
                <Text style={(dark) ? styles.forgotDark : styles.forgot}>Forgot Password?</Text>
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
                <Text style={styles.loginText}>GUEST MODE</Text>
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

    safeAreaDark: {
      flex: 1,
      paddingTop: StatusBar.currentHeight * 70 / 100,
      paddingBottom: StatusBar.currentHeight * 70 / 100,
      backgroundColor: '#121212',    
    },

    overlay: {
      flex: 1,
      position: 'absolute',
      left: 0,
      top: 0,
      opacity: 0.07,
      backgroundColor: '#fff',
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    },

    container: {
      flex: 1,
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
   
    forgot: {
      height: 30,
      marginBottom: 30,
      color: '#000000',
    },

    forgotDark: {
      height: 30,
      marginBottom: 30,
      color: '#fff',
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