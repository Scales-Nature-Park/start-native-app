import React, { useState } from 'react';
import Input from 'react-native-input-style';
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
} from 'react-native';

const Signup = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    return (
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
                onChangeText={(password) => setPassword(password)}
                />
            </View>
        
            <TouchableOpacity style={styles.loginBtn}
            onPress = {() => RegisterUser(email, password, navigation)}>
                <Text style={styles.loginText}>REGISTER</Text>
            </TouchableOpacity>
        </View>
    );
}

function RegisterUser(email, password, navigation) {
    navigation.navigate('Login');
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
   
    image: {
      marginBottom: 40,
    },
   
    inputView: {
      backgroundColor: "#79f79b",
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
    },

    loginBtn: {
      width: "80%",
      borderRadius: 25,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 40,
      backgroundColor: "#089c2f",
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