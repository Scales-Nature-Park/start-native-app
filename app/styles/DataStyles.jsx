import { StatusBar, StyleSheet, Dimensions } from "react-native";

const scalesColors = require('../utils/colors.json');

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: StatusBar.currentHeight * 35 / 100,
        paddingBottom: StatusBar.currentHeight * 70 / 100,
        backgroundColor: '#fff',    
    },

    safeAreaDark: {
        flex: 1,
        paddingTop: StatusBar.currentHeight * 35 / 100,
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

    dropButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        textAlign: 'center',
        height: '100%', 
        width: '100%',
    },

    dropButton2: {
        width: '100%',
        backgroundColor: scalesColors.BlueRacer,
        borderRadius: 10,
        color: 'red',
        height: '100%',
    },

    dropDown: {
        alignItems: 'center',
        justifyContent: 'center',
        color: scalesColors.BlueRacer,
        borderRadius: 10,
        backgroundColor: scalesColors.BlueRacer, 
        textAlign: 'center',
        width: '35%',
    },

    dropDown2: {
        borderRadius: 10,
        backgroundColor: scalesColors.BlueRacer, 
        textAlign: 'center',
    },

    dropButton3: {
        width: '50%',
        borderRadius: 10,
        height: '100%',
        marginBottom: 20,
    },

    dropText: {
        alignContent: 'center',
        color: '#000',
        backgroundColor: scalesColors.BlueRacer,
        fontSize: 16,
    },

    dropListText: {
        alignContent: 'center',
        color: '#000',
        backgroundColor: scalesColors.BlueRacer,
        fontSize: 16,
        padding: 15
    },

    container1: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-evenly',   
      flexDirection:'row',
      width: Dimensions.get('window').width,
      height: 50,
      marginTop: 20,
    },

    container2: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
   
    image: {
        position: 'absolute',
        width: '100%',
        height: 200,
        borderRadius: 10,
    },

    deleteImage: {
        position: 'absolute',
        borderRadius: 10,
        width: 25,
        height: 25,
        alignItems: 'flex-end',
        right: '2%',
        top: '7%',
        alignSelf: 'flex-end',
    },

    deleteImageSingle: {
        position: 'absolute',
        borderRadius: 10,
        width: 25,
        height: 25,
        alignItems: 'flex-end',
        right: '4%',
        top: '4%',
        alignSelf: 'flex-end',
    },

    imageSingle: {
        position: 'relative',
        width: '95%',
        height: 200,
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
        color: scalesColors.background,
    },

    imageSelectText: {
        color: scalesColors.background,
        fontWeight: 'bold',
        marginTop: '2%',
    },

    uploadIcon: {
        marginTop: '3%'
    },

    timeField: {
        fontSize: 20,
        color: '#000000',
        marginBottom: 20,
        textAlign: 'left',
    },

    timeFieldDark: {
        fontSize: 20,
        color: '#fff',
        marginBottom: 20,
        textAlign: 'left',
    },

    field: {
        fontSize: 16,
        color: '#000000',
        textAlign: 'left',
        position: 'absolute'
    },

    fieldDark: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'left',
        position: 'absolute'
    },

    fieldContainer: {
        width: '45%',
        height: '100%',
        justifyContent: 'flex-start',
        marginBottom: '4%',
    },

    fieldInput: {
        alignItems: 'center',
        width: '50%',
        backgroundColor: scalesColors.BlueRacer,
        borderRadius: 10,
        height: '100%',
        marginBottom: 20,
    },

    selectImage: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '95%',
        backgroundColor: scalesColors.BlueRacer,
        borderRadius: 10,
        height: 180,
    },

    selectImageButton: {
        width: '100%',
        height: '100%',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center'
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