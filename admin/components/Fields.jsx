import React from 'react';
import Prompt from './Prompt';
import styles from '../styles/DashStyles';
import { Text, Alert, View, TouchableOpacity } from 'react-native';

// recursive function that adds a field and its conditional fields 
// to a fields list
const AppendField = (field, fields, parent = undefined) => {
    // add parent to the jsObj if the current field is conditional on another field
    let jsObj = (parent) ? {...field, parent} : {...field};
    fields.push(jsObj);
    
    // recursively add the field's conditionalFields
    if (jsObj.conditionalFields) {
        for (let field of jsObj.conditionalFields) {
            AppendField(field, fields, jsObj.name);
        }
    }
}

const Fields = ({ params, setScreen }) => {
    // use fields.json if no fields were passed as a parameter
    if (!params?.stats?.get()?.fields) params?.stats?.set({...params?.stats?.get(), fields: require('../utils/fields.json')});

    const onDelete = (name, category) => {
        Alert.alert('Confirm Delete', `Are you sure you want to delete field? 
        \rDoing so will delete the field and all its conditional fields.`, [
            {
                text: 'Confirm',
                onPress: () => {
                    let filteredFields = stats.get().filter(obj => obj.Category == category);
                    console.log(filteredFields);


                    let deleteField = filteredFields.filter(field => field.name == name);
                }
            },
            {
                text: 'Cancel',
                onPress: () => {}
            }
        ]);
    };

    const onEdit = (name) => {
        
    };
    
    let categories = [...params?.stats?.get()?.fields], categoryFields = [];
    for (let category of categories) {
        // add all conditional fields to a list of fields
        let categoryObj = {name: category.Category, fields: []};
        for (let field of category.conditionalFields) {
            AppendField(field, categoryObj.fields);
        }
        
        // push the new category object to categoryFields
        categoryFields.push(categoryObj);
    }

    return (
        categoryFields.map(category => 
            <>
                <Text style={styles.subfieldText}>{category.name} Fields</Text>
                {category.fields.map(field => 
                    <View style={styles.accountContainer}>
                        <View style={styles.accountContent}>
                        <View style={styles.accountName}>
                            <Text>{field.name}</Text>
                        </View>
                        <TouchableOpacity onPress={() => onEdit(field.name)} style={styles.updateButton}>
                            <Text>Edit Field</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onDelete(field.name, category)} style={styles.deleteButton}>
                            <Text>Delete Field</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                )}
                <View style={styles.margin} />
            </>
        )
    );
};

export default Fields;