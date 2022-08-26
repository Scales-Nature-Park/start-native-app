import { StyleSheet, StatusBar, Dimensions } from 'react-native';

const scalesColors = require('../utils/json/colors.json');

const styles = StyleSheet.create({
    safeArea: {
      flex: 1, 
      backgroundColor: scalesColors.background,    
    },
  
    buttonView: { 
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#121221'
    },

    header: {
      flex: 1,
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
    },

    headText: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'left',
      margin: '2%',
      fontSize: 30,
      alignSelf: 'flex-start'
    },

    subfieldText: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'left',
      fontSize: 25,
      marginLeft: '2.5%',
      alignSelf: 'flex-start'
    },

    logout: {
      position: 'absolute',
      right: 0,
      marginRight: '1.5%',
      width: '5.5%',
      height: '40%',
      justifyContent: 'center',
      backgroundColor: '#d90019',
      borderRadius: 10,
      minHeight: 40,
      minWidth: 100,
    },

    release: {
      position: 'absolute', 
      right: '10%',
      width: '10%',
      height: '40%',
      justifyContent: 'center',
      backgroundColor: '#0b4c7d',
      borderRadius: 10,
      minHeight: 40,
    },

    logoutText: {
      textAlign: 'center',
      fontSize: 16
    },

    container: {
      width: '98.5%',
      marginBottom: '3%'
    },

    mainContainer: {
      width: '70%',
      marginLeft: '1.5%',
      height: '100%',
      borderRadius: 10,
      alignSelf: 'flex-start',
    },

    sideContainer: {
      height: '100%',
      width: '100%',
      flexDirection: 'column', 
      position: 'absolute',
      alignItems: 'flex-end',
    },

    entryCountContainer: {
      flexDirection:'row',
      justifyContent: 'space-evenly', 
      height: '20%',
      maxHeight: 190 
    },

    recentsContainer: {
      maxHeight: 600,
      backgroundColor: scalesColors.secondaryBackground,
      marginLeft: '1.5%',
      alignSelf: 'flex-end',
      width: '28%',
      borderRadius: 10,
      paddingBottom: 10
    },

    categoryContainer: {
      maxHeight: '45%' > 600 ? 600 : '45%',
      marginTop: 30,
      backgroundColor: scalesColors.secondaryBackground,
      marginLeft: '1.5%',
      alignSelf: 'flex-end',
      width: '28%',
      borderRadius: 10, 
      paddingBottom: 10,
    },

    categories: {
      marginBottom: '17%',
    },

    addButton: {
      backgroundColor: '#0b4c7d',
      width: '92%',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
      borderRadius: 5,
      height: 40,
      alignSelf: 'center'  
    },

    recentActivity: {
      borderRadius: 10,
      backgroundColor: scalesColors.secondaryBackground,
      width: '30%',
      height: '100%',
      minHeight: 120
    },

    fieldText: {
      fontFamily: 'Assets/Smooch-Regular.ttf#Smooch',
      fontSize: 16,
      marginLeft: '5%',
      marginTop: 5
    },
    
    activityNum: {
      fontSize: 35,
      textAlign: 'right',
      fontWeight: 'bold',
      marginRight: '5%'
    },  

    activityText: {
      fontSize: 15,
      textAlign: 'right',
      marginRight: '5%',
    },

    recentText: {
      fontSize: 16,
      textAlign: 'center',
      marginTop: 5,
      marginBottom: 10, 
    }, 

    imageContainer: {
      position: 'absolute',
      height: '100%',
      width: '100%',
    },

    reptileImage: {
      marginTop: '15%',
      marginLeft: '5%',
      width: '30%',
      height: '60%'
    },

    turtleImage: {
      marginTop: '15%',
      marginLeft: '5%',
      width: '50%',
      height: '90%'
    },

    margin: {
      marginTop: 30
    },

    accounts: {
      width: '70%',
      alignItems: 'center'
    },

    accountContainer: {
      borderRadius: 10,
      marginTop: 7,
      backgroundColor: scalesColors.secondaryBackground,
      width: '95%',
      alignSelf: 'center',
      height: 100,
      justifyContent: 'center',
    },

    accountContent: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      height: '100%'
    },

    accountName: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '40%'
    },

    updateFieldButton: {
      backgroundColor: scalesColors.DeepGreen,
      height: '65%',
      width: '25%',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center'
    },
    
    deleteFieldButton: {
      backgroundColor: '#850d23',
      width: '25%',
      height: '65%',
      borderRadius: 10,
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
    },

    updateButton: {
      backgroundColor: scalesColors.DeepGreen,
      height: '40%',
      width: '80%',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    deleteButton: {
      backgroundColor: '#850d23',
      width: '80%',
      height: '40%',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },

    permContainer: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      height: '100%',
      width: '50%'
    },

    buttonContainer: {
      width: '60%',
      height: '100%',
      flex: 1,
      flexDirection: 'row',
    },
});

export default styles;