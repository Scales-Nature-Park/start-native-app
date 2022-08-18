import styles from '../styles/LoginStyles';
import React, { useState, useLayoutEffect, useContext } from 'react';
import { AuthenticateCredentials } from '../utils/Credentials';
import { UserContext } from '../utils/Storage';
import { useNetInfo } from '@react-native-community/netinfo';
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
    const [username, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [dark, setDark] = useState(true);
    const netInfo = useNetInfo();
    const user = useContext(UserContext);
        
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
        
            <TouchableOpacity>
                <Text style={(dark) ? styles.forgotDark : styles.forgot} onPress={() => Alert.alert('Forgotten Passwords', 'Please contact a senior staff member or a developer to change your password.')}>
                  Forgot Password?
                </Text>
            </TouchableOpacity>
        
            <TouchableOpacity style={styles.loginBtn}
            onPress = {() => AuthenticateCredentials(netInfo, username, password, navigation, user)}>
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signupBtn}
            onPress = {() => navigation.navigate('SignUp')}>
                <Text style={styles.loginText}>SIGNUP</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.offlineBtn}
            onPress = {() => {
              // reset user info to avoid registered user privileges
              user.setUserInfo({id: '', username: '', sharedEntries: []});
              navigation.navigate('Home');
            }}>
                <Text style={styles.loginText}>GUEST MODE</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
      </SafeAreaView>
    );   
};

export default LoginForm;