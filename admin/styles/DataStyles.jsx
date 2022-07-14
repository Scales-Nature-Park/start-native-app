import { StatusBar, StyleSheet, Dimensions } from "react-native";

const scalesColors = require('../utils/colors.json');

const styles = StyleSheet.create({
    safeAreaDark: {
        flex: 1,
        paddingTop: StatusBar.currentHeight * 35 / 100,
        paddingBottom: StatusBar.currentHeight * 70 / 100,
        backgroundColor: scalesColors.background,
    },

    iconImage: {
        width: 40,
        height: 40
    },

    container1: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-evenly',   
      flexDirection:'row',
      width: '100%',
      height: 50,
      marginTop: 20,
    },

    container2: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
   
    imageSingle: {
        position: 'relative',
        width: '100%',
        height: 500,
        alignSelf: 'center',
        borderRadius: 10,
    },
   
    inputView: {
      backgroundColor: scalesColors.BlueRacer,
      borderRadius: 10,
      width: '28%',
      height: 45,
      marginBottom: 20,
      alignItems: 'center',
    },

    mainView: {
        width: '70%',
        marginVertical: 20,
        alignSelf: 'center'
    },

    sideButtons: {
        position: 'absolute',
        width: '15%',
        alignItems: 'center',
        marginTop: 20,
    },

    dash: {
        width: '70%',
        alignItems:'center',
        justifyContent: 'center',
        height: 45,
        borderRadius: 10,
        backgroundColor: '#0b4c7d',
    },

    buttonView: {
        width: Dimensions.get('window').width * 0.7 * 0.28,
        marginRight: Dimensions.get('window').width * 0.7 * 0.03,
        marginLeft: Dimensions.get('window').width * 0.7 * 0.025,
        borderRadius: 10,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        backgroundColor: scalesColors.BlueRacer,
    },
   
    buttonView2: {
        width: Dimensions.get('window').width * 0.7 * 0.28,
        marginRight: Dimensions.get('window').width * 0.7 * 0.028,
        marginLeft: Dimensions.get('window').width * 0.7 * 0.025,
        borderRadius: 10,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        backgroundColor: '#fff',
        borderColor: scalesColors.BlueRacer,
        borderWidth: 1.5,
    },

    TextInput: {
      height: 50,
      flex: 1,
      padding: 10,
      color:'#000000',
      width: '100%',
      textAlign: 'center',
    },

    commentBox: {
        height: 150,
        flex: 1,
        padding: 10,
        color:'#000000',
        width: '100%',
        height: '100%',
        textAlign: 'left',
    },
   
    submitBtn: {
      width: '90%',
      borderRadius: 25,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 30,
      backgroundColor: scalesColors.DeepGreen,
    },

    deleteBtn: {
        width: '90%',
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        backgroundColor: '#850d23',
      },

    save: {
        width: '90%',
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        backgroundColor: scalesColors.blandingsTurtle1,
    },

    quickSave: {
        width: '90%',
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        backgroundColor: scalesColors.Peach,
    },

    addImage: {
        width: '95%',
        borderRadius: 10,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        backgroundColor: scalesColors.Peach,
    },

    submitText: {
        color: '#000000',
    },

    timeFieldDark: {
        fontSize: 20,
        color: '#fff',
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
        backgroundColor: scalesColors.BlueRacer,
        borderRadius: 10,
        height: '100%',
        marginBottom: 20,
    },

    progress: {
        marginTop: 20,
    },

    commentInput: {
        width: '90%',
        backgroundColor: scalesColors.BlueRacer,
        borderRadius: 10,
        height: '100%',
        marginBottom: 20,
    },
});

export default styles;