import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/DataStyles';
import Feather from 'react-native-vector-icons/Feather';
import * as Progress from 'react-native-progress';
import { url } from '../utils/SyncState';
import { 
    FetchFields, 
    displayField, 
    displayConditionals, 
    SubmitData,
    DeleteEntry 
} from '../utils/InputUtils';
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
const scalesColors = require('../utils/json/colors.json');

const DataInput = ({ params, setScreen }) => {
    const id = (params?.id) ? params?.id : '';

    const day = (params && params?.day) ? params?.day : '', 
        month = (params && params?.month) ? params?.month : '',
        year = (params && params?.year) ? params?.year : '',
        currHours = (params && params?.hours) ? params?.hours : '',
        currMins = (params && params?.mins) ? params?.mins : '';

    const initialFields = (params && params?.inputFields) ? [...params?.inputFields] : []; 
        
    const [currDay, setDay] = useState(day.toString().length <= 2 ? '0'.repeat(2 - day.toString().length) + day : day);
    const [currMonth, setMonth] = useState(month);
    const [currYear, setYear] = useState(year);
    const [hours, setHours] = useState(currHours.toString().length <= 2 ? '0'.repeat(2 - currHours.toString().length) + currHours : currHours);
    const [mins, setMins] = useState(currMins.toString().length <= 2 ? '0'.repeat(2 - currMins.toString().length) + currMins : currMins);

    const [category, setCategory] = useState((params && params?.category) ? params?.category : 'Turtle');
    const [comment, setComment] = useState((params && params?.comment) ? params?.comment : '');
    const [states, setStates] = useState(initialFields);
    const [valid, setValid] = useState(false);
    const [photos, setPhotos] = useState((params && params?.photos) ? [...params?.photos] : null);
    const [dataFields, setFields] = useState(require('../utils/json/fields.json'));
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
            let value = (state?.dataValidation?.isNumber && state?.value?.toString()?.trim() != '') ? Number(state.value) : state.value;
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
        Alert.alert('ERROR', 'Invalid fields specified.');
        return (<View></View>);
    } 
    
    if (allIndex != -1) modfDataFields.push(dataFields[allIndex]);
    if (catIndex != -1) modfDataFields.push(dataFields[catIndex]);

    let fields = [];

    // loop through all the fields in the json/fields.json file
    // and display them with theire conditional fields
    for (let i = 0; i < modfDataFields.length; i++) {
        let utils = {
            day, month, year, hours, mins,
            setDay, setMonth, setYear, setHours, setMins
        };

        for (let field of modfDataFields[i].conditionalFields) {
            displayField(field, fields, params, utils, states, setStates);                 
            if (field.name.toLowerCase() == 'date' || field.name.toLowerCase() == 'time') continue;  

            // set a state for the fields in the sates list
            let state = states.filter((element) => element.name.toLowerCase() == field.name.toLowerCase())[0];

            if (!state) {
                state = {"name": field.name.toLowerCase(), "value": '', "dataValidation": field.dataValidation};
                if (field.dropDown) state.value = field.values[0].toString();

                setStates([...states, state]);
            }
            
            if (field.conditionalFields) 
            displayConditionals(field, displayField, fields, states, {params, utils, states, setStates});
        }
    }

    return (
        <SafeAreaView style={styles.safeAreaDark}>
            <ScrollView>
                <View style={styles.sideButtons}>
                    <TouchableOpacity style={styles.dash} onPress={() => setScreen({val: 'Dashboard', params: {}})}>
                        <Text>Back to Dashboard</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.mainView}>
                    <ScrollView horizontal={true}>
                        {categoryButtons}
                    </ScrollView>

                    {(photos) ? 
                        <View style={styles.container2}>
                            <ScrollView horizontal={true}
                                contentContainerStyle={{ width: `${100 * photos.length}%` }}
                                scrollEventThrottle={500}
                                decelerationRate="fast"
                                pagingEnabled
                            >
                                {photos.map(currPhoto => 
                                    <Image source={currPhoto} style={[styles.imageSingle, {width: `${100 * 1 / photos.length}%`}]} />
                                )}
                            </ScrollView>
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
                        onPress={() => SubmitData(netInfo, {
                            id, 
                            photoIds, 
                            currDay, 
                            currMonth,
                            currYear,
                            hours,
                            mins,
                            category,
                            states,
                            comment
                        }, setScreen, setProgress, params, params._id)}>
                            <Text style={styles.submitText}>UPDATE ENTRY</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.deleteBtn}
                        onPress={() => DeleteEntry(setScreen, params)}>
                            <Text style={styles.submitText}>DELETE ENTRY</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default DataInput;