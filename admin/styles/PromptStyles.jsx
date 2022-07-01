import { StyleSheet } from 'react-native';

const scalesColors = require('../utils/colors.json');

const styles = StyleSheet.create({
    promptContainer: {
        position: 'absolute',
        width: '40%',
        minWidth: 400,
        height: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonContainer: {
        flexDirection: 'row',
        width: '70%',
        padding: '2%',
        height: '7%',
        maxHeight: 150,
        justifyContent: 'space-evenly',
        backgroundColor: '#242323',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },

    button: {
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        borderRadius: 5,
        height: '90%'
    },

    promptText: {
        textAlign: 'left',
        alignSelf: 'flex-start',
        marginBottom: 10
    },

    promptContent: {
        width: '70%',
        padding: '2%',
        borderRadius: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        backgroundColor: '#383737',
    } 
});

export default styles;