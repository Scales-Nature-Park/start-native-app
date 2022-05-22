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
    Dimensions,
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';

const scalesColors = require('../colors.json');
const dataFields = require('../fields.json');

// recursive function that display conditional fields of a field
// and their conditionals
const displayConditionals = (jsObj, displayField, fields, states) => {
    let state = states.filter((element) => element.name == jsObj.name)[0];
    if(!state) return;

    if (jsObj.conditionalFields) {
        for (let field of jsObj.conditionalFields) {
            if (state.value != field.condition) continue;

            displayField(field, fields);
            displayConditionals(field, displayField, fields, states);
        }
    }
}

const DataInput = ({ navigation }) => {
    let dateObj = new Date(),
        day = dateObj.getDate(), 
        month = dateObj.getMonth(),
        year = dateObj.getFullYear(),
        currHours = dateObj.getHours(),
        currMins = dateObj.getMinutes();
        
    const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novemeber', 'December'];
    const [currDay, setDay] = useState(day);
    const [currMonth, setMonth] = useState(months[month]);
    const [currYear, setYear] = useState(year);
    const [hours, setHours] = useState(currHours);
    const [mins, setMins] = useState(currMins);

    const [category, setCategory] = useState('Turtle');
    const [comment, setComment] = useState('');
    const [states, setStates] = useState([]);

    const displayField = (field, fields) => {
        if (field.name == 'date') {
            fields.push(
                <View style={styles.container1}>
                    <View style={styles.inputView}>
                        <TextInput
                        style={styles.TextInput}
                        placeholder={day.toString()}
                        placeholderTextColor='#000000'
                        onChangeText={(currDay) => setDay(currDay)}
                        />
                    </View>
    
                    <View style={styles.inputView}>
                        <ModalDropdown 
                        options={months}
                        showsVerticalScrollIndicator={true}
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
                        placeholder={year.toString()}
                        placeholderTextColor='#000000'
                        onChangeText={(currYear) => setYear(currYear)}
                        />
                    </View>
                </ View>
            );
            return;
        } else if (field.name == 'time') {
            fields.push(
                <View style={styles.container1}>
                    <Text style={styles.timeField}>Time: </Text>
                    <View style={styles.inputView}>
                        <TextInput
                        style={styles.TextInput}
                        placeholder={currHours.toString()}
                        placeholderTextColor='#000000'
                        onChangeText={(inHours) => {
                                if (inHours.trim() == '') setHours(currHours);
                                else setHours(inHours);
                            }
                        }
                        />
                    </View>
    
                    <Text style={styles.timeField}>:</Text>
    
                    <View style={styles.inputView}>
                        <TextInput
                        style={styles.TextInput}
                        placeholder={currMins.toString()}
                        placeholderTextColor='#000000'
                        onChangeText={(inMins) => {
                                if (inMins.trim() == '') setMins(currMins);
                                else setMins(inMins);
                            }
                        }
                        />
                    </View>
                </ View>
            );
            return;
        }
        
        if (field.dropDown) {
            fields.push(
                <View style={styles.container1}>
                    <Text style={styles.field}>{field.name}:</Text>
                    <View style={styles.fieldInput}>
                            <ModalDropdown 
                            options={field.values}
                            showsVerticalScrollIndicator={true}
                            textStyle={styles.dropText}
                            style={styles.dropButton}
                            dropdownTextStyle={styles.dropText}
                            dropdownStyle={styles.dropDown}
                            dropdownTextHighlightStyle={styles.dropText}
                            defaultValue={field.values[0]}
                            defaultIndex={0}
                            onSelect={(myVal) => {
                                let tempStates = states.slice();
                                let tempIndex = -1;
    
                                tempStates.forEach((curr, index) => {
                                    if (curr.name != field.name) return;
                                    curr.value = field.values[myVal];
                                    tempIndex = index;
                                });
                                console.log(tempStates);
                                
                                if(tempIndex == -1) tempStates.push({"name": field.name, "value": field.values[myVal]});
                                setStates(tempStates);
                            }}
                            />
                        </View>
                </ View>
            );
        } else {
            fields.push(
                <View style={styles.container1}>
                    <Text style={styles.field}>{field.name}:</Text>
                    <View style={styles.fieldInput}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder={'Enter ' + field.name}
                            placeholderTextColor='#000000'
                            onChangeText={(value) => {
                                let tempStates = states.slice();
                                let tempIndex = -1;

                                tempStates.forEach((curr, index) => {
                                    if (curr.name != field.name) return;
                                    curr.value = value;
                                    tempIndex = index;
                                });
                                
                                console.log(tempStates);
                                if(tempIndex == -1) tempStates.push({"name": field.name, "value": value});
                                setStates(tempStates);
                            }}
                        />
                    </View>
                </View>
            );
        }
    }
    
    let allIndex = -1, catIndex = -1;
    let categoryButtons = [];

    // get the indeces of the all category and the selected
    // categpry objects in dataFields
    dataFields.forEach((element, index) => {
        if (element.Category == "All") {
            allIndex = index;
        } else {
            if (element.Category == category) catIndex = index;
            categoryButtons.push(
                <TouchableOpacity style={(category == element.Category) ? styles.buttonView : styles.buttonView2}
                onPress= {() => setCategory(element.Category)}>
                    <Text style={(category == element.Category) ? {color: '#000000'} : {color: scalesColors.BlueRacer}}>{element.Category}</Text>
                </TouchableOpacity>
            );
        } 

    });

    let modfDataFields = [];
    if (allIndex == -1 && catIndex == -1) {
        alert("Invalid fields specified.");
        return (<View></View>);
    } 
    
    if (allIndex != -1) modfDataFields.push(dataFields[allIndex]);
    if (catIndex != -1) modfDataFields.push(dataFields[catIndex]);

    let fields = [];

    // loop through all the fields in the fields.json file
    // and display them with theire conditional fields
    for (let i = 0; i < modfDataFields.length; i++) {
        for (let field of modfDataFields[i].ConditionalFields) {
            displayField(field, fields);            

            // set a state for the fields in the sates list
            let state = states.filter((element) => element.name == field.name)[0];

            if (!state){
                state = {"name": field.name, "value": ''};
                if (field.dropDown) state.value = field.values[0];

                setStates([...states, state]);
            }

            if (!field.conditionalFields) continue;
            displayConditionals(field, displayField, fields, states);
        }
    }
    
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView>
                <ScrollView horizontal={true}>
                        {categoryButtons}
                </ScrollView>
                
                {fields}
                
                <View style={[styles.container1, {height: 150}]}>
                    <View style={styles.commentInput}>
                        <TextInput
                            multiline={true}
                            style={styles.commentBox}
                            placeholder={'Add Comments...'}
                            placeholderTextColor='#000000'
                            onChangeText={(value) => setComment(value)}
                        />
                    </View>
                </View>

                <View style={styles.container2}>
                    <TouchableOpacity style={styles.submitBtn}>
                        <Text style={styles.submitText}>SUBMIT</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
        color: scalesColors.BlueRacer,
        borderRadius: 10,
        backgroundColor: scalesColors.BlueRacer, 
        textAlign: 'center',
        width: '35%',
    },

    dropText: {
        alignContent: 'center',
        color: '#000',
        backgroundColor: scalesColors.BlueRacer,
        fontSize: 15,
    },

    container1: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-evenly',   
      flexDirection:'row',
      width: Dimensions.get('window').width,
      height: 50,
      marginTop: 20,
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
      marginTop: 40,
      backgroundColor: scalesColors.DeepGreen,
    },

    submitText: {
        color: '#000000',
    },

    timeField: {
        fontSize: 20,
        color: '#000000',
        marginBottom: 20,
        textAlign: 'left',
    },

    field: {
        fontSize: 16,
        color: '#000000',
        marginBottom: 20,
        textAlign: 'left',
        width: '30%',
    },

    fieldInput: {
        alignItems: 'center',
        width: '60%',
        backgroundColor: scalesColors.BlueRacer,
        borderRadius: 10,
        height: '100%',
        marginBottom: 20,
    },

    commentInput: {
        width: '90%',
        backgroundColor: scalesColors.BlueRacer,
        borderRadius: 10,
        height: '100%',
        marginBottom: 20,
    },
});

export default DataInput;