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

    searchResults: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    },
  
    emptyText: {
      fontSize: 20,
      color: '#000000',
      textAlign: 'center',
      fontFamily: 'Gotham-Font',
    },
    
    container: {
        flex: 1,
        alignItems: "center",
        width: '100%',
        justifyContent: "center",
    },

    entryLine: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',   
        flexDirection:'row',
        width: Dimensions.get('window').width,
        height: 50,
        marginTop: 20,
    },

    addCriteria: {
        width: "95%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: scalesColors.BlueRacer,
    },

    search: {
        width: "95%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: scalesColors.DeepGreen,
    },

    buttonView: {
        width: Dimensions.get('window').width * 0.28,
        marginRight: Dimensions.get('window').width * 0.03,
        marginLeft: Dimensions.get('window').width * 0.025,
        borderRadius: 10,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        backgroundColor: scalesColors.BlueRacer,
    },
   
    buttonView2: {
        width: Dimensions.get('window').width * 0.28,
        marginRight: Dimensions.get('window').width * 0.025,
        marginLeft: Dimensions.get('window').width * 0.025,
        borderRadius: 10,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        backgroundColor: '#fff',
        borderColor: scalesColors.BlueRacer,
        borderWidth: 1.5,
    },

    dropButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        textAlign: 'center',
        width: '95%',
        height: 50,
        marginTop: 20,
        backgroundColor: scalesColors.BlueRacer,
    },

    dropDown: {
        alignItems: 'center',
        justifyContent: 'center',
        color: scalesColors.BlueRacer,
        borderRadius: 10,
        backgroundColor: scalesColors.BlueRacer, 
        textAlign: 'center',
        width: '35%'
    },

    dropText: {
        alignContent: 'center',
        color: '#000',
        backgroundColor: scalesColors.BlueRacer,
        fontSize: 15,
        width: '100%',
        fontFamily: 'Gotham-Font',
        textAlign: 'center',
    },

    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        color:'#000000',
        width: '100%',
        textAlign: 'center',
    },

    field: {
        fontSize: 16,
        color: '#000000',
        marginBottom: 20,
        textAlign: 'left',
    },

    fieldDark: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 20,
        textAlign: 'left',
    },

    fieldInput: {
        alignItems: 'center',
        width: '50%',
        height: '100%',
        backgroundColor: scalesColors.BlueRacer,
        borderRadius: 10,
        marginBottom: 20,
    },
});

export default styles;