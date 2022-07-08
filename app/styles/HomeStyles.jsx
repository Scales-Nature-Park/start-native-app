import { StatusBar, StyleSheet, Dimensions } from "react-native";

const scalesColors = require('../utils/colors.json');

const styles = StyleSheet.create({
    buttonView: {
        width: '100%',
        borderRadius: 10,
        height: '20%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        backgroundColor: scalesColors.DeepGreen,
    },

    iconImage: {
        width: 40,
        height: 40
    },

    buttonText: {
        fontSize: 20,
        color: '#000000',
        textAlign: 'center',
    },

    safeArea: {
        flex: 1,
        padding: StatusBar.currentHeight * 70 / 100,
        backgroundColor: '#fff',    
    },

    safeAreaDark: {
        flex: 1,
        padding: StatusBar.currentHeight * 70 / 100,
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

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',   
        flexDirection:'column',
        width: '100%',
        height: 50,
        marginTop: 20,
    },

    containerDark: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',   
        flexDirection:'column',
        width: '100%',
        height: 50,
        marginTop: 20,
    },
});

export default styles;