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
 * Recursive function that goes through a field's conditionals to find a 
 * specific field with the given name and deletes it from the array.
 * It returns true if the conditonal field was found and stops checking other
 * conditional fields once the field is found and deleted. Returns false if the field
 * wasn't found.
 */
const FilterConditionals = (field, name) => {
    if (!field?.conditionalFields?.length) return false;
    
    // filter the field's conditional fields
    if (field.conditionalFields.filter(field => field.name == name)?.length) {
        field.conditionalFields = field.conditionalFields.filter(field => field.name != name);
        return true;
    }

    // go deeper if not found in the current conditional fields
    for (let conditional of field?.conditionalFields) {
        // dont check further siblings and their children if already found 
        if (FilterConditionals(conditional, name)) return true;
    }

    return false;
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
                    FilterConditionals(filteredFields, name);
                    
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