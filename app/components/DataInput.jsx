import React, { useEffect, useLayoutEffect, useReducer } from 'react';
import storage, { url, ArrayEquals } from '../utils/Storage';
import useSyncState from '../utils/SyncState';
import axios from 'axios';
import Carousel from 'react-native-reanimated-carousel';
import ModalDropdown from 'react-native-modal-dropdown';
import styles from '../styles/DataStyles';
import Feather from 'react-native-vector-icons/Feather';
import * as Progress from 'react-native-progress';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { openPicker } from 'react-native-image-crop-picker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNetInfo } from '@react-native-community/netinfo';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Dimensions,
    Alert,
    Image,
    Platform,
} from 'react-native';

Feather.loadFont();
const scalesColors = require('../utils/colors.json');

//To bypass condition match ie: will display no matter the parent value if the condition is 'Any'
const conditionBypass = 'Any';

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
}

// recursive function that display conditional fields of a field
// and their conditionals
const displayConditionals = (jsObj, displayField, fields, states, autoFill, meta) => {
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
            newState = {name: field.name.toLowerCase(), value: '', dataValidation: field.dataValidation};
            states.push(newState);
            meta.editedStates = true;
        }

        autoFill(field, states, newState, meta);
            
        // display field and conditionals if condition is met
        displayField(field, fields);
        displayConditionals(field, displayField, fields, states, autoFill, meta);
    }
}

const FetchFields = (state, dispatch) => {
    storage.load({key: 'fields'}).then(fields => { 
        state.set({loadedFields: true, dataFields: [...fields]});
        dispatch({type: 'states', states: []});
    }).catch(() => {});
}

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
}

const DataInput = ({route, navigation}) => {
    const id = (route && route.params && route.params.id) ? route.params.id : '';
    const paramData = route.params.data;

    const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novemeber', 'December'];
    const dateObj = new Date(),
        day = (paramData && paramData.day) ? paramData.day : dateObj.getDate(), 
        month = (paramData && paramData.month) ? paramData.month : months[dateObj.getMonth()],
        year = (paramData && paramData.year) ? paramData.year : dateObj.getFullYear(),
        currHours = (paramData && paramData.hours) ? paramData.hours : dateObj.getHours(),
        currMins = (paramData && paramData.mins) ? paramData.mins : dateObj.getMinutes();

    const initialFields = (paramData && paramData.inputFields) ? JSON.parse(JSON.stringify(paramData.inputFields)) : []; 
    const netInfo = useNetInfo();

    let currDay = '0'.repeat(2 - day.toString().length) + day;
    let currMonth = month
    let currYear = year;
    let hours = '0'.repeat(2 - currHours.toString().length) + currHours;
    let mins = '0'.repeat(2 - currMins.toString().length) + currMins;

    let category = (paramData && paramData.category) ? paramData.category : 'Turtle';
    let comment = (paramData && paramData.comment) ? paramData.comment : '';
    let valid = false;
    let photos = (paramData && paramData.photos) ? [...paramData.photos] : null;
    let dark = true;
    let progress = {display: false, progress: 0};
    let dataFields = require('../utils/fields.json');
    let loadedFields = false;

    const [dataInput, dispatch] = useReducer(Reducer, {currDay, currMonth, currYear, hours, mins, category, comment, states: [], valid, photos, dark, progress});
    const fieldState = useSyncState({loadedFields, dataFields: [...dataFields]});

    if (!fieldState.get().loadedFields) FetchFields(fieldState, dispatch);
    
    useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity onPress= {() => dispatch({type: 'dark'})}>
                {
                    (dataInput?.dark) ? <Image source={require('../assets/sun.png')} style={styles.iconImage}/> :
                             <Image source={require('../assets/moon.png')} style={styles.iconImage}/>
                }
            </TouchableOpacity>
          ),
        });
    });
    
    // append image uris to photos from existing photoids passed in paramdata
    let validityError = '', tempPhotos = undefined;
    let photoIds = (paramData && paramData.photoIds && !dataInput.photos) ? [...paramData.photoIds] : null;
    if (photoIds && photoIds.length > 0 && !dataInput.photos) {
        tempPhotos = [];
        for (let id of photoIds) (!tempPhotos.includes({uri: url + '/image/' + id})) ? tempPhotos.push({uri: url + '/image/' + id}) : null;
    } 

    if (tempPhotos && !dataInput.photos) dispatch({type: 'photos', photos: tempPhotos});

    useEffect(() => {
        let validStates = true;

        // validate all the states with their dataValidation functions
        dataInput.states.forEach(state => {
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
        
        // dispatch state change if it defers over the current valid state
        if (validStates != dataInput.valid) dispatch({type: 'valid', valid: validStates})
    }); 
    
    const ChoosePhoto = () => {
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

    const createFormData = (photo) => {
        if (!photo) return;
        const data = new FormData();
        
        data.append('photo', {
          name: photo.uri,
          type: photo.mime,
          uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
        });

        return data;
    };

    const SubmitData = async (second = undefined) => {
        // validate network connection
        if (!netInfo.isConnected) {
            Alert.alert('Network Error', 'It seems that you are not connected to the internet. Please check your connection and try again later.');
            return;
        }

        photoIds = [];
        dispatch({type: 'progress', progress: {display: true, progress: dataInput.progress.progress}});
        
        // create image forms for each photo and upload them to the server and the retrieve
        // the entry ids into the database to be linked to this data entry
        if (dataInput.photos && dataInput.photos.length > 0) {
            let i = 0;
            for (let photo of dataInput.photos) {
                i++
                let imageForm = createFormData(photo);
                                
                let photoId = undefined;
                try {
                    photoId = await    
                    axios.post(url + '/imageUpload', imageForm, {
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                } catch(e) {
                    imageForm = undefined;
                };
    
                // if image upload fails, try it again. give network error alert if on second attempt
                if(!imageForm) {
                    if (second) Alert.alert('Error', 'Failed to upload images.');
                    else SubmitData(true);
                    return;
                }
                photoIds = (photoId) ? [...photoIds, photoId.data] : [...photoIds];
            }
        }
        
        // upload the data entry to the database 
        axios({
            method: 'post',
            url: url + '/dataEntry',
            data: {
                "id": id,
                photoIds,
                "day": dataInput.currDay,
                "month": dataInput.currMonth,
                "year": dataInput.currYear,
                "hours": dataInput.hours,
                "mins": dataInput.mins,
                "category": dataInput.category,
                "inputFields": dataInput.states,
                "comment": dataInput.comment
            }
        }).then(response => {
            dispatch({type: 'progress', progress: {progress: 0, display: false}});
            Alert.alert(
                'Successful Data Entry', 
                'Your data has been submitted. Return to Home.',
                [
                    {text: "OK", onPress: () => {
                        navigation.navigate('Home', route.params);
                    }}
                ],
                {cancelable: false}
            );
        }).catch(error => {
            dispatch({type: 'progress', progress: {progress: 0, display: false}});
            Alert.alert('ERROR', error?.response?.data || error.message);
            return;
        });
    }

    const changeState = (field, item) => {
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
                        onChangeText={(currDay) => dispatch({type: 'day', day: currDay})}
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
                        onSelect={(selectedMonth) => dispatch({type: 'month', month: months[selectedMonth]})}
                        />
                    </View>
    
                    <View style={styles.inputView}>
                        <TextInput
                        style={styles.TextInput}
                        defaultValue={year.toString()}
                        placeholder={'YYYY'}
                        placeholderTextColor='#000000'
                        onChangeText={(currYear) => dispatch({type: 'year', year: currYear})}
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
                        defaultValue={hours.toString()}
                        placeholderTextColor='#000000'
                        onChangeText={(inHours) => {
                                if (inHours.trim() == '') dispatch({type: 'hours', hours: currHours});
                                else dispatch({type: 'hours', hours: inHours});
                            }
                        }
                        />
                    </View>
    
                    <Text style={(dataInput?.dark) ? styles.timeFieldDark : styles.timeField}>:</Text>
    
                    <View style={styles.inputView}>
                        <TextInput
                        style={styles.TextInput}
                        defaultValue={mins.toString()}
                        placeholder={'MM'}
                        placeholderTextColor='#000000'
                        onChangeText={(inMins) => {
                                if (inMins.trim() == '') dispatch({type: 'mins', mins: currMins});
                                else dispatch({type: 'mins', mins: inMins});
                            }
                        }
                        />
                    </View>
                </ View>
            );
            return;
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
                        showClear={false}
                        onSelectItem={(item) => changeState(field, item)}
                        direction={'up'}
                        initialNumToRender={5} 
                        dataSet={dropVals}
                        ItemSeparatorComponent={<View style={{ height: 1, width: '100%', backgroundColor: '#787177' }} />}
                        ChevronIconComponent={<Feather name="chevron-down" size={20} color="#000" />}
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
                            onChangeText={(value) => {
                                let tempStates = dataInput.states.slice();
                                let tempIndex = -1;

                                tempStates.forEach((curr, index) => {
                                    if (curr.name.toLowerCase() != field.name.toLowerCase()) return;
                                    curr.value = value.toString();
                                    tempIndex = index;
                                });
                                
                                if(tempIndex == -1) tempStates.push(
                                    {"name": field.name.toLowerCase(), "value": value, "dataValidation": field.dataValidation}
                                );
                                dispatch({type: 'states', states: [...tempStates]});
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
    fieldState.get()?.dataFields?.forEach((element, index) => {
        if (element.Category == "All") {
            allIndex = index;
        } else {
            if (element.Category == dataInput.category) catIndex = index;
            categoryButtons.push(
                <TouchableOpacity style={(dataInput.category == element.Category) ? styles.buttonView : styles.buttonView2}
                onPress= {() => dispatch({type: 'category', category: element.Category})}>
                    <Text style={(dataInput.category == element.Category) ? {color: '#000000'} : {color: scalesColors.BlueRacer}}>{element.Category}</Text>
                </TouchableOpacity>
            );
        } 
    });

    let modfDataFields = [];
    if (allIndex == -1 && catIndex == -1) {
        alert("Invalid fields specified.");
        return (<View></View>);
    } 
    
    if (allIndex != -1) modfDataFields.push(fieldState.get().dataFields[allIndex]);
    if (catIndex != -1) modfDataFields.push(fieldState.get().dataFields[catIndex]);

    // loop through all the fields in the dataFields substate of dataInput
    // and display them with theire conditional fields
    let fields = [];
    let tempStates = [...dataInput.states];
    let meta = {editedFields: false}; 
    for (let i = 0; i < modfDataFields.length; i++) {
        for (let field of modfDataFields[i].conditionalFields) {
            displayField(field, fields);                 
            if (field.name.toLowerCase() == 'date' || field.name.toLowerCase() == 'time') continue;  

            // set a state for the fields in the sates list
            let state = tempStates.filter(element => element.name.toLowerCase() == field.name.toLowerCase())[0];

            if (!state) {
                // get initial value passed as in paramData
                state = initialFields?.filter(elem => elem.name.toLowerCase() == field.name.toLowerCase())[0];
                state = {"name": field.name.toLowerCase(), "value": (state) ? state.value : '', "dataValidation": field.dataValidation};
                   
                tempStates = [...tempStates, state];
                meta.editedStates = true;
            }
            
            AutoFillField(field, tempStates, state, meta);
            
            if (field.conditionalFields) displayConditionals(field, displayField, fields, tempStates, AutoFillField, meta);
        }
    }
    if (meta.editedStates) dispatch({type: 'states', states: [...tempStates]});
    
    let buttons = [];

    // render submit button only in online mode, cuz we cant
    // connect to the server offline
    if (route.params.onlineMode) {
        buttons.push(
            <TouchableOpacity style={styles.submitBtn}
            onPress={() => {
                // get the data validation value before proceedoing
                // if its false return with an alert
                if (!dataInput.valid){
                    Alert.alert('ERROR', (validityError != '') ? validityError : 'Invalid data.');
                    return;
                }

                if (!dataInput.photos || dataInput.photos.length <= 0) {
                    Alert.alert('WARNING', "You haven't uploaded an image.",
                        [
                            {
                            text: "Cancel",
                            },
                            { 
                                text: "Proceed Anyway", 
                                onPress: () => SubmitData()
                            }
                        ]
                    );
                } else SubmitData();
            }}>
                <Text style={styles.submitText}>SUBMIT</Text>
            </TouchableOpacity>
        );
    } 
        
    return (
        <SafeAreaView style={(dataInput?.dark) ? styles.safeAreaDark : styles.safeArea}>
            <GestureHandlerRootView>
                <ScrollView>
                    <ScrollView horizontal={true}>
                        {categoryButtons}
                    </ScrollView>

                    {(dataInput.photos && dataInput.photos.length > 0) ? (dataInput.photos.length > 1) ?
                        <View style={styles.container2}>
                            <Carousel
                                width={Dimensions.get('window').width}
                                height={220}
                                mode="parallax"
                                modeConfig={{
                                    parallaxScrollingScale: 0.9,
                                    parallaxScrollingOffset: 50,
                                }}
                                data={dataInput.photos}
                                renderItem={({ item }) => 
                                <View style={styles.container2}>
                                    <Image source={item} style={styles.image} />
                                    <TouchableOpacity style={styles.deleteImage} onPress={() => {
                                        let tempPhotos = dataInput.photos.filter(elem => elem != item);
                                        dispatch({type: 'photos', photos: tempPhotos});
                                    }}>
                                        <Feather name="x" size={25} color='red' />
                                    </TouchableOpacity>
                                </View>}
                            />
                            <TouchableOpacity style={[styles.addImage, {marginTop: 0}]} onPress={ChoosePhoto}>
                                <Text style={styles.submitText}>Add Images</Text>
                            </TouchableOpacity>
                        </View>
                    :
                    <View style={styles.container2}>
                        <Image source={dataInput.photos[0]} style={[styles.imageSingle]} />
                        <TouchableOpacity style={styles.deleteImageSingle} onPress={() => {
                            let tempPhotos = dataInput.photos.filter(elem => elem != dataInput.photos[0]);
                            dispatch({type: 'photos', photos: tempPhotos});
                        }}>
                            <Feather name="x" size={25} color='red' />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.addImage} onPress={ChoosePhoto}>
                            <Text style={styles.submitText}>Add Images</Text>
                        </TouchableOpacity>
                    </View>
                    : 
                    <View style={styles.container2}>
                        <View style={styles.selectImage}>
                            <TouchableOpacity style={styles.selectImageButton} onPress={ChoosePhoto}>
                                <Text style={styles.imageSelectText}>Select Image</Text>
                                <Feather name="upload" style={styles.uploadIcon} size={25} color={scalesColors.background} />
                            </TouchableOpacity>
                        </View>
                    </View>}
                    
                    {fields}

                    <View style={[styles.container1, {height: 150}]}>
                        <View style={styles.commentInput}>
                            <TextInput
                                multiline={true}
                                style={styles.commentBox}
                                defaultValue={paramData?.comment}
                                placeholder={'Add Comments...'}
                                placeholderTextColor='#000000'
                                onChangeText={(value) => dispatch({type: 'comment', comment: value})}
                            />
                        </View>
                    </View>
                    
                    {(!route || !route.params || !route.params.search) ? 
                    <View style={styles.container2}>
                        <TouchableOpacity style={styles.quickSave}
                        onPress={() => {                
                            SaveDataEntry(
                                {
                                    "id": id,
                                    "photos": dataInput.photos,
                                    "day": dataInput.currDay,
                                    "month": dataInput.currMonth,
                                    "year": dataInput.currYear,
                                    "hours": dataInput.hours,
                                    "mins": dataInput.mins,
                                    "category": dataInput.category,
                                    "inputFields": dataInput.states,
                                    "comment": dataInput.comment
                                },
                                navigation, route.params
                            );
                        }}>
                            <Text style={styles.submitText}>QUICK SAVE</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.save}
                        onPress={() => {
                            // get the data validation value before proceedoing
                            // if its false return with an alert
                            if (!dataInput.valid){
                                Alert.alert('ERROR', (validityError != '') ? validityError : 'Invalid data.');
                                return;
                            }

                            SaveDataEntry(
                                {
                                    "id": id,
                                    "photos": dataInput.photos,
                                    "day": dataInput.currDay,
                                    "month": dataInput.currMonth,
                                    "year": dataInput.currYear,
                                    "hours": dataInput.hours,
                                    "mins": dataInput.mins,
                                    "category": dataInput.category,
                                    "inputFields": dataInput.states,
                                    "comment": dataInput.comment
                                },
                                navigation, route.params
                            );

                        }}>
                            <Text style={styles.submitText}>SAVE</Text>
                        </TouchableOpacity>
                        
                        {(buttons.length > 0 && dataInput.progress.display) ?
                        
                        <View style={styles.progress}>
                             <Progress.Circle indeterminate={true} /> 
                        </View> : null}
                    
                        {buttons}
                    </View> : null}
            </ScrollView>
        </GestureHandlerRootView>
        </SafeAreaView>
    );
}

const SaveDataEntry = (dataObj, navigation, params) => {
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
    }).catch((err) => {
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
}

export default DataInput;