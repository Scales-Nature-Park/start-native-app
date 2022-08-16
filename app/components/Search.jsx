import axios from 'axios';
import uuid from 'react-native-uuid';
import Entry from './Entry';
import styles from '../styles/SearchStyles';
import ModalDropdown from 'react-native-modal-dropdown';
import useSyncState from '../utils/SyncState';
import React, { useState, useLayoutEffect, useRef } from 'react';
import { resetCriteria, dropDownSelect, displayField } from '../utils/SearchUtils';
import { url, ArrayEquals } from '../utils/Storage';
import { useNetInfo } from "@react-native-community/netinfo";
import {
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    Image,
    Alert,
} from 'react-native';

const scalesColors = require('../utils/json/colors.json');
const searchFields = require('../utils/json/search.json');

const Search = ({ navigation }) => {
    const netInfo = useNetInfo();
    const ref = useRef(null);
    const states = useSyncState([]);
    const criteriaElements = useSyncState([]);
    const selections = useSyncState([]);
    const [category, setCategory] = useState('Turtle');
    const [entries, setEntries] = useState([]);
    const [criteria, setCriteria] = useState([]);
    const [dark, setDark] = useState({value: true, change: false});

    useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity onPress= {() => setDark({value: !dark.value, change: true})}>
                {
                    (dark.value) ? <Image source={require('../assets/sun.png')} style={styles.iconImage}/> :
                             <Image source={require('../assets/moon.png')} style={styles.iconImage}/>
                }
            </TouchableOpacity>
          ),
        });
    });

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
        Alert.alert('ERROR', 'Invalid fields specified.');
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
        
        if (tempIndex == -1) continue;
        if (!dark.change && tempSelections[tempIndex].displayed) continue;
                
        // remove previous subfields related to that dropbox
        if (tempSelections[tempIndex].prevFields)
        tempFields.splice(j + 1, tempSelections[tempIndex].prevFields);

        tempSelections[tempIndex].displayed = true;
        tempSelections[tempIndex].prevFields = tempSelections[tempIndex].Subfields?.length || 1;
        selections.set(tempSelections);

        // display criteria with no subfields
        if (!tempSelections[tempIndex].Subfields) {
            tempFields = displayField({"name": tempSelections[tempIndex].value, value: ''}, tempFields, j + 1, states, dark);
            continue;
        } 
        
        for (let subField of tempSelections[tempIndex].Subfields) {
            tempFields = displayField(subField, tempFields, j + 1, states, dark);
        }
    }
    if (!ArrayEquals(tempFields, criteriaElements.get()) || dark.change) criteriaElements.set(tempFields);
    
    resetCriteria(modfSearchFields, criteria, setCriteria);
    if (dark.change) {
        ref?.current?.props?.onSelect(0, ref.current.state.buttonText);
        setDark({value: dark.value, change: false});
    }
        
    return (
        <SafeAreaView style={(dark.value) ? styles.safeAreaDark : styles.safeArea}>
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
                    ref?.current?.props?.onSelect(0, ref.current.state.buttonText);
                    if (criteria.length == 0) return;

                    let compId = uuid.v4();
                    criteriaElements.set(
                        [
                            ...criteriaElements.get(),
                            <ModalDropdown 
                                key={compId}
                                ref={ref}
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
                                onSelect={(index, element) => dropDownSelect(element, compId, modfSearchFields, selections, ref)}
                            />
                        ]
                    );
                    
                    // add new selection and Subfields to be displayed next render
                    let Subfields = modfSearchFields[0].ConditionalCriteria.filter((elem) => elem.name == criteria[0]);
                    if (Subfields.length == 0 && modfSearchFields[1].length > 0)
                    Subfields = modfSearchFields[1].ConditionalCriteria.filter((elem) => elem.name == criteria[0]);
                    
                    Subfields = (Subfields.length > 0) ? Subfields[0].Subfields : undefined;
                    selections.set([...selections.get(), {"key": compId, "value": criteria[0], "displayed": false, Subfields, prevFields: (Subfields) ? Subfields.length : 1}]);
                }}>
                    <Text style={styles.emptyText}>ADD CRITERIA</Text>
                </TouchableOpacity>
                
                <View style={(entries.length > 0 ) ? styles.searchResults : {}}>
                    {entries}
                </View>

                <TouchableOpacity style={styles.search} onPress={() => {
                    // validate network connection
                    if (!netInfo.isConnected) {
                        Alert.alert('Network Error', 'It seems that you are not connected to the internet. Please check your connection and try again later.');
                        return;
                    }
                    
                    axios({
                        method: 'get',
                        url: url + '/search',
                        params: {
                            selections: selections.get(),
                            category,
                            states: states.get()
                        }
                    }).then(response => {
                        // display list of entries under the Add criteria button
                        let entries = [];
                        for (let i = response.data.length - 1; i >= 0; i--) {
                            let currEntry = {type: 'submitted', field: response.data[i]};
                            entries = [...entries, <Entry data={currEntry} onPress={() => {
                                navigation.navigate('DataEntry', {data: response.data[i], search: true});
                            }}/>];
                        }
                        setEntries(entries);
                        if (entries.length == 0) Alert.alert('Response', 'No entries found that match the specified criteria.');
                    }).catch(error => {
                        Alert.alert('ERROR', error.response.data || error.message);
                    });
                }}>
                    <Text style={styles.emptyText}>SEARCH</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
        </SafeAreaView>
    );
} 

export default Search;