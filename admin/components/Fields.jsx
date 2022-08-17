import React from 'react';
import Prompt from './Prompt';
import styles from '../styles/DashStyles';
import { AppendField, onDelete, onEdit } from '../utils/FieldUtils';
import { Text, Alert, View, TouchableOpacity } from 'react-native';

const Fields = ({ params, setScreen }) => {
    // use json/fields.json if no fields were passed as a parameter
    if (!params?.stats?.get()?.fields) params?.stats?.set({...params?.stats?.get(), fields: require('../utils/json/fields.json')});
    
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
        (categoryFields) ?
        categoryFields.map(category => 
            <>
                <Text style={styles.subfieldText}>{category.name} Fields</Text>
                {(category.fields) ? category.fields.map(field => 
                    <View style={styles.accountContainer}>
                        <View style={styles.accountContent}>
                        <View style={styles.accountName}>
                            <Text>{field.name}</Text>
                        </View>
                        <TouchableOpacity onPress={() => onEdit(field.name)} style={styles.updateButton}>
                            <Text>Edit Field</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onDelete(field.name, category, params.stats)} style={styles.deleteButton}>
                            <Text>Delete Field</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                ): null}
                <View style={styles.margin} />
            </>
        ): null
    );
};

export default Fields;