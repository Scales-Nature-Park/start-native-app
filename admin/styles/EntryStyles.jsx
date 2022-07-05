import { StatusBar, StyleSheet, Dimensions } from "react-native";

const scalesColors = require('../utils/colors.json');

const entryStyles = StyleSheet.create({
    container: {
        width: '95%',
        borderColor: '#E6EAF0',
        borderWidth: 2.5,
        borderRadius: 10,
        marginLeft: '2.5%',
        marginTop: 10,
        padding: '7%',
        backgroundColor: scalesColors.DeepGreen,
    },
    
    panelText: {
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
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
      paddingTop: StatusBar.currentHeight * 70 / 100,
      paddingBottom: StatusBar.currentHeight * 70 / 100,
      backgroundColor: '#121212',    
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