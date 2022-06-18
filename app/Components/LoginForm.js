import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/LoginStyles';
import storage, { url } from '../utils/Storage';
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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [id, setID] = useState('');
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

export default LoginForm;