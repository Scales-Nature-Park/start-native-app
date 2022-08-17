import React, { useState } from 'react';
import styles from '../styles/LoginStyles';
import { AuthenticateCredentials } from '../utils/Credentials';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Image,
} from 'react-native';

const LoginForm = ({ params, setScreen }) => {
    const [username, setUser] = useState('');
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
                  onChangeText={username => setUser(username)}
                />
            </View>

            <View style={styles.inputView}>
                <TextInput
                  style={styles.TextInput}
                  placeholder="Password"
                  placeholderTextColor="#000000"
                  secureTextEntry={true}
                  onChangeText={password => setPassword(password)}
                />
            </View>
        
            <TouchableOpacity style={styles.loginBtn}
            onPress = {() => AuthenticateCredentials(setScreen, username, password)}>
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
      </SafeAreaView>
    );   
};

export default LoginForm;