import { StyleSheet } from "react-native";

const scalesColors = require('../utils/colors.json');

const categoryStyles = StyleSheet.create({
    container: {
        width: '95%',
        height: 120,
        maxHeight: 120,
        flexDirection: 'row',
        borderWidth: 2.5,
        justifyContent: 'space-evenly',
        borderRadius: 10,
        marginLeft: '2.5%',
        marginTop: 10,
        padding: '7%',
        backgroundColor: scalesColors.DeepGreen,
    },

    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '40%',
    },
    
    editButton: {
        height: '100%',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: '25%',
        backgroundColor: scalesColors.secondaryBackground,
    },

    deleteButton: {
        height: '100%',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: '25%',
        backgroundColor: '#850d23',
    },
    
    buttonText: {
        textAlign: 'center',
    },

    text: {
        color: '#000',
        textAlign: 'center',
        fontSize: 20,
    }
});

const styles = StyleSheet.create({
    emptyTextDark: {
      fontSize: 20,
      color: '#fff',
      textAlign: 'center',
    }
});

export { styles, categoryStyles };