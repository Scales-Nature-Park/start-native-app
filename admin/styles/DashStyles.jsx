import { StyleSheet, StatusBar } from 'react-native';

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
      height: '100%',
    },

    mainContainer: {
      backgroundColor: scalesColors.secondaryBackground,
      width: '70%',
      marginLeft: '1.5%',
      height: 200,
      borderRadius: 10,
      alignSelf: 'flex-start'
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

    rule: {
      borderBottomColor: '#fff',
      borderWidth: 100000,
    },

    fieldText: {
      fontSize: 16,
      marginLeft: '2%',
      marginTop: 5
    },
    
    recentText: {
      fontSize: 16,
      textAlign: 'center',
      marginTop: 5,
      marginBottom: 10, 
    }, 
    
});

export default styles;