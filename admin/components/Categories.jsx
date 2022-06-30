import React from 'react';
import Category from './Category';
import { styles } from '../styles/CategoryStyles';
import { Text } from 'react-native';

const Categories = ({ params, setScreen }) => {
    const fields = require('../utils/fields.json');
    let categories = [];

    const onDelete = (name) => {
        let tempFields = fields.filter((field) => field.Category != name);
    };
    
    // add elements with all category names to the list
    for (let field of fields) {
        if (field.Category == 'All') continue;
        categories.push(
            <Category data={field.Category} onDelete={onDelete} />
        );
    }
    if (categories.length <= 0) categories.push(<Text style={styles.emptyTextDark}>No Categories Found.</Text>);

    return (
        (categories) ? categories : 
        <Text style={styles.emptyTextDark}>No Categories Found.</Text>
    );  
};

export default Categories;