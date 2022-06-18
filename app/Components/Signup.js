import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/SignupStyles';
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

export default Signup;