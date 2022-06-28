import { StyleSheet, StatusBar, Dimensions, useWindowDimensions } from 'react-native';

const scalesColors = require('../utils/colors.json');

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      paddingTop: StatusBar.currentHeight * 70 / 100,
      paddingBottom: StatusBar.currentHeight * 70 / 100,
      backgroundColor: scalesColors.background,    
    },
  
    buttonView: { 
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#121221'
    },

    headText: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'left',
      margin: '2%',
      fontSize: 30,
    },

    container: {
      flex: 1,
      width: '98.5%',
      height: Dimensions.get('window').height
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

    accountContainer: {
      borderRadius: 10,
      marginTop: 7,
      backgroundColor: scalesColors.secondaryBackground,
      width: '95%',
      alignSelf: 'center',
      height: '10%',
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