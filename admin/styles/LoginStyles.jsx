import { StyleSheet, StatusBar } from 'react-native';

const scalesColors = require('../utils/colors.json');

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#fff',    
      paddingTop: StatusBar.currentHeight * 70 / 100,
      paddingBottom: StatusBar.currentHeight * 70 / 100,
    },

    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 100,
    },

    headText: {
      color: '#000000',
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 30,
    },
   
    image: {
      marginTop: 40,
      marginBottom: 40,
    },
   
    inputView: {
      backgroundColor: scalesColors.LightGreen,
      borderRadius: 15,
      width: "50%",
      height: 45,
      marginBottom: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
   
    TextInput: {
      height: 50,
      width: '100%',
      flex: 1,
      padding: 10,
      color:'#000000',
      textAlign: 'left',
    },

    loginBtn: {
      width: "60%",
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
});

export default styles;