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
    Button,
} from 'react-native';
import Input from 'react-native-input-style';
import ModalDropdown from 'react-native-modal-dropdown';

const DataInput = () => {
    let dateObj = new Date(),
        day = dateObj.getDate(), 
        month = dateObj.getMonth(),
        year = dateObj.getFullYear(),
        currHours = dateObj.getHours(),
        currMins = dateObj.getMinutes();
        
    const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novemeber', 'December'];
    const [currDay, setDay] = useState(day);
    const [currMonth, setMonth] = useState(months[month]);
    const [open, setOpen] = useState(true);
    const [value, setValue] = useState('May');
    const [currYear, setYear] = useState(year);
    const [hours, setHours] = useState(currHours);
    const [mins, setMins] = useState(currMins);

    const [species, setSpecies] = useState('');
    const [category, setCategory] = useState('Turtle');
    const [conditon, setCondition] = useState('Alive');
    
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView>
                <View style={styles.container1}>
                    <TouchableOpacity style={(category == 'Turtle') ? styles.buttonView : styles.buttonView2}
                    onPress= {() => {
                        setCategory('Turtle');
                        console.log(category);
                    }}>
                        <Text style={(category == 'Turtle') ? {color: '#fff'} : {color: '#089c2f'}}>TURTLE</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={(category == 'Snake') ? styles.buttonView : styles.buttonView2}
                    onPress= {() => {
                        setCategory('Snake');
                        console.log(category);
                    }}>
                        <Text style={(category == 'Snake') ? {color: '#fff'} : {color: '#089c2f'}}>SNAKE</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style= {(category == 'Lizard') ? styles.buttonView : styles.buttonView2}
                    onPress= {() => {
                        setCategory('Lizard');
                        console.log(category);
                    }}>
                        <Text style={(category == 'Lizard') ? {color: '#fff'} : {color: '#089c2f'}}>LIZARD</Text>
                    </TouchableOpacity>
                </ View>

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
                            onSelect={(selectedMonth) => setMonth(months[selectedMonth])}
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

                <View style={styles.container1}>
                    <Text style={styles.field}>Time: </Text>
                    <View style={styles.inputView}>
                        <TextInput
                        style={styles.TextInput}
                        placeholder={hours.toString()}
                        placeholderTextColor='#000000'
                        onChangeText={(currDay) => setDay(currDay)}
                        />
                    </View>

                    <Text style={styles.field}>:</Text>

                    <View style={styles.inputView}>
                        <TextInput
                        style={styles.TextInput}
                        placeholder={mins.toString()}
                        placeholderTextColor='#000000'
                        onChangeText={(currYear) => setYear(currYear)}
                        />
                    </View>
                </ View>
                
                <View style={styles.container1}>
                    <Text style={styles.field}>Conditon:</Text>
                    <View style={styles.fieldInput}>
                            <ModalDropdown 
                            options={['Alive', 'Injured', 'Dead']}
                            showsVerticalScrollIndicator={true}
                            textStyle={styles.dropText}
                            style={styles.dropButton}
                            dropdownTextStyle={styles.dropText}
                            dropdownStyle={styles.dropDown}
                            dropdownTextHighlightStyle={styles.dropText}
                            defaultValue={conditon}
                            defaultIndex={0}
                            onSelect={(conditon) => setCondition(conditon)}
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
        width: '35%',
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

    buttonView: {
        width: '28%',
        borderRadius: 10,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        backgroundColor: '#089c2f',
    },
   
    buttonView2: {
        width: '28%',
        borderRadius: 10,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        backgroundColor: '#fff',
        borderColor: '#089c2f',
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

    field: {
        fontSize: 22,
        color: '#000000',
        marginBottom: 20,
        textAlign: 'left',
    },

    fieldInput: {
        alignItems: 'right',
        width: '70%',
        backgroundColor: '#79f79b',
        borderRadius: 10,
        height: '100%',
        marginBottom: 20,
        alignItems: 'center',
    }
});

export default DataInput;