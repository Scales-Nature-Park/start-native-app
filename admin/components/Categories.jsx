import React from 'react';
import Category from './Category';
import { styles } from '../styles/CategoryStyles';
import { Text } from 'react-native';

const Categories = ({ params, setScreen }) => {
    let categories = [];
    if (!params?.stats?.get()?.fields) params?.stats?.set({...params?.stats?.get(), fields: require('../utils/fields.json')});

    const onDelete = (name) => {
        params?.stats?.set({...params?.stats?.get(), fields: params?.stats?.get()?.fields?.filter(field => field.Category != name)});
    };

    // const onEdit = (old, new) => {
    //     // fields
    // };
    
    // add elements with all category names to the list
    for (let field of params?.stats?.get()?.fields) {
        if (field.Category == 'All') continue;
        categories.push(
            <Category data={field.Category}  onDelete={onDelete} />
        );
    }
    if (categories.length <= 0) categories.push(<Text style={styles.emptyTextDark}>No Categories Found.</Text>);

    return (
        (categories) ? categories : 
        <Text style={styles.emptyTextDark}>No Categories Found.</Text>
    );  
};

export default Categories;