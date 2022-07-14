import React, { useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import storage, { url } from '../utils/Storage';
import Carousel from 'react-native-reanimated-carousel';
import styles from '../styles/DataStyles';
import Feather from 'react-native-vector-icons/Feather';
import * as Progress from 'react-native-progress';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { launchImageLibrary } from 'react-native-image-picker';
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
import ModalDropdown from 'react-native-modal-dropdown';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNetInfo } from '@react-native-community/netinfo';

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

const FetchFields = async (setFields) => {
    storage.load({key: 'fields'}).then(fields => setFields(fields)).catch(() => {});
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

    const initialFields = (paramData && paramData.inputFields) ? [...paramData.inputFields] : []; 
        
    const [currDay, setDay] = useState('0'.repeat(2 - day.toString().length) + day);
    const [currMonth, setMonth] = useState(month);
    const [currYear, setYear] = useState(year);
    const [hours, setHours] = useState('0'.repeat(2 - currHours.toString().length) + currHours);
    const [mins, setMins] = useState('0'.repeat(2 - currMins.toString().length) + currMins);

    const [category, setCategory] = useState((paramData && paramData.category) ? paramData.category : 'Turtle');
    const [comment, setComment] = useState((paramData && paramData.comment) ? paramData.comment : '');
    const [states, setStates] = useState(initialFields);
    const [valid, setValid] = useState(false);
    const [photos, setPhotos] = useState((paramData && paramData.photos) ? [...paramData.photos] : null);
    const [dark, setDark] = useState(true);
    const [progress, setProgress] = useState({display: false, progress: 0});
    const [dataFields, setFields] = useState(require('../utils/fields.json'));
    const netInfo = useNetInfo();

    FetchFields(setFields);

    useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity onPress= {() => setDark(!dark)}>
                {
                    (dark) ? <Image source={require('../assets/sun.png')} style={styles.iconImage}/> :
                             <Image source={require('../assets/moon.png')} style={styles.iconImage}/>
                }
            </TouchableOpacity>
          ),
        });
    });
    
    // append image uris to photos from existing photoids passed in paramdata
    let validityError = '';
    let photoIds = (paramData && paramData.photoIds && !photos) ? [...paramData.photoIds] : null;
    if (photoIds && photoIds.length > 0 && !photos) {
        let tempPhotos = [];
        for (let id of photoIds) (!tempPhotos.includes({uri: url + '/image/' + id})) ? tempPhotos.push({uri: url + '/image/' + id}) : null;
        setPhotos(tempPhotos);
    } 

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
    
    const ChoosePhoto = () => {
        launchImageLibrary({ noData: true }, (response) => {
            let tempPhotos = (photos) ? [...photos] : [];
            if (response && !response.didCancel && !tempPhotos.includes(response.assets[0])) setPhotos([...tempPhotos, response.assets[0]]);
        });
    };

    const createFormData = (photo, body = {}) => {
        if (!photo) return;
        const data = new FormData();
        
        data.append('photo', {
          name: photo.fileName,
          type: photo.type,
          uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
        });
      
        Object.keys(body).forEach((key) => {
          data.append(key, body[key]);
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
        setProgress({display: true, progress: progress.progress});
        
        // create image forms for each photo and upload them to the server and the retrieve
        // the entry ids into the database to be linked to this data entry
        if (photos && photos.length > 0) {
            let i = 0;
            for (let photo of photos) {
                i++
                let imageForm = createFormData(photo);
        
                let photoId = await    
                axios.post(url + '/imageUpload', imageForm, {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (currProgress) => {
                        setProgress({display: true, progress: progress.progress + (currProgress.loaded / currProgress.total * i / photos.length)});
                    }
                }
                ).catch((e) => {
                    imageForm = undefined;
                });
    
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
        }).then((response) => {
            setProgress({progress: 0, display: false});
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
        }).catch(function (error) {
            setProgress({progress: 0, display: false});
            Alert.alert('ERROR', error.message);
            return;
        });
    }

    const changeState = (field, item) => {
        if (!item) return; 
        let tempStates = states.slice();
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
        setStates(tempStates);
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
                        <ModalDropdown 
                        options={months}
                        showsVerticalScrollIndicator={true}
                        textStyle={styles.dropText}
                        style={styles.dropButton}
                        dropdownTextStyle={styles.dropText}
                        dropdownStyle={styles.dropDown}
                        dropdownTextHighlightStyle={styles.dropText}
                        defaultValue={month}
                        onSelect={(selectedMonth) => setMonth(months[selectedMonth])}
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
                    <Text style={(dark) ? styles.timeFieldDark : styles.timeField}>Time: </Text>
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
    
                    <Text style={(dark) ? styles.timeFieldDark : styles.timeField}>:</Text>
    
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

        if (field.dropDown) {
            let dropVals = [];
            let initId = (paramData) ? -1 : 0;
            let initValue = paramData?.inputFields?.filter((element) => element.name.toLowerCase() == field.name.toLowerCase())[0];

            // find initial value and use initId to refer to the initialValue
            for (let i = 0; i < field.values.length; i++) {
                dropVals.push({id: i.toString(), title: field.values[i]});
                if (initValue?.value && field.values[i].toString().toLowerCase() == initValue.value.toString().toLowerCase()) initId = i;
            } 
            
            fields.push(
                <View style={styles.container1}>
                    <View style={styles.fieldContainer}>
                        <Text style={(dark) ? styles.fieldDark : styles.field}>{field.name}:</Text>
                    </View>

                    <AutocompleteDropdown
                        clearOnFocus={true}
                        closeOnBlur={false}
                        closeOnSubmit={true}
                        initialValue={{ id: initId.toString() }}
                        showClear={false}
                        onClear={() => changeState({title: ''})}
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
                        <Text style={(dark) ? styles.fieldDark : styles.field}>{field.name}:</Text>
                    </View>
                    <View style={styles.fieldInput}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder={(paramData && paramData.inputFields.filter((element) => element.name.toLowerCase() == field.name.toLowerCase())[0]) ? paramData.inputFields.filter((element) => element.name.toLowerCase() == field.name.toLowerCase())[0].value.toString() : 'Enter ' + field.name}
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
    
    let buttons = [];

    // render submit button only in online mode, cuz we cant
    // connect to the server offline
    if (route.params.onlineMode) {
        buttons.push(
            <TouchableOpacity style={styles.submitBtn}
            onPress={() => {
                // get the data validation value before proceedoing
                // if its false return with an alert
                if (!valid){
                    Alert.alert('ERROR', (validityError != '') ? validityError : 'Invalid data.');
                    return;
                }
                if (!photos || photos.length <= 0) {
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
        <SafeAreaView style={(dark) ? styles.safeAreaDark : styles.safeArea}>
            <GestureHandlerRootView>
                <ScrollView>
                    <ScrollView horizontal={true}>
                            {categoryButtons}
                    </ScrollView>

                    {(photos) ? (photos.length > 1) ?
                        <View style={styles.container2}>
                        <Carousel
                            width={Dimensions.get('window').width}
                            height={220}
                            mode="parallax"
                            modeConfig={{
                                parallaxScrollingScale: 0.9,
                                parallaxScrollingOffset: 50,
                            }}
                            data={photos}
                            renderItem={({ item }) => 
                            <View style={styles.container2}>
                                <Image source={item} style={styles.image} />
                            </View>}
                        />
                        <TouchableOpacity style={[styles.addImage, {marginTop: 0}]} onPress={ChoosePhoto}>
                            <Text style={styles.submitText}>Add Image</Text>
                        </TouchableOpacity>
                        </View>
                    :
                    <View style={styles.container2}>
                        <Image source={photos[0]} style={[styles.imageSingle]} />
                        <TouchableOpacity style={styles.addImage} onPress={ChoosePhoto}>
                            <Text style={styles.submitText}>Add Image</Text>
                        </TouchableOpacity>
                    </View>
                    : 
                    <View style={styles.container2}>
                        <View style={styles.selectImage}>
                            <TouchableOpacity style={styles.selectImageButton} onPress={ChoosePhoto}>
                                <Text style={styles.submitText}>Select Image</Text>
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
                                onChangeText={(value) => setComment(value)}
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
                                    photos,
                                    "day": currDay,
                                    "month": currMonth,
                                    "year": currYear,
                                    "hours": hours,
                                    "mins": mins,
                                    "category": category,
                                    "inputFields": states,
                                    "comment": comment
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
                            if (!valid){
                                Alert.alert('ERROR', (validityError != '') ? validityError : 'Invalid data.');
                                return;
                            }

                            SaveDataEntry(
                                {
                                    "id": id,
                                    photos,
                                    "day": currDay,
                                    "month": currMonth,
                                    "year": currYear,
                                    "hours": hours,
                                    "mins": mins,
                                    "category": category,
                                    "inputFields": states,
                                    "comment": comment
                                },
                                navigation, route.params
                            );

                        }}>
                            <Text style={styles.submitText}>SAVE</Text>
                        </TouchableOpacity>
                        
                        {(buttons.length > 0 && progress.display) ?
                        
                        <View style={styles.progress}>
                             <Progress.Circle indeterminate={true} /> 
                        </View> : null}
                    
                        {buttons}
                    </View> : null}
            </ScrollView>
        </GestureHandlerRootView>
        </SafeAreaView>
    );
};

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

        navigation.navigate('Home', params);     
    }).catch((err) => {
        // store the entry into entries as the only element
        storage.save({
            key: 'entries',
            data: {
                fields: [dataObj]
            }
        });
    });
}

export default DataInput;