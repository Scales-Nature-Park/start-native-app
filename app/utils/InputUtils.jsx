import React from 'react';
import styles from '../styles/DataStyles';
import Feather from 'react-native-vector-icons/Feather';
import Geolocation from 'react-native-geolocation-service';
import ModalDropdown from 'react-native-modal-dropdown';
import storage from './Storage';
import { openPicker } from 'react-native-image-crop-picker';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { DownloadPhoto } from './ImageUpload';
import { 
    Alert,
    View,
    Text,
    TextInput, 
    TouchableOpacity,
    PermissionsAndroid 
} from 'react-native';

Feather.loadFont();
const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novemeber', 'December'];

//To bypass condition match ie: will display no matter the parent value if the condition is 'Any'
const conditionBypass = 'Any';

// recursive function that display conditional fields of a field
// and their conditionals
const displayConditionals = (jsObj, displayField, fields, states, autoFill, meta, dataInput, dispatch, initialFields, params) => {
    let state = states.filter(element => element.name.toLowerCase() == jsObj.name.toLowerCase())[0];
    if(!state) return;

    if (!jsObj.conditionalFields) return;
    
    for (let field of jsObj.conditionalFields) {
        let val = state.value.toString().toLowerCase();
        
        // if the condition is a single string then check if it matches the value
        if (typeof field.condition == 'string' && field.condition.toLowerCase() != val && field.condition.toLowerCase() != conditionBypass) continue;

        // if it's a list of strings then check if any of the strings match the value
        else if (typeof field.condition == 'object') {
            let conditionMet = true;
            try {
                for (let cond of field.condition) {
                    if (cond.toString().toLowerCase() != val) conditionMet = false;
                }
            } catch (err) {
                continue;
            }
            
            if (!conditionMet) continue;
        }
        
        let newState = states.filter(elem => elem.name.toLowerCase() == field.name.toLowerCase())[0];

        if (!newState) {
            // get initial value passed as in paramData
            newState = initialFields?.filter(elem => elem.name.toLowerCase() == field.name.toLowerCase())[0];
            newState = {name: field.name.toLowerCase(), value: (newState) ? newState.value : '', dataValidation: field.dataValidation};

            states.push(newState);
            meta.editedStates = true;
        }

        autoFill(field, states, newState, meta);
            
        // display field and conditionals if condition is met
        displayField(field, fields, dataInput, dispatch, initialFields, params);
        displayConditionals(field, displayField, fields, states, autoFill, meta, dataInput, dispatch, initialFields, params);
    }
};

const FetchFields = (state, dispatch) => {
    storage.load({key: 'fields'}).then(fields => { 
        state.set({loadedFields: true, dataFields: [...fields]});
        dispatch({type: 'states', states: []});
    }).catch(() => {});
};

const RequestLocation = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
      
        if (granted === PermissionsAndroid.RESULTS.GRANTED) return true;
    } catch (err) {}
    
    return false;
};

const ChoosePhoto = (dataInput, dispatch) => {
    let tempPhotos = (dataInput.photos) ? [...dataInput.photos] : [];

    openPicker({
        multiple: true,
        mediaType: 'photo',
        maxFiles: '10',
        showsSelectedCount: true,
    }).then(images => {
        images.forEach(img => {
            let {path, ...myImage} = img;
            tempPhotos.push({...myImage, uri: path});
        });

        dispatch({type: 'photos', photos: tempPhotos});
    }).catch(err => {});
};

const AutoFillField = (field, tempStates, state, meta) => {
    if (!field.autoFill) return;
    
    let dependencyVals = [], autoFillFail = false;

    // loop over all dependencies and try to find a state that matches the name 
    for (let dependency of field.autoFill.dependencies) {
        let dependencyState = tempStates.filter(elem => elem.name.toLowerCase() == dependency.toLowerCase())[0];

        // fail autofill if no matching state is found
        if (!dependencyState) {
            autoFillFail = true;
            break;
        }

        dependencyVals.push(dependencyState.value);
    }
    
    // if autofill didn't fail attempt to set the state value to the returned
    // value of the function
    if (!autoFillFail) {
        let autoFill = new Function(field.autoFill.arguments, field.autoFill.body);
        let newVal = autoFill(dependencyVals);

        if (newVal && state.value != newVal) {
            state.value = newVal;
            meta.editedStates = true;
        }
    }
};

const displayField = (field, fields, dataInput, dispatch, initialFields, params) => {
    if (field.name.toLowerCase() == 'date') {
        fields.push(
            <View style={styles.container1}>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        defaultValue={params.day.toString()}
                        placeholder={'DD'}
                        placeholderTextColor='#000000'
                        onChangeText={currDay => dispatch({type: 'day', day: currDay})}
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
                        defaultValue={params.month}
                        onSelect={selectedMonth => dispatch({type: 'month', month: months[selectedMonth]})}
                    />
                </View>

                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        defaultValue={params.year.toString()}
                        placeholder={'YYYY'}
                        placeholderTextColor='#000000'
                        onChangeText={currYear => dispatch({type: 'year', year: currYear})}
                    />
                </View>
            </ View>
        );
        return;
    } else if (field.name.toLowerCase() == 'time') {
        fields.push(
            <View style={styles.container1}>
                <Text style={(dataInput?.dark) ? styles.timeFieldDark : styles.timeField}>Time: </Text>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder={'HH'}
                        defaultValue={params.hours.toString()}
                        placeholderTextColor='#000000'
                        onChangeText={inHours => dispatch({type: 'hours', hours: inHours})}
                    />
                </View>

                <Text style={(dataInput?.dark) ? styles.timeFieldDark : styles.timeField}>:</Text>

                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        defaultValue={params.mins.toString()}
                        placeholder={'MM'}
                        placeholderTextColor='#000000'
                        onChangeText={inMins => dispatch({type: 'mins', mins: inMins})}
                    />
                </View>
            </ View>
        );
        return;
    } else if (field.name.toLowerCase() == 'get location') {
        fields.push(
            <View style={styles.container3}>
                <TouchableOpacity style={styles.addImage} onPress={async () => {
                    // request the user's location and return if denied
                    if (!await RequestLocation()) return;
                    
                    Geolocation.getCurrentPosition(info => {
                        let { latitude, longitude,  accuracy} = info?.coords;
                        let tempStates = [...dataInput?.states] || [];
                        
                        // retrieve lat/long/accuracy states and edit their values if found
                        let state = tempStates.find(elem => elem.name.toLowerCase() == 'longitude');
                        if (state) state.value = longitude;
                        
                        state = tempStates.find(elem => elem.name.toLowerCase() == 'latitude');
                        if (state) state.value = latitude;

                        state = tempStates.find(elem => elem.name.toLowerCase() == 'gps accuracy');
                        if (state) state.value = accuracy;

                        // dispatch the changes made to the states
                        dispatch({type: 'states', states: tempStates});
                    }, () => Alert.alert('ERROR', 'Could not fetch your current location. Please try again later.'), {
                        enableHighAccuracy: true,
                        timeout: 50000,
                        maximumAge: 0
                    });
                }}>
                    <Text style={styles.submitText}>Get Location</Text>
                </TouchableOpacity>
            </View>
        );
        return;
    } else if (field.name.toLowerCase() == 'latitude') {
        displayField({name: 'get location'}, fields, dataInput, dispatch, initialFields, params);
    }

    if (field.dropDown) {
        let dropVals = [];
        let initId = -1;
        let initValue = initialFields?.filter(element => element.name.toLowerCase() == field.name.toLowerCase())[0];

        // find initial value and use initId to refer to the initialValue
        for (let i = 0; i < field.values.length; i++) {
            dropVals.push({id: i.toString(), title: field.values[i]});
            if (initValue?.value && field.values[i].toString().toLowerCase() == initValue.value.toString().toLowerCase()) initId = i;
        } 
        
        fields.push(
            <View style={styles.container1}>
                <View style={styles.fieldContainer}>
                    <Text style={(dataInput?.dark) ? styles.fieldDark : styles.field}>{field.name}:</Text>
                </View>

                <AutocompleteDropdown
                    clearOnFocus={true}
                    closeOnBlur={false}
                    closeOnSubmit={true}
                    initialValue={{ id: initId.toString() }}
                    showClear={true}
                    onClear={() => changeState(field, {title: ''}, dataInput, dispatch)}
                    onSelectItem={item => changeState(field, item, dataInput, dispatch)}
                    direction={'up'}
                    initialNumToRender={5} 
                    dataSet={dropVals}
                    ItemSeparatorComponent={<View style={{ height: 1, width: '100%', backgroundColor: '#787177' }} />}
                    ChevronIconComponent={<Feather name="chevron-down" size={20} color="#000" />}
                    ClearIconComponent={<Feather name="x-circle" size={18} color="#383b42" />}
                    suggestionsListMaxHeight={200}
                    containerStyle={styles.dropButton3}
                    inputContainerStyle={styles.dropButton2}
                    suggestionsListContainerStyle={styles.dropDown2}
                />
            </ View>
        );
    } else {
        fields.push(
            <View style={styles.container1}>
                <View style={styles.fieldContainer}>
                    <Text style={(dataInput?.dark) ? styles.fieldDark : styles.field}>{field.name}:</Text>
                </View>
                <View style={styles.fieldInput}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder={'Enter ' + field.name}
                        value={(dataInput.states.filter(element => element.name.toLowerCase() == field.name.toLowerCase())[0]) ? dataInput.states.filter(element => element.name.toLowerCase() == field.name.toLowerCase())[0].value.toString() : ''}
                        placeholderTextColor='#000000'
                        onChangeText={value => {
                            let tempStates = dataInput.states.slice();
                            let tempIndex = -1;

                            tempStates.forEach((curr, index) => {
                                if (curr.name.toLowerCase() != field.name.toLowerCase()) return;
                                curr.value = value.toString();
                                tempIndex = index;
                            });
                            
                            if (tempIndex == -1) tempStates.push(
                                {"name": field.name.toLowerCase(), "value": value, "dataValidation": field.dataValidation}
                            );
                            dispatch({type: 'states', states: [...tempStates]});
                        }}
                    />
                </View>
            </View>
        );
    }
};

const SaveDataEntry = async (dataObj, navigation, params) => {
    if (dataObj?.photos?.length) {
        // download remote photos from database so that deleting the original shared
        // entry won't get rid of our images locally 
        for (let photo of dataObj.photos) {
            if (photo.uri.includes('file://')) continue;
            await DownloadPhoto(photo);
        }
    }

    // try loading the entries local storage
    storage.load({
        key: 'entries'
    }).then(retEntries => {
        // append this entry to stored entries  
        let updatedEntries = [...retEntries.fields];
        updatedEntries.push(dataObj); 

        storage.save({
            key: 'entries',
            data: {
                fields: [...updatedEntries]
            }
        });

        Alert.alert(
            'Data Saved', 
            'Your data has been saved on device. Return to Home.',
            [
                {text: "OK", onPress: () => {
                    navigation.navigate('Home', params);    
                }}
            ],
            {cancelable: false}
        ); 
    }).catch(err => {
        // store the entry into entries as the only element
        storage.save({
            key: 'entries',
            data: {
                fields: [dataObj]
            }
        });

        Alert.alert(
            'Data Saved', 
            'Your data has been saved on device. Return to Home.',
            [
                {text: "OK", onPress: () => {
                    navigation.navigate('Home', params);    
                }}
            ],
            {cancelable: false}
        ); 
    });
};

const Reducer = (state, action) => {
    switch(action.type) {
        /* Update the dark state to the opposite of what it is currently */
        case 'dark': 
            return {...state, dark: !state.dark};
        
        /* Update the valid state to the valid element in action */
        case 'valid': 
            return {...state, valid: action.valid};

        /* Update the progress state to the progress element in action */
        case 'progress': 
            return {...state, progress: action.progress};

        /* Update the category state to the category element in action */
        case 'category': 
            return {...state, category: action.category};
    
        /* Update the currDay state to the day element in action */
        case 'day':
            return {...state, currDay: action.day};

        /* Update the currMonth state to the month element in action */
        case 'month':
            return {...state, currMonth: action.month};

        /* Update the currYear state to the year element in action */
        case 'year':
            return {...state, currYear: action.year};
                                
        /* Update the hours state to the hours element in action */
        case 'hours':
            return {...state, hours: action.hours};

        /* Update the mins state to the mins element in action */
        case 'mins':
            return {...state, mins: action.mins};

        /* Update the comment state to the comment element in action */
        case 'comment': 
            return {...state, comment: action.comment};

        /* Update the states substate to the states element in action or current states */
        case 'states': 
            return {...state, states: [...action?.states] || [...state.states]};

        /* Update the photos substate to the photos element in action or current photos */
        case 'photos': 
            return {...state, photos: [...action?.photos] || [...state.photos]};

        /*  General state change that changes the entire state to a new one */
        case 'general': 
            return {...action.state};
    }
};

const changeState = (field, item, dataInput, dispatch) => {
    if (!item) return; 
    let tempStates = dataInput?.states?.slice();
    let tempIndex = -1;
    
    // search for an existing state with the current field name and update its value
    tempStates.forEach((curr, index) => {
        if (curr.name.toLowerCase() != field.name.toLowerCase()) return;
        curr.value = item.title;
        tempIndex = index;
    });
    
    // push a new state if an existing state wasnt found
    if(tempIndex == -1) tempStates.push(
        {"name": field.name.toLowerCase(), "value": item.title.toString(), "dataValidation": field.dataValidation}
    ); 

    dispatch({type: 'states', states: tempStates});
};

export { Reducer, SaveDataEntry, AutoFillField, RequestLocation, ChoosePhoto, FetchFields, displayConditionals, displayField };