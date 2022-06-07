import React, { useState } from 'react';
import ModalDropdown from 'react-native-modal-dropdown';
import uuid from 'react-native-uuid';
import Entry from './Entry';
import {
    StatusBar,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    TextInput,
    ScrollView,
    Alert,
} from 'react-native';
import useSyncState from '../utils/SyncState';
import { url } from '../utils/Storage';
import axios from 'axios';

const scalesColors = require('../utils/colors.json');
const searchFields = require('../utils/search.json');

function ArrayEquals (array1, array2) {
    return array1.length === array2.length &&
        array1.every((val, index) => val === array2[index]);
}

const Search = ({route, navigation}) => {
    const [category, setCategory] = useState('Turtle');
    const [entries, setEntries] = useState([]);
    const [criteria, setCriteria] = useState([]);
    const states = useSyncState([]);
    const criteriaElements = useSyncState([]);
    const selections = useSyncState([]);
    
    const displayField = (field, fields, index) => {
        if (field.dropDown) {
            fields.splice(index, 0,
                <View style={styles.container}>
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
                        defaultValue={field.values[0]}
                        onSelect={(myVal) => {
                            let tempStates = states.get().slice();
                            let tempIndex = -1;

                            tempStates.forEach((curr, index) => {
                                if (curr.name != field.name) return;
                                curr.value = field.values[myVal];
                                tempIndex = index;
                            });
                            
                            if(tempIndex == -1) tempStates.push(
                                {"name": field.name, "value": field.values[myVal]}
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
                        <Text style={styles.field}>{field.name}:</Text>
                    </View>
                    <View style={styles.fieldInput}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder={'Enter ' + field.name}
                            placeholderTextColor='#000000'
                            onChangeText={(value) => {
                                let tempStates = states.get().slice();
                                let tempIndex = -1;

                                tempStates.forEach((curr, index) => {
                                    if (curr.name != field.name) return;
                                    curr.value = value;
                                    tempIndex = index;
                                });
                                
                                if(tempIndex == -1) tempStates.push(
                                    {"name": field.name, "value": value}
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

    const resetCriteriaDrops = (tempCriteria = criteria) => {
        let tempElements = criteriaElements.get();
        console.log(tempElements.length);
        for (let i = 0; i < tempElements.length; i++) {
            if (!tempElements[i].key) continue;
            
            let currSelection = selections.get().filter((sel) => sel.key == tempElements[i].key);
            if (currSelection.length == 0) continue;
            else currSelection = currSelection[0];

            console.log(currSelection);

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
                onSelect={(index, elem) => dropDownSelect(elem, tempElements[i].key, modfSearchFields)}
            />
        }
        criteriaElements.set(tempElements);
        console.log(tempElements.length);
    }

    const resetCriteria = (modfSearchFields) => {
        // add criteria to dropdown of selected category 
        let tempCriteria = criteria.splice();
        for (let i = 0; i < modfSearchFields.length; i++) {
            for (let field of modfSearchFields[i].ConditionalCriteria) {
                // let existingSelection = selections.get().filter((element) => element.value == field.name);
                // if (existingSelection.length == 0) 
                tempCriteria.push(field.name);
            }
        }
        if (!ArrayEquals(criteria, tempCriteria)) setCriteria(tempCriteria);
        return tempCriteria;
    }

    const dropDownSelect = (element, compId, modfSearchFields) => {
        console.log('Element: '+element);
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
        // resetCriteriaDrops(resetCriteria(modfSearchFields));
    }

    // get the indeces of the all category and the selected
    // categpry objects in searchFields
    let allIndex = -1, catIndex = -1, categoryButtons = [];
    searchFields.forEach((element, index) => {
        if (element.Category == "All") {
            allIndex = index;
        } else {
            if (element.Category == category) catIndex = index;
            categoryButtons.push(
                <TouchableOpacity style={(category == element.Category) ? styles.buttonView : styles.buttonView2}
                onPress= {() => {
                    setCategory(element.Category);
                    criteriaElements.set([]);
                    selections.set([]);
                }}>
                    <Text style={(category == element.Category) ? {color: '#000000'} : {color: scalesColors.BlueRacer}}>{element.Category}</Text>
                </TouchableOpacity>
            );
        } 
    });

    let modfSearchFields = [];
    if (allIndex == -1 && catIndex == -1) {
        alert("Invalid fields specified.");
        return (<View></View>);
    } 
    
    if (allIndex != -1) modfSearchFields.push(searchFields[allIndex]);
    if (catIndex != -1) modfSearchFields.push(searchFields[catIndex]);
    
    // loop through all dropdowns and display their conditional subfields
    let tempFields = criteriaElements.get().slice();
    for (let j = 0; j < tempFields.length; j++) {     
        // skip subField elements by checking their keys
        if (!tempFields[j].key) continue;

        let tempSelections = selections.get().slice();
        let tempIndex = -1;
        
        // find a selection with the same key as the current field key
        tempSelections.forEach((curr, index) => {
            if (curr.key == tempFields[j].key) tempIndex = index;
        });
        
        if (tempIndex == -1 || tempSelections[tempIndex].displayed) continue;
                
        // remove previous subfields related to that dropbox
        console.log('Removing previous subfields.');
        if (tempSelections[tempIndex].prevFields)
        tempFields.splice(j + 1, tempSelections[tempIndex].prevFields);

        tempSelections[tempIndex].displayed = true;
        selections.set(tempSelections);

        // display criteria with no subfields
        if (!tempSelections[tempIndex].Subfields) {
            console.log('Creating a subfield for ' + tempSelections[tempIndex].value);

            tempFields = displayField({"name": tempSelections[tempIndex].value, value: ''}, tempFields, j + 1);
            continue;
        } 
        
        for (let subField of tempSelections[tempIndex].Subfields) {
            tempFields = displayField(subField, tempFields, j + 1);
        }
    }
    if (!ArrayEquals(tempFields, criteriaElements.get())) criteriaElements.set(tempFields);

    resetCriteria(modfSearchFields);
        
    return (
        <SafeAreaView style={styles.safeArea}>
        <ScrollView>
            <ScrollView horizontal={true}>
                {categoryButtons}
            </ScrollView>
            
            <View style={styles.container}>
                {criteriaElements.get()}
            </View>
            
            <View style={styles.container}>
                <TouchableOpacity style={styles.addCriteria}
                onPress={() => {
                    if (criteria.length == 0) return;

                    let compId = uuid.v4();
                    criteriaElements.set(
                        [
                            ...criteriaElements.get(),
                            <ModalDropdown 
                                key={compId}
                                options={criteria}
                                showsVerticalScrollIndicator={true}
                                textStyle={styles.dropText}
                                style={styles.dropButton}
                                dropdownTextStyle={styles.dropText}
                                isFullWidth={true}
                                dropdownStyle={styles.dropDown}
                                dropdownTextHighlightStyle={styles.dropText}
                                defaultValue={criteria[0]}
                                defaultIndex={0}
                                onSelect={(index, element) => dropDownSelect(element, compId, modfSearchFields)}
                            />
                        ]
                    );
                    
                    // add new selection and Subfields to be displayed next render
                    if (selections.get().length <= criteriaElements.get().length) {
                        console.log('Setting selections of dropdowns.');

                        let Subfields = modfSearchFields[0].ConditionalCriteria.filter((elem) => elem.name == criteria[0]);
                        if (Subfields.length == 0 && modfSearchFields[1].length > 0)
                        Subfields = modfSearchFields[1].ConditionalCriteria.filter((elem) => elem.name == criteria[0]);
                        
                        Subfields = (Subfields.length > 0) ? Subfields[0].Subfields : undefined;
                        selections.set([...selections.get(), {"key": compId, "value": criteria[0], "displayed": false, Subfields, prevFields: (Subfields) ? Subfields.length : 0}]);
                    } 
                    // resetCriteriaDrops(resetCriteria(modfSearchFields));
                }}>
                    <Text style={styles.emptyText}>ADD CRITERIA</Text>
                </TouchableOpacity>
                
                <View style={(entries.length > 0 ) ? styles.searchResults : {}}>
                    {entries}
                </View>

                <TouchableOpacity style={styles.search} onPress={() => {
                    axios({
                        method: 'get',
                        url: url + '/search',
                        params: {
                            selections: selections.get(),
                            category,
                            states: states.get()
                        }
                    }).then((response) => {
                        let entries = [];
                        // display list of entries under the Add criteria button
                        for (let entry of response.data) {
                            entries = [...entries, <Entry data={entry} onPress={() => {
                                navigation.navigate('DataEntry', {...route.params, data: entry, search: true});
                            }}/>];
                        }
                        setEntries(entries);
                        if (entries.length == 0) Alert.alert('Response', 'No entries found that match the specified criteria.');
                    }).catch((error) => {
                        console.log(error.message);
                        Alert.alert('ERROR', error.message);
                    });
                }}>
                    <Text style={styles.emptyText}>SEARCH</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      paddingTop: StatusBar.currentHeight * 70 / 100,
      paddingBottom: StatusBar.currentHeight * 70 / 100,
      backgroundColor: '#fff',    
    },

    searchResults: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    },
  
    emptyText: {
      fontSize: 20,
      color: '#000000',
      textAlign: 'center',
      fontFamily: 'Gotham-Font',
    },
    
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        width: '100%',
        justifyContent: "center",
    },

    entryLine: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-evenly',   
        flexDirection:'row',
        width: Dimensions.get('window').width,
        height: 50,
        marginTop: 20,
    },

    addCriteria: {
        width: "95%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: scalesColors.BlueRacer,
    },

    search: {
        width: "95%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: scalesColors.DeepGreen,
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

    dropButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        textAlign: 'center',
        width: '95%',
        height: 50,
        marginTop: 20,
        backgroundColor: scalesColors.BlueRacer,
    },

    dropDown: {
        alignItems: 'center',
        justifyContent: 'center',
        color: scalesColors.BlueRacer,
        borderRadius: 10,
        backgroundColor: scalesColors.BlueRacer, 
        textAlign: 'center',
        width: '35%'
    },

    dropText: {
        alignContent: 'center',
        color: '#000',
        backgroundColor: scalesColors.BlueRacer,
        fontSize: 15,
        width: '100%',
        fontFamily: 'Gotham-Font',
        textAlign: 'center',
    },

    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        color:'#000000',
        width: '100%',
        textAlign: 'center',
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
        height: '100%',
        backgroundColor: scalesColors.BlueRacer,
        borderRadius: 10,
        marginBottom: 20,
    },
});
  

export default Search;