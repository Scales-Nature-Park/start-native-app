import { StyleSheet, StatusBar, Dimensions } from 'react-native';

const scalesColors = require('../utils/colors.json');

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
      alignItems: 'center'
    },

    headText: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'left',
      margin: '2%',
      fontSize: 30,
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
      marginRight: '1.5%',
      position: 'absolute',
      alignSelf: 'flex-end',
      width: '22%',
      borderRadius: 10,
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
    },

    accountName: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '40%'
    },

    updateButton: {
      backgroundColor: '#f58442',
      height: '100%',
      width: '25%',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    deleteButton: {
      backgroundColor: '#850d23',
      height: '100%',
      width: '25%',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
});

export default styles;