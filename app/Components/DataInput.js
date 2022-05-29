import React, { useState, useEffect } from 'react';
import axios from 'axios';
import storage, { url } from '../utils/Storage';
import { launchImageLibrary } from 'react-native-image-picker';
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
    Alert,
    Image,
    Button,
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

const DataInput = ({route, navigation}) => {
    const id = route.params.id;
    const paramData = route.params.data;

    const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novemeber', 'December'];
    const dateObj = new Date(),
        day = (paramData && paramData.day) ? paramData.day : dateObj.getDate(), 
        month = (paramData && paramData.month) ? paramData.month : months[dateObj.getMonth()],
        year = (paramData && paramData.year) ? paramData.year : dateObj.getFullYear(),
        currHours = (paramData && paramData.hours) ? paramData.hours : dateObj.getHours(),
        currMins = (paramData && paramData.mins) ? paramData.mins : dateObj.getMinutes();

    const initialFields = (paramData && paramData.inputFields) ? [...paramData.inputFields] : []; 
        
    const [currDay, setDay] = useState(day);
    const [currMonth, setMonth] = useState(month);
    const [currYear, setYear] = useState(year);
    const [hours, setHours] = useState(currHours);
    const [mins, setMins] = useState(currMins);

    const [category, setCategory] = useState((paramData && paramData.category) ? paramData.category : 'Turtle');
    const [comment, setComment] = useState((paramData && paramData.comment) ? paramData.comment : '');
    const [states, setStates] = useState(initialFields);
    const [valid, setValid] = useState(false);
    const [photo, setPhoto] = useState(null);

    useEffect(() => {
        let validStates = true;
        states.forEach((state) => {
            if (!state.dataValidation) return;

            let validateData = new Function(state.dataValidation.arguments, state.dataValidation.body);
            let response = validateData(Number(state.value));

            console.log(state.dataValidation);
            console.log(' : ' + response);
            console.log(state.value);
            
            // 1 wrong field will cause valid states to be false
            if (!response)  validStates = false;
        });

        setValid(validStates)
    });

    const ChoosePhoto = () => {
        launchImageLibrary({ noData: true }, (response) => {
            if (response && !response.didCancel) setPhoto(response.assets[0]);
        });
    };

    const createFormData = (photo, body = {}) => {
        const data = new FormData();
      
        data.append('photo', {
          name: photo.fileName,
          type: photo.type,
          uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
        });
      
        Object.keys(body).forEach((key) => {
          data.append(key, body[key]);
        });

        return data;
    };

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
                        defaultValue={month}
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
        } else if (field.image) {
            fields.push(
                <View style={styles.container1}>
                    <View style={{width: '45%'}}>
                        <Text style={styles.field}>{field.name}:</Text>
                    </View>
                    <View style={styles.fieldInput}>
                        {photo && (
                            <>
                                <TouchableOpacity style={styles.buttonView}
                                onPress= {ChoosePhoto}>
                                    <Text style={{color: '#000000'}}>{photo.uri}</Text>
                                </TouchableOpacity>
                            </>
                        )}

                        {!photo && (
                            <>
                                <TouchableOpacity style={styles.buttonView}
                                onPress= {ChoosePhoto}>
                                    <Text style={{color: '#000000'}}>Select Image</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            );
            
            return;
        }
        
        if (field.dropDown) {
            fields.push(
                <View style={styles.container1}>
                    <View style={{width: '45%'}}>
                        <Text style={styles.field}>{field.name}:</Text>
                    </View>
                    <View style={styles.fieldInput}>
                            <ModalDropdown 
                            options={field.values}
                            showsVerticalScrollIndicator={true}
                            textStyle={styles.dropText}
                            style={styles.dropButton}
                            dropdownTextStyle={styles.dropText}
                            dropdownStyle={styles.dropDown}
                            dropdownTextHighlightStyle={styles.dropText}
                            defaultValue={(paramData && paramData.inputFields.filter((element) => element.name == field.name)[0]) ? paramData.inputFields.filter((element) => element.name == field.name)[0].value : field.values[0]}
                            onSelect={(myVal) => {
                                let tempStates = states.slice();
                                let tempIndex = -1;
    
                                tempStates.forEach((curr, index) => {
                                    if (curr.name != field.name) return;
                                    curr.value = field.values[myVal];
                                    tempIndex = index;
                                });
                                
                                if(tempIndex == -1) tempStates.push(
                                    {"name": field.name, "value": field.values[myVal], "dataValidation": field.dataValidation}
                                );
                                setStates(tempStates);
                            }}
                            />
                        </View>
                </ View>
            );
        } else {
            fields.push(
                <View style={styles.container1}>
                    <View style={{width: '45%'}}>
                        <Text style={styles.field}>{field.name}:</Text>
                    </View>
                    <View style={styles.fieldInput}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder={(paramData && paramData.inputFields.filter((element) => element.name == field.name)[0]) ? paramData.inputFields.filter((element) => element.name == field.name)[0].value : 'Enter ' + field.name}
                            value={(states.filter((element) => element.name == field.name)[0]) ? states.filter((element) => element.name == field.name)[0].value : ''}
                            placeholderTextColor='#000000'
                            onChangeText={(value) => {
                                let tempStates = states.slice();
                                let tempIndex = -1;

                                tempStates.forEach((curr, index) => {
                                    if (curr.name != field.name) return;
                                    curr.value = value;
                                    tempIndex = index;
                                });
                                
                                if(tempIndex == -1) tempStates.push(
                                    {"name": field.name, "value": value, "dataValidation": field.dataValidation}
                                    );
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
            if (field.name.toLowerCase() == 'date' || field.name.toLowerCase() == 'time') continue;  

            // set a state for the fields in the sates list
            let state = states.filter((element) => element.name == field.name)[0];

            if (!state) {
                state = {"name": field.name, "value": '', "dataValidation": field.dataValidation};
                if (field.dropDown) state.value = field.values[0];

                setStates([...states, state]);
            }
            
            if (field.conditionalFields) displayConditionals(field, displayField, fields, states);
        }
    }
    
    let buttons = [];

    // render submit button only in online mode, cuz we cant
    // connect to the server offline
    if (!route.params.offlineMode) {
        buttons.push(
            <TouchableOpacity style={styles.submitBtn}
            onPress={() => {
                // get the data validation value before proceedoing
                // if its false return with an alert
                if (!valid){
                    Alert.alert('ERROR', 'Invalid data.');
                    return;
                }
                let imageForm = createFormData(photo, {})._parts[0][1];

                axios({
                    method: 'post',
                    url: url + '/dataEntry',
                    // data: imageForm
                    params: {
                        "id": id,
                        "day": currDay,
                        "month": currMonth,
                        "year": currYear,
                        "hours": hours,
                        "mins": mins,
                        "category": category,
                        "inputFields": states,
                        "comment": comment
                    }
                }).then((response) => {
                    Alert.alert(
                        'Successful Data Entry', 
                        'Your data has been submitted. Return to Home.',
                        [
                            {text: "OK", onPress: () => {
                                navigation.navigate('Home', route);
                            }}
                        ],
                        {cancelable: false}
                    );
                }).catch(function (error) {
                    Alert.alert('ERROR', error.response.data);
                    return;
                });
            }}>
                <Text style={styles.submitText}>SUBMIT</Text>
            </TouchableOpacity>
        );
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
                    <TouchableOpacity style={styles.quickSave}
                    onPress={() => {                
                        SaveDataEntry(
                            {
                                "id": id,
                                "day": currDay,
                                "month": currMonth,
                                "year": currYear,
                                "hours": hours,
                                "mins": mins,
                                "category": category,
                                "inputFields": states,
                                "comment": comment
                            }
                        );

                        storage.load({
                            key: 'entries',
                        }).catch((err) => {
                            Alert.alert("ERROR", err.message);
                            navigation.navigate('Login');
                        });
                    }}>
                        <Text style={styles.submitText}>QUICK SAVE</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.save}
                    onPress={() => {
                        // get the data validation value before proceedoing
                        // if its false return with an alert
                        if (!valid){
                            Alert.alert('ERROR', 'Invalid data.');
                            return;
                        }

                        SaveDataEntry(
                            {
                                "id": id,
                                "day": currDay,
                                "month": currMonth,
                                "year": currYear,
                                "hours": hours,
                                "mins": mins,
                                "category": category,
                                "inputFields": states,
                                "comment": comment
                            }
                        );
                    }}>
                        <Text style={styles.submitText}>SAVE</Text>
                    </TouchableOpacity>

                    {buttons}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const SaveDataEntry = (dataObj) => {
    // try loading the entries local storage
    storage.load({
        key: 'entries'
    }).then((retEntries) => {
        // append this entry to stored entries
        let updatedEntries = [...retEntries.fields];
        updatedEntries.push(dataObj); 

        storage.save({
            key: 'entries',
            data: {
                fields: [...updatedEntries]
            }
        });
    }).catch((err) => {
        console.log(err.message);
        // store the entry into entries as the only element
        storage.save({
            key: 'entries',
            data: {
                fields: [dataObj]
            }
        });
    });
}

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
    },

    fieldInput: {
        alignItems: 'center',
        width: '50%',
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