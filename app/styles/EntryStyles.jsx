import { StatusBar, StyleSheet, Dimensions } from "react-native";

const scalesColors = require('../utils/colors.json');

const entryStyles = StyleSheet.create({
    container: {
        width: '95%',
        backgroundColor: '#fff',
        borderColor: '#E6EAF0',
        borderWidth: 2.5,
        borderRadius: 10,
        margin: '2%',
        padding: '7%',
        backgroundColor: scalesColors.DeepGreen,
    },
    
    panelText: {
        fontSize: 20,
        color: '#000000',
        textAlign: 'center',
    },

    delete: {
      position: 'absolute',
      width: 30,
      height: 30,
      alignItems: 'flex-end',
      right: '4%',
      top: '4%',
      alignSelf: 'flex-end',
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
      backgroundColor: scalesColors.background,    
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