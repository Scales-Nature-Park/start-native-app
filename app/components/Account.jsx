import axios from 'axios';
import styles from '../styles/AccountStyles';
import React, { useState, useContext, useLayoutEffect } from 'react';
import { AuthenticateCredentials, DeleteUser } from '../utils/Credentials';
import { url, UserContext } from '../utils/Storage';
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

const Account = ({ navigation }) => {
    const user = useContext(UserContext);
    const netInfo = useNetInfo();
    const accountId = user.userInfo.id;
    const [username, setUser] = useState(user?.userInfo?.username || '');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [currPass, setCurrPass] = useState('')
    const [dark, setDark] = useState(true);

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
        }).then(response => {
            setUser(response.data);
        }).catch(error => {
            Alert.alert('ERROR', error?.response?.data || error.message);
            return;
        });
    } 

    return (
        <SafeAreaView style={(dark) ? styles.safeAreaDark : styles.safeArea}>
        <ScrollView>
            {(username)  ?
            <View>
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
                onPress = {() => AuthenticateCredentials(netInfo, accountId, username, currPass, password, password2)}>
                    <Text style={styles.loginText}>UPDATE PASSWORD</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.offlineBtn}
                onPress = {() => DeleteUser(netInfo, accountId, navigation)}>
                    <Text style={styles.loginText}>DELETE ACCOUNT</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
        </SafeAreaView>
    );   
};

export default Account;