import { StatusBar, StyleSheet, Dimensions } from "react-native";

const scalesColors = require('../utils/colors.json');

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

export default styles;