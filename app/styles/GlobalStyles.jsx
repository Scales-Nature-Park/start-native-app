import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    toastContainer: {
        maxWidth: '85%',
        paddingVertical: 10,
        backgroundColor: 'green',
        marginVertical: 4,
        borderRadius: 8,
        justifyContent: 'center',
        paddingHorizontal: 16,
        flexDirection: 'row',
    }, 

    toastButton: {
        marginLeft: "auto",
        width: 30,
        height: 30,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },

    text: { 
        color: '#fff', 
        marginRight: 16 
    },
});

export default styles;