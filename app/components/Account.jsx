import React, { useState, useLayoutEffect } from 'react';
import axios from 'axios';
import styles from '../styles/AccountStyles';
import { url } from '../utils/Storage';
import { useNetInfo } from "@react-native-community/netinfo";
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

const Account = ({ route, navigation }) => {
    const [username, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [currPass, setCurrPass] = useState('')
    const [dark, setDark] = useState(true);
    const netInfo = useNetInfo();
    const accountId = route?.params?.id;

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
    
    if (accountId && !username && netInfo.isConnected) {
        axios({
            method: 'get',
            url: url + '/username/' + accountId,
        }).then((response) => {
            setUser(response.data);
        }).catch((error) => {
            Alert.alert('ERROR', error.message);
            return;
        });
    } 

    const AuthenticateCredentials = () => {
        // validate network connection
        if (!netInfo.isConnected) {
            Alert.alert('Network Error', 'It seems that you are not connected to the internet. Please check your connection and try again later.');
            return;
        }

        if (!accountId || !username) {
            Alert.alert('ERROR', 'Failed to retrieve your account information. This can be due to a lost internet connection, please login and try again.');
            return;
        }

        // validate passwords to match and be of appropriate sizes
        if (password.toString().length < 8) {
            Alert.alert('ERROR', "New password needs to be at least 8 characters.");
            return;
        }
        
        if (password.toString() !== password2.toString()) {
            Alert.alert('ERROR', "Entered passwords don't match.");
            return;
        }
        
        // vaidate new and current passwords to not match
        if (password.toString() == currPass.toString()) {
            Alert.alert('ERROR', "New password can't match your current password.");
            return;
        }

        axios({
            method: 'get',
            url: url + '/signin',
            params: {
                "username": username,
                "password": currPass
            }
        }).then((response) => {
            UpdatePassword();
        }).catch(function (error) {
            Alert.alert('ERROR', error.response.data);
            return;
        });
    };

    const UpdatePassword = () => {
        axios({
            method: 'put',
            url: url + '/password/' + accountId,
            params: {
                currentPassword: currPass,
                newPassword: password
            }
        }).then((response) => {
            console.log(response);
            Alert.alert('Success', 'Updated your password successfully.');
            return;
        }).catch((error) => {
            Alert.alert('ERROR', error.response.data);
            return;
        });
    };

    const DeleteUser = () => {
        // validate network connection
        if (!netInfo.isConnected) {
            Alert.alert('Network Error', 'It seems that you are not connected to the internet. Please check your connection and try again later.');
            return;
        }
        
        // verify the account id exists 
        if (!accountId) {
            Alert.alert('ERROR', 'Failed to retrieve your account information. This can be due to a lost internet connection, please login and try again.');
            return;
        }
        
        // request account deletion
        axios({
            method: 'delete',
            url: url + '/user/' + accountId,
        }).then((response) => {
            Alert.alert('Success', 'Deleted your account successfully. Return to login page.');
            navigation.navigate('Login');
        }).catch(function (error) {
            Alert.alert('ERROR', error.response.data);
            return;
        });
    };

    return (
        <SafeAreaView style={(dark) ? styles.safeAreaDark : styles.safeArea}>
        <ScrollView>
            {(username)  ?
            <View style={styles.container2}>
                <Text style={(dark) ? styles.hiDark : styles.hi}>Hi {username}!</Text>
            </View> : null}

            <View style={styles.container}>
                <StatusBar style="auto" />
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Current Password"
                        placeholderTextColor="#000000"
                        secureTextEntry={true}
                        onChangeText={(text) => setCurrPass(text)}
                    />
                </View>
            
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="New Password"
                        placeholderTextColor="#000000"
                        secureTextEntry={true}
                        onChangeText={(text) => setPassword(text)}
                    />
                </View>

                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Confirm New Password"
                        placeholderTextColor="#000000"
                        secureTextEntry={true}
                        onChangeText={(text) => setPassword2(text)}
                    />
                </View>
            
                <TouchableOpacity style={styles.loginBtn}
                onPress = {() => AuthenticateCredentials()}>
                    <Text style={styles.loginText}>UPDATE PASSWORD</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.offlineBtn}
                onPress = {DeleteUser}>
                    <Text style={styles.loginText}>DELETE ACCOUNT</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
        </SafeAreaView>
    );   
};

export default Account;