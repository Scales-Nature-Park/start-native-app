import { Alert } from 'react-native';

/**
 * Recursive function that adds a field and its conditional fields 
 * to a fields list.
 */ 
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

/**
 * Delete field button callback function that deletes the field from the fields element
 * in the stats state. Alerts user if any error was encountered
 */
const onDelete = (name, category, stats) => {
    Alert.alert('Confirm Delete', `Are you sure you want to delete field? 
    \rDoing so will delete the field and all its conditional fields.`, [
        {
            text: 'Confirm',
            onPress: () => {
                try {
                    // make a copy of stats and filter out the required field by name
                    let tempStats = {...stats.get()};
                    let filteredFields = tempStats.fields.find(obj => obj.Category == category.name);
                    filteredFields.conditionalFields = filteredFields.conditionalFields.filter(field => field.name != name);
                    
                    // save updates to local state
                    stats.set(tempStats);
                } catch (err) {
                    Alert.alert('ERROR', err.message);
                }
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

export { AppendField, onDelete, onEdit };