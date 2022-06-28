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
      flex: 1,
      width: '70%',
      marginLeft: '1.5%',
      height: '100%',
      flexDirection:'row',
      borderRadius: 10,
      alignSelf: 'flex-start',
      justifyContent: 'space-evenly', 
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
      marginTop: 10,
      borderRadius: 10,
      backgroundColor: scalesColors.secondaryBackground,
      width: '30%',
      height: '20%',
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
    }
});

export default styles;