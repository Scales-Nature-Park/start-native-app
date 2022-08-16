import React from 'react';
import ModalDropdown from 'react-native-modal-dropdown';
import styles from '../styles/SearchStyles';
import { ArrayEquals } from './Storage';
import { View, Text, TextInput } from 'react-native';

const resetCriteria = (modfSearchFields, criteria, setCriteria, override = false,) => {
    // add criteria to dropdown of selected category 
    let tempCriteria = criteria.splice();
    for (let i = 0; i < modfSearchFields.length; i++) {
        for (let field of modfSearchFields[i].ConditionalCriteria) {
            // let existingSelection = selections.get().filter((element) => element.value == field.name);
            // if (existingSelection.length == 0) 
            tempCriteria.push(field.name);
        }
    }
    if (!ArrayEquals(criteria, tempCriteria) || override) setCriteria(tempCriteria);
    return tempCriteria;
}

const resetCriteriaDrops = (criteria, criteriaElements, selections, ref, tempCriteria = criteria) => {
    let tempElements = criteriaElements.get();
    for (let i = 0; i < tempElements.length; i++) {
        if (!tempElements[i].key) continue;
        
        let currSelection = selections.get().filter(sel => sel.key == tempElements[i].key);
        if (currSelection.length == 0) continue;
        else currSelection = currSelection[0];

        tempElements[i] = 
        <ModalDropdown 
            key={tempElements[i].key}
            options={[currSelection.value, ...tempCriteria]}
            showsVerticalScrollIndicator={true}
            textStyle={styles.dropText}
            style={styles.dropButton}
            dropdownTextStyle={styles.dropText}
            isFullWidth={true}
            dropdownStyle={styles.dropDown}
            dropdownTextHighlightStyle={styles.dropText}
            value={currSelection.value}
            defaultValue={currSelection.value}
            defaultIndex={0}
            onSelect={(index, elem) => dropDownSelect(elem, tempElements[i].key, modfSearchFields, selections, ref)}
        />
    }
    criteriaElements.set(tempElements);
}

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
    // resetCriteriaDrops(resetCriteria(modfSearchFields));
}

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
}

export { resetCriteria, dropDownSelect, displayField };