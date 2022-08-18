import React, { useState, useLayoutEffect } from 'react';
import styles from '../styles/SignupStyles';
import { RegisterUser } from '../utils/Credentials';
import { useNetInfo } from '@react-native-community/netinfo';
import {
    StatusBar,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from 'react-native';

const Signup = ({ navigation }) => {
    const [username, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [dark, setDark] = useState(true);
    const netInfo = useNetInfo();

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

            <View style={styles.inputView}>
                <TextInput
                style={styles.TextInput}
                placeholder="Verify Password"
                placeholderTextColor="#000000"
                secureTextEntry={true}
                onChangeText = {pass => setPassword2(pass)}
                />
            </View>
        
            <TouchableOpacity style={styles.loginBtn}
            onPress = {() => RegisterUser(username, password, password2, navigation, netInfo)}>
                <Text style={styles.loginText}>REGISTER</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
      </SafeAreaView>
    );
}

export default Signup;