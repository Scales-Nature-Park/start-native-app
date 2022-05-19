import React, { useState } from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';

const DataInput = () => {
    let dateObj = new Date(),
        day = dateObj.getDate(), 
        month = dateObj.getMonth(),
        year = dateObj.getFullYear();
        
    const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novemeber', 'December'];
    const [currDay, setDay] = useState(day);
    const [currMonth, setMonth] = useState(months[month]);
    const [currYear, setYear] = useState(year);
    const [species, setSpecies] = useState('');
    
    const [open, setOpen] = useState(true);
    const [value, setValue] = useState('May');
    

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView>
                <View style={styles.container1}>
                        <View style={styles.inputView}>
                            <TextInput
                            style={styles.TextInput}
                            placeholder={currDay.toString()}
                            placeholderTextColor='#000000'
                            onChangeText={(currDay) => setDay(currDay)}
                            />
                        </View>

                        <View style={styles.inputView}>
                            <ModalDropdown 
                            options={months}
                            showsVe rticalScrollIndicator={true}
                            textStyle={styles.dropText}
                            style={styles.dropButton}
                            dropdownTextStyle={styles.dropText}
                            dropdownStyle={styles.dropDown}
                            dropdownTextHighlightStyle={styles.dropText}
                            defaultValue={currMonth}
                            defaultIndex={month}
                            onSelect={(selectedMonth) => setMonth(selectedMonth)}
                            />
                        </View>

                        <View style={styles.inputView}>
                            <TextInput
                            style={styles.TextInput}
                            placeholder={currYear.toString()}
                            placeholderTextColor='#000000'
                            onChangeText={(currYear) => setYear(currYear)}
                            />
                        </View>
                </ View>
            </ScrollView>

                <View style={styles.container2}>
                    <TouchableOpacity style={styles.submitBtn}>
                        <Text style={styles.submitText}>SUBMIT</Text>
                    </TouchableOpacity>
                </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: StatusBar.currentHeight * 70 / 100,
        paddingBottom: StatusBar.currentHeight * 70 / 100,
        backgroundColor: '#fff',    
    },

    dropButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        textAlign: 'center',
        height: '100%', 
        width: '100%',
    },

    dropDown: {
        alignItems: 'center',
        justifyContent: 'center',
        color: "#79f79b",
        borderRadius: 10,
        backgroundColor: '#79f79b', 
        textAlign: 'center',
        width: '30%',
    },

    dropText: {
        alignContent: 'center',
        color: '#000',
        backgroundColor: '#79f79b',
    },

    container1: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      flexDirection:'row',
    },

    container2: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
   
    image: {
      marginBottom: 40,
    },
   
    inputView: {
      backgroundColor: '#79f79b',
      borderRadius: 10,
      width: '28%',
      height: 45,
      marginBottom: 20,
      alignItems: 'center',
    },
   
    TextInput: {
      height: 50,
      flex: 1,
      padding: 10,
      color:'#000000',
    },
   
    forgot_button: {
      height: 30,
      marginBottom: 30,
      color: '#000000 ',
    },
   
    submitBtn: {
      width: '90%',
      borderRadius: 25,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 40,
      backgroundColor: '#089c2f',
    },

    submitText: {
        color: '#000000',
    },
});

export default DataInput;