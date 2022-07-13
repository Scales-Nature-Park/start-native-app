import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/DataStyles';
import Feather from 'react-native-vector-icons/Feather';
import * as Progress from 'react-native-progress';
import { url } from '../utils/SyncState';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Alert,
    Image,
} from 'react-native';
import { useNetInfo } from "@react-native-community/netinfo";

Feather.loadFont();
const scalesColors = require('../utils/colors.json');

// recursive function that display conditional fields of a field
// and their conditionals
const displayConditionals = (jsObj, displayField, fields, states) => {
    let state = states.filter((element) => element.name.toLowerCase() == jsObj.name.toLowerCase())[0];
    if(!state) return;

    if (jsObj.conditionalFields) {
        for (let field of jsObj.conditionalFields) {
            if (state.value != field.condition) continue;

            displayField(field, fields);
            displayConditionals(field, displayField, fields, states);
        }
    }
}

const FetchFields = (setFields) => {
    axios({
        method: 'get',
        url: url + '/fields'
    }).then(response => {
        setFields(response.data);
    }).catch(error => {});
};

const DataInput = ({ params, setScreen }) => {
    const id = (params?.id) ? params?.id : '';

    const day = (params && params?.day) ? params?.day : '', 
        month = (params && params?.month) ? params?.month : '',
        year = (params && params?.year) ? params?.year : '',
        currHours = (params && params?.hours) ? params?.hours : '',
        currMins = (params && params?.mins) ? params?.mins : '';

    const initialFields = (params && params?.inputFields) ? [...params?.inputFields] : []; 
        
    const [currDay, setDay] = useState('0'.repeat(2 - day.toString().length) + day);
    const [currMonth, setMonth] = useState(month);
    const [currYear, setYear] = useState(year);
    const [hours, setHours] = useState('0'.repeat(2 - currHours.toString().length) + currHours);
    const [mins, setMins] = useState('0'.repeat(2 - currMins.toString().length) + currMins);

    const [category, setCategory] = useState((params && params?.category) ? params?.category : 'Turtle');
    const [comment, setComment] = useState((params && params?.comment) ? params?.comment : '');
    const [states, setStates] = useState(initialFields);
    const [valid, setValid] = useState(false);
    const [photos, setPhotos] = useState((params && params?.photos) ? [...params?.photos] : null);
    const [dataFields, setFields] = useState(require('../utils/fields.json'));
    const [progress, setProgress] = useState({display: false, progress: 0});
    const netInfo = useNetInfo();
    
    // append image uris to photos from existing photoids passed in params
    let validityError = '';
    let photoIds = (params?.photoIds) ? [...params.photoIds] : undefined;
    if (photoIds && photoIds.length > 0 && !photos) {
        let tempPhotos = [];
        for (let id of photoIds) (!tempPhotos.includes({uri: url + '/image/' + id})) ? tempPhotos.push({uri: url + '/image/' + id}) : null;
        setPhotos(tempPhotos);
    } 
    
    if (!dataFields) FetchFields(setFields);

    useEffect(() => {
        let validStates = true;

        // validate all the states with their dataValidation functions
        states.forEach((state) => {
            if (!state.dataValidation || !state.dataValidation.arguments) return;
            
            // validate the data after states are set
            let validateData = new Function(state.dataValidation.arguments, state.dataValidation.body);
            let value = (state.dataValidation.isNumber && state.value.toString().trim() != '') ? Number(state.value) : state.value;
            let response = validateData(value);
            
            // 1 wrong field will cause valid states to be false
            if (!response) {
                validStates = false;
                validityError = (state.dataValidation.error) ? state.dataValidation.error : validityError;
            }
        });

        // validate date and time
        if (currDay.toString().length !== 2 || isNaN(currDay)) {
            validStates = false;
            validityError = 'Day needs to be a number in DD format.';
        } else if (currYear.toString().length !== 4 || isNaN(currYear)) {
            validStates = false;
            validityError = 'Year needs to be a number in YYYY format.';
        } else if (hours.toString().length !== 2 || isNaN(hours)) {
            validStates = false;
            validityError = 'Hours need to be a number in HH 24 hour format.';
        } else if (mins.toString().length !== 2 || isNaN(mins)) {
            validStates = false;
            validityError = 'Minutes need to be a number in MM format.';
        }
        
        setValid(validStates);
    });

    const SubmitData = async (entryId = undefined) => {
        // validate network connection
        if (!netInfo.isConnected) {
            Alert.alert('Network Error', 'It seems that you are not connected to the internet. Please check your connection and try again later.');
            return;
        }
        
        try {
            // upload the data entry to the database 
            await axios({
                method: 'post',
                url: url + '/dataEntry',
                params: {
                    "id": id,
                    photoIds,
                    "day": currDay,
                    "month": currMonth,
                    "year": currYear,
                    "hours": hours,
                    "mins": mins,
                    "category": category,
                    "inputFields": states,
                    "comment": comment
                }
            });

            // delete the old entry 
            await axios({
                method: 'delete',
                url: url + '/entry/' + entryId
            });

            Alert.alert(
                'Successful Data Entry', 
                'Data Entry has been updated. Return to Dashboard.',
                [
                    {text: "OK", onPress: () => {
                        setScreen({val: 'Dashboard', params: {username: params.username}})
                    }}
                ],
                {cancelable: false}
            );
            
        } catch(err) {
            setProgress({progress: 0, display: false});
            Alert.alert('ERROR', err?.response?.data || error?.message);
            return;
        }
    }

    const DeleteEntry = (entryId) => {
        axios({
            method: 'delete',
            url: url + '/entry/' + entryId
        }).then((response) => {
            Alert.alert('Entry Deleted', response.data, [{
                text: 'Ok',
                onPress: () => {
                    setScreen({val: 'Dashboard', params: {username: params.username}})
                }
            }]);

        }).catch(err => {
            Alert.alert('ERROR', err?.response?.data || err?.message);
        });
    };

    const displayField = (field, fields) => {
        if (field.name.toLowerCase() == 'date') {
            fields.push(
                <View style={styles.container1}>
                    <View style={styles.inputView}>
                        <TextInput
                        style={styles.TextInput}
                        defaultValue={day.toString()}
                        placeholder={'DD'}
                        placeholderTextColor='#000000'
                        onChangeText={(currDay) => setDay(currDay)}
                        />
                    </View>
    
                    <View style={styles.inputView}>
                        <TextInput
                        style={styles.TextInput}
                        defaultValue={month.toString()}
                        placeholder={'Month'}
                        placeholderTextColor='#000000'
                        onChangeText={(currMonth) => setMonth(currMonth)}
                        />
                    </View>
    
                    <View style={styles.inputView}>
                        <TextInput
                        style={styles.TextInput}
                        defaultValue={year.toString()}
                        placeholder={'YYYY'}
                        placeholderTextColor='#000000'
                        onChangeText={(currYear) => setYear(currYear)}
                        />
                    </View>
                </ View>
            );
            return;
        } else if (field.name.toLowerCase() == 'time') {
            fields.push(
                <View style={styles.container1}>
                    <Text style={styles.timeFieldDark}>Time: </Text>
                    <View style={styles.inputView}>
                        <TextInput
                        style={styles.TextInput}
                        placeholder={'HH'}
                        defaultValue={hours.toString()}
                        placeholderTextColor='#000000'
                        onChangeText={(inHours) => {
                                if (inHours.trim() == '') setHours(currHours);
                                else setHours(inHours);
                            }
                        }
                        />
                    </View>
    
                    <Text style={styles.timeFieldDark}>:</Text>
    
                    <View style={styles.inputView}>
                        <TextInput
                        style={styles.TextInput}
                        defaultValue={mins.toString()}
                        placeholder={'MM'}
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
        
        fields.push(
            <View style={styles.container1}>
                <View style={{width: '45%'}}>
                    <Text style={styles.fieldDark}>{field.name}:</Text>
                </View>
                <View style={styles.fieldInput}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder={(params && params?.inputFields.filter((element) => element.name.toLowerCase() == field.name.toLowerCase())[0]) ? params?.inputFields.filter((element) => element.name.toLowerCase() == field.name.toLowerCase())[0].value.toString() : 'Enter ' + field.name}
                        value={(states.filter((element) => element.name.toLowerCase() == field.name.toLowerCase())[0]) ? states.filter((element) => element.name.toLowerCase() == field.name.toLowerCase())[0].value.toString() : ''}
                        placeholderTextColor='#000000'
                        onChangeText={(value) => {
                            let tempStates = states.slice();
                            let tempIndex = -1;

                            tempStates.forEach((curr, index) => {
                                if (curr.name.toLowerCase() != field.name.toLowerCase()) return;
                                curr.value = value.toString();
                                tempIndex = index;
                            });
                            
                            if(tempIndex == -1) tempStates.push(
                                {"name": field.name.toLowerCase(), "value": value, "dataValidation": field.dataValidation}
                            );
                            setStates(tempStates);
                        }}
                    />
                </View>
            </View>
        );
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
        for (let field of modfDataFields[i].conditionalFields) {
            displayField(field, fields);                 
            if (field.name.toLowerCase() == 'date' || field.name.toLowerCase() == 'time') continue;  

            // set a state for the fields in the sates list
            let state = states.filter((element) => element.name.toLowerCase() == field.name.toLowerCase())[0];

            if (!state) {
                state = {"name": field.name.toLowerCase(), "value": '', "dataValidation": field.dataValidation};
                if (field.dropDown) state.value = field.values[0].toString();

                setStates([...states, state]);
            }
            
            if (field.conditionalFields) displayConditionals(field, displayField, fields, states);
        }
    }
        
    return (
        <SafeAreaView style={styles.safeAreaDark}>
            <ScrollView>
                <View style={styles.mainView}>
                    <ScrollView horizontal={true}>
                        {categoryButtons}
                    </ScrollView>

                    {(photos) ? 
                    <View style={styles.container2}>
                        <Image source={photos[0]} style={styles.imageSingle} />
                    </View>
                    : null}
                    
                    {fields}

                    <View style={[styles.container1, {height: 150}]}>
                        <View style={styles.commentInput}>
                            <TextInput
                                multiline={true}
                                style={styles.commentBox}
                                defaultValue={params?.comment}
                                placeholder={'Add Comments...'}
                                placeholderTextColor='#000000'
                                onChangeText={(value) => setComment(value)}
                            />
                        </View>
                    </View>
                    
                    <View style={styles.container2}>
                        {(progress.display) ?
                        
                        <View style={styles.progress}>
                                <Progress.Circle indeterminate={true} /> 
                        </View> : null}
                    
                        <TouchableOpacity style={styles.submitBtn}
                        onPress={() => SubmitData(params._id)}>
                            <Text style={styles.submitText}>UPDATE ENTRY</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.deleteBtn}
                        onPress={() => DeleteEntry(params._id)}>
                            <Text style={styles.submitText}>DELETE ENTRY</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default DataInput;