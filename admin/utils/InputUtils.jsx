import axios from 'axios';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import styles from '../styles/DataStyles';
import { url } from './SyncState';
import { 
    Alert,
    View,
    Text,
    TextInput
} from 'react-native';

Feather.loadFont();

/**
 * Function fetches all the data entry fields from the server and sets the fields
 * state to the returned list. 
 */
const FetchFields = (setFields) => {
    axios({
        method: 'get',
        url: url + '/fields'
    }).then(response => {
        setFields(response.data);
    }).catch(error => {});
};

/** 
 * Recursive function that displays conditional fields of a field and their 
 * conditionals. It takes in the parent field and loops over all the its conditional
 * fields if the condition string or list of strings match the parent field's state
 * value then that conditional field is displayed with its conditional fields.
*/
const displayConditionals = (jsObj, displayField, fields, states, displayUtils) => {
    let state = states.filter(element => element.name.toLowerCase() == jsObj.name.toLowerCase())[0];
    if(!state || !jsObj.conditionalFields) return;

    for (let field of jsObj.conditionalFields) {
        if (state.value != field.condition) continue;

        displayField(field, fields, displayUtils.params, displayUtils.utils, displayUtils.states, displayUtils.setStates);
        displayConditionals(field, displayField, fields, states);
    }
};

/**
 * This function adds a jsx element to a list of fields. It takes in a field object 
 * that specifies meta data about the desired element to be added to the fields list.
 * It fills the input element with default values if a matching field exists 
 * in the initialFields argument.
 * The elements take user input which updates the passed in states state 
 * using the setStates parameter. 
 */
const displayField = (field, fields, params, utils, states, setStates) => {
    if (field.name.toLowerCase() == 'date') {
        fields.push(
            <View style={styles.container1}>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        defaultValue={utils.day.toString()}
                        placeholder={'DD'}
                        placeholderTextColor='#000000'
                        onChangeText={currDay => utils.setDay(currDay)}
                    />
                </View>

                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        defaultValue={utils.month.toString()}
                        placeholder={'Month'}
                        placeholderTextColor='#000000'
                        onChangeText={currMonth => utils.setMonth(currMonth)}
                    />
                </View>

                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        defaultValue={utils.year.toString()}
                        placeholder={'YYYY'}
                        placeholderTextColor='#000000'
                        onChangeText={currYear => utils.setYear(currYear)}
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
                        defaultValue={utils.hours.toString()}
                        placeholderTextColor='#000000'
                        onChangeText={inHours => utils.setHours(inHours)}
                    />
                </View>

                <Text style={styles.timeFieldDark}>:</Text>

                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        defaultValue={utils.mins.toString()}
                        placeholder={'MM'}
                        placeholderTextColor='#000000'
                        onChangeText={inMins => utils.setMins(inMins)}
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
                    placeholder={'Enter ' + field.name}
                    defaultValue={params?.inputFields.filter(element => element?.name?.toLowerCase() == field?.name?.toLowerCase())[0]?.value?.toString() || ''}
                    value={states?.filter(element => element?.name?.toLowerCase() == field?.name?.toLowerCase())[0]?.value?.toString() || ''}
                    placeholderTextColor='#000000'
                    onChangeText={value => {
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
};

/**
 * Asynchronous function for submitting a data entry to the server. It  submits a post request
 * to the /dataentry endpoint with the data and navigates the user to dashboard with a success
 * message if successful, error message and stays on same screen otherwise.
 */
const SubmitData = async (netInfo, dataInput, setScreen, setProgress, params, entryId = undefined) => {
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
            data: {
                'accountId': dataInput.id,
                'photoIds': dataInput.photoIds,
                'day': dataInput.currDay,
                'month': dataInput.currMonth,
                'year': dataInput.currYear,
                'hours': dataInput.hours,
                'mins': dataInput.mins,
                'category': dataInput.category,
                'inputFields': dataInput.states,
                'comment': dataInput.comment
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
        Alert.alert('ERROR', err?.response?.data || error?.message);
        return;
    }
};

/**
 * Function deletes a data entry with a specified id, it makes a request to the
 * server with the entry id to delete that data entry then redirects the user to the
 * dashboard.
 */
const DeleteEntry = (setScreen, params) => {
    axios({
        method: 'delete',
        url: url + '/entry/' + params?._id
    }).then(response => {
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

const ExportEntry = async (data) => {
    try {
        let response = await axios({
            method: 'post',
            url: url + '/export',
            data
        });
        Alert.alert('Entry Exported', `Export Link: ${response.data}`);

        return response;
    } catch (e) {
        Alert.alert('ERROR', 'Failed to export current entries, please try again later.');
    }  
};

export { FetchFields, displayConditionals, displayField, SubmitData, DeleteEntry, ExportEntry };