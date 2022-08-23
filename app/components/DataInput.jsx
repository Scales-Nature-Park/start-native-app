import useSyncState from '../utils/SyncState';
import Carousel from 'react-native-reanimated-carousel';
import styles from '../styles/DataStyles';
import Feather from 'react-native-vector-icons/Feather';
import * as Progress from 'react-native-progress';
import React, { useEffect, useLayoutEffect, useReducer, useContext } from 'react';
import { url, UserContext } from '../utils/Storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNetInfo } from '@react-native-community/netinfo';
import { 
    Reducer,
    SaveDataEntry, 
    SubmitData,
    AutoFillField, 
    ChoosePhoto,
    FetchFields,
    displayConditionals,
    displayField
} from '../utils/InputUtils';
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
} from 'react-native';

Feather.loadFont();
const scalesColors = require('../utils/json/colors.json');

const DataInput = ({route, navigation}) => {
    const user = useContext(UserContext);
    const accountId = user?.userInfo?.id || '';
    const paramData = route?.params?.data;

    const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novemeber', 'December'];
    const dateObj = new Date(),
        day = (paramData && paramData.day) ? paramData.day : dateObj.getDate(), 
        month = (paramData && paramData.month) ? paramData.month : months[dateObj.getMonth()],
        year = (paramData && paramData.year) ? paramData.year : dateObj.getFullYear(),
        currHours = (paramData && paramData.hours) ? paramData.hours : dateObj.getHours(),
        currMins = (paramData && paramData.mins) ? paramData.mins : dateObj.getMinutes();

    const initialFields = (paramData && paramData.inputFields) ? JSON.parse(JSON.stringify(paramData.inputFields)) : []; 
    const netInfo = useNetInfo();

    let currDay = day.toString().length <= 2 ? '0'.repeat(2 - day.toString().length) + day : day;
    let currMonth = month
    let currYear = year;
    let hours = currHours.toString().length <= 2 ? '0'.repeat(2 - currHours.toString().length) + currHours : currHours;
    let mins = currMins.toString().length <= 2 ? '0'.repeat(2 - currMins.toString().length) + currMins : currMins;

    let category = (paramData && paramData.category) ? paramData.category : 'Turtle';
    let comment = (paramData && paramData.comment) ? paramData.comment : '';
    let valid = false;
    let photos = (paramData && paramData.photos) ? [...paramData.photos] : null;
    let dark = true;
    let progress = {display: false, progress: 0};
    let dataFields = require('../utils/json/fields.json');
    let loadedFields = false;

    const [dataInput, dispatch] = useReducer(Reducer, {currDay, currMonth, currYear, hours, mins, category, comment, states: [], valid, photos, dark, progress});
    const fieldState = useSyncState({loadedFields, dataFields: []});

    if (!fieldState.get().loadedFields) FetchFields(fieldState, dispatch, dataFields);
    
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
        for (let id of photoIds) {
            if (!tempPhotos.includes({uri: url + '/image/' + id})) tempPhotos.push({uri: url + '/image/' + id});
        }
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
    
    let allIndex = -1, catIndex = -1;
    let categoryButtons = [];

    // get the indeces of the all category and the selected
    // categpry objects in dataFields
    fieldState.get()?.dataFields?.forEach((element, index) => {
        if (element.Category == 'All') {
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
    if (allIndex == -1 && catIndex == -1) return <View></View>;
    
    if (allIndex != -1) modfDataFields.push(fieldState.get().dataFields[allIndex]);
    if (catIndex != -1) modfDataFields.push(fieldState.get().dataFields[catIndex]);

    // loop through all the fields in the dataFields substate of dataInput
    // and display them with theire conditional fields
    let fields = [];
    let tempStates = [...dataInput.states];
    let meta = {editedFields: false}; 
    for (let i = 0; i < modfDataFields.length; i++) {
        for (let field of modfDataFields[i].conditionalFields) {
            displayField(field, fields, dataInput, dispatch, initialFields, {day, month, year, hours, mins});                 
            if (field.name.toLowerCase() == 'date' || field.name.toLowerCase() == 'time') continue;  
            
            // set a state for the fields in the sates list
            let state = tempStates.filter(element => element.name.toLowerCase() == field.name.toLowerCase())[0];
            
            if (!state) {
                // get initial value passed as in paramData
                state = initialFields?.filter(elem => elem.name.toLowerCase() == field.name.toLowerCase())[0];
                state = {'name': field.name.toLowerCase(), 'value': (state) ? state.value : '', 'dataValidation': field.dataValidation};
                
                tempStates = [...tempStates, state];
                meta.editedStates = true;
            }
            
            AutoFillField(field, tempStates, state, meta);
            
            if (field.conditionalFields) 
            displayConditionals(field, displayField, fields, tempStates, AutoFillField, meta, dataInput, dispatch, initialFields, {day, month, year, hours, mins});
        }
    }
    if (meta.editedStates) dispatch({type: 'states', states: [...tempStates]});
    
    let buttons = [];

    // render submit button only in online mode, cuz we cant
    // connect to the server offline
    if (accountId?.trim() && user?.userInfo?.write) {
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
                                onPress: () => SubmitData(netInfo, accountId, dataInput, dispatch, navigation)
                            }
                        ]
                    );
                } else SubmitData(netInfo, accountId, dataInput, dispatch, navigation);
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
                            <TouchableOpacity style={[styles.addImage, {marginTop: 0}]} onPress={() => ChoosePhoto(dataInput, dispatch)}>
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
                        <TouchableOpacity style={styles.addImage} onPress={() => ChoosePhoto(dataInput, dispatch)}>
                            <Text style={styles.submitText}>Add Images</Text>
                        </TouchableOpacity>
                    </View>
                    : 
                    <View style={styles.container2}>
                        <View style={styles.selectImage}>
                            <TouchableOpacity style={styles.selectImageButton} onPress={() => ChoosePhoto(dataInput, dispatch)}>
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
                    
                    {(!route || !route?.params || !route?.params?.search) ? 
                    <View style={styles.container2}>
                        <TouchableOpacity style={styles.quickSave}
                        onPress={() => {                
                            SaveDataEntry(
                                {
                                    accountId,
                                    valid: dataInput.valid,
                                    photos: dataInput.photos,
                                    day: dataInput.currDay,
                                    month: dataInput.currMonth,
                                    year: dataInput.currYear,
                                    hours: dataInput.hours,
                                    mins: dataInput.mins,
                                    category: dataInput.category,
                                    inputFields: dataInput.states,
                                    comment: dataInput.comment
                                },
                                navigation, route?.params
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
                                    accountId,
                                    valid: dataInput.valid,
                                    photos: dataInput.photos,
                                    day: dataInput.currDay,
                                    month: dataInput.currMonth,
                                    year: dataInput.currYear,
                                    hours: dataInput.hours,
                                    mins: dataInput.mins,
                                    category: dataInput.category,
                                    inputFields: dataInput.states,
                                    comment: dataInput.comment
                                },
                                navigation, route?.params
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

export default DataInput;