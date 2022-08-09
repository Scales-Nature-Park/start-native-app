import { StatusBar, StyleSheet, Dimensions } from "react-native";

const scalesColors = require('../utils/colors.json');

const entryStyles = StyleSheet.create({
    container: {
      width: '95%',
      borderColor: '#E6EAF0',
      borderWidth: 2.5,
      borderRadius: 10,
      margin: '2%',
      padding: '7%',
      backgroundColor: scalesColors.DeepGreen,
    },

    containe2: {
      width: '95%',
      borderColor: '#E6EAF0',
      borderWidth: 2.5,
      borderRadius: 10,
      margin: '2%',
      padding: '7%',
      backgroundColor: scalesColors.Peach,
    },

    container3: {
      width: '95%',
      borderColor: '#E6EAF0',
      borderWidth: 2.5,
      borderRadius: 10,
      margin: '2%',
      padding: '7%',
      backgroundColor: scalesColors.BlueRacer,
    },

    buttonContainer: {
      position: 'absolute',
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-end',
      top: '2%',
      right: '2%',
    },

    promptContainer: {
      width: '100%',
      height: '100%',
      position:'absolute'
    },
    
    panelText: {
        fontSize: 20,
        color: '#000000',
        textAlign: 'center',
    },

    delete: {
      width: 30,
      height: 30,
      paddingTop: '5%',
    },

    share: {
      width: 30,
      height: 25,
    }
});

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      paddingTop: StatusBar.currentHeight * 70 / 100,
      paddingBottom: StatusBar.currentHeight * 70 / 100,
      backgroundColor: '#fff',    
    },
  
    safeAreaDark: {
      flex: 1,
      paddingTop: StatusBar.currentHeight * 30 / 100,
      paddingBottom: StatusBar.currentHeight * 70 / 100,
      backgroundColor: scalesColors.background,    
    },

    container: {
      flex: 1,
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      marginBottom: StatusBar.currentHeight * 30 / 100,
    },
  
    legend1: {
      width: '30%',
      borderRadius: 5,
      backgroundColor: scalesColors.BlueRacer,
      alignItems: 'center',
      justifyContent: 'center',
      height: 40
    },

    legend2: {
      width: '30%',
      borderRadius: 5,
      backgroundColor: scalesColors.DeepGreen,
      alignItems: 'center',
      justifyContent: 'center',
      height: 40
    },

    legend3: {
      width: '30%',
      borderRadius: 5,
      backgroundColor: scalesColors.Peach,
      alignItems: 'center',
      justifyContent: 'center',
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
  
    iconImage: {
      width: 40,
      height: 40
    },
  
    emptyText: {
      fontSize: 20,
      color: '#000000',
      textAlign: 'center',
    },
  
    emptyTextDark: {
      fontSize: 20,
      color: '#fff',
      textAlign: 'center',
    }
});

export { styles, entryStyles };