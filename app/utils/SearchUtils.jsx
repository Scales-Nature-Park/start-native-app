import React from 'react';
import axios from 'axios';
import ModalDropdown from 'react-native-modal-dropdown';
import styles from '../styles/SearchStyles';
import { ArrayEquals, url } from './Storage';
import { View, Text, TextInput, Alert } from 'react-native';

/**
 * This functions sets the criteria list state to have all the names of the 
 * choosable search criteria values in the dropdowns
 */
const resetCriteria = (modfSearchFields, criteria, setCriteria, override = false,) => {
    // add criteria to dropdown of selected category 
    let tempCriteria = criteria.splice();

    for (let i = 0; i < modfSearchFields.length; i++) {
        for (let field of modfSearchFields[i].ConditionalCriteria) {
            tempCriteria.push(field.name);
        }
    }
    if (!ArrayEquals(criteria, tempCriteria) || override) setCriteria(tempCriteria);
    return tempCriteria;
};

/**
 * This function is a callback for a criteria dropdown selection. Once a dropdown value
 * is selected it updates the passed in selections sync state with data about the event.
 */
const dropDownSelect = (element, compId, modfSearchFields, selections, ref) => {
    let tempSelections = selections.get().slice();
    let tempIndex = -1;

    tempSelections.forEach((curr, index) => {
        if (curr.key == compId) tempIndex = index;
    });
    
    // add a new selection for the dropdown if its not found in selections
    if(tempIndex == -1) {
        tempIndex = tempSelections.length;
        tempSelections.push(
            {"key": compId}
        );
    }

    tempSelections[tempIndex].prevFields = (tempSelections[tempIndex].Subfields) ? tempSelections[tempIndex].Subfields.length : 1;
    tempSelections[tempIndex].value = element;
    tempSelections[tempIndex].displayed = false;

    // get the subfields of the selected field and add it to the selection
    for (let i = 0; i < modfSearchFields.length; i++) {
        for (let field of modfSearchFields[i].ConditionalCriteria) {
            if (element == field.name)   
            tempSelections[tempIndex].Subfields = field.Subfields;
        }
    }
    selections.set(tempSelections);
    if (compId && ref?.current?._reactInternals?.alternate?.key && compId != ref?.current?._reactInternals?.alternate?.key) 
        ref?.current?.props?.onSelect(0, ref.current.state.buttonText);
};

/**
 * This function adds a jsx element to a list of fields at a specified index.
 * It takes in a field object that specifies meta data about the desired element to
 * be added to the fields list. The elements take user input which updates the passed 
 * in sync state (states).
 */
const displayField = (field, fields, index, states, dark) => {
    if (field.dropDown) {
        fields.splice(index, 0,
            <View style={styles.container}>
                <View style={{width: '45%'}}>
                    <Text style={(dark.value) ? styles.fieldDark : styles.field}>{field.name}:</Text>
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
                        defaultValue={(states.get().filter((state) => state.name == field.name)?.length > 0) ? states.get().filter((state) => state.name == field.name)[0].value : field.values[0]}
                        onSelect={myVal => {
                            let tempStates = states.get().slice();
                            let tempIndex = -1;

                            tempStates.forEach((curr, index) => {
                                if (curr.name != field.name) return;
                                curr.value = field.values[myVal];
                                tempIndex = index;
                            });
                            
                            if(tempIndex == -1) tempStates.push(
                                {name: field.name, value: field.values[myVal]}
                            );
                            if (!ArrayEquals(states.get(), tempStates)) states.set(tempStates);
                        }}
                    />
                </View>
            </ View>
        );
    } else {
        fields.splice(index, 0,
            <View style={styles.entryLine}>
                <View style={{width: '45%'}}>
                    <Text style={(dark.value) ? styles.fieldDark : styles.field}>{field.name}:</Text>
                </View>
                <View style={styles.fieldInput}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder={'Enter ' + field.name}
                        placeholderTextColor='#000000'
                        defaultValue={(states.get().filter((state) => state.name == field.name)?.length > 0) ? states.get().filter((state) => state.name == field.name)[0].value : ''}
                        onChangeText={value => {
                            let tempStates = states.get().slice();
                            let tempIndex = -1;

                            tempStates.forEach((curr, index) => {
                                if (curr.name != field.name) return;
                                curr.value = value;
                                tempIndex = index;
                            });
                            
                            if(tempIndex == -1) tempStates.push(
                                {name: field.name, value: value}
                            );
                            if (!ArrayEquals(states.get(), tempStates)) states.set(tempStates);
                        }}
                    />
                </View>
            </View>
        );
    }

    return fields;
};

/**
 * Asyncronous function that takes in an array of data entries and sends a request
 * to the /export endpoint with these entries to export them to a folder of images
 * and a csv file on google drive. It alerts the user with the link to the folder 
 * or an error message.
 */
 const ExportEntry = async (data, toast, setLoad) => {
    // verify there is at least one entry
    if (!data || !data.length) {
        Alert.alert('No Entries', 'We could not process your request due to insufficient amount of entries to export.');
        return;
    }
    setLoad(true);
    
    try {
        // request export from the server
        let response = await axios({
            method: 'post',
            url: url + '/export',
            data
        });
        
        // notify user with the folder link
        setLoad(false);
        toast.hideAll();
        toast.show(response.data, { type: 'with_copy_button' });
    } catch (err) {
        toast.show(err, { type: 'danger' });
        Alert.alert('ERROR', 'Failed to export current entries, please try again later.');
    }  
};

export { resetCriteria, dropDownSelect, displayField, ExportEntry };