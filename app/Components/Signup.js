import React, { useState } from 'react';
import axios from 'axios';
import { url } from '../utils/Storage'
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Dimensions,
    Alert,
} from 'react-native';

const scalesColors = require('../utils/colors.json');

const Signup = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [dark, setDark] = useState(true);

    React.useLayoutEffect(() => {
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
    
    return (
      <SafeAreaView style={(dark) ? styles.safeAreaDark : styles.safeArea}>
      <View style={styles.overlay}/>
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
            onPress = {() => RegisterUser(email, password, password2, navigation)}>
                <Text style={styles.loginText}>REGISTER</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
      </SafeAreaView>
    );
}

function RegisterUser(email, password, password2, navigation) {
    if (!email.toString().includes('@') || !email.toString().includes('.')) {
      Alert.alert('ERROR', "Email needs to be in this format: 'uername@domain.com'.");
      return;
    }

    if (password.toString() !== password2.toString()) {
      Alert.alert('ERROR', "Entered passwords don't match.");
      return;
    }

    if (password.toString().length < 8) {
      Alert.alert('ERROR', "Password needs to be at least 8 characters.");
      return;
    }
  
    axios({
      method: 'post',
      url: url + '/signup',
      params: {
        "email": email,
        "password": password
      }
    }).then((response) => {
      console.log(response.status);
      navigation.navigate('Login');
    }).catch(function (error) {
      Alert.alert('ERROR', error.response.data);
      return;
    });
}

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

    iconImage: {
      width: 40,
      height: 40
    },

    overlay: {
      flex: 1,
      position: 'absolute',
      left: 0,
      top: 0,
      opacity: 0.14,
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
      alignItems: "center",
    },
   
    TextInput: {
      height: '100%',
      flex: 1,
      padding: 10,
      width: '100%',
      textAlign: 'center',
      color:'#000000',
      textAlign: 'center',
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
      borderColor: '#089c2f',
      borderWidth: 1.5,
    },
});


export default Signup;