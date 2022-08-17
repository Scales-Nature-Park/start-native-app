import React from 'react';
import Category from './Category';
import Prompt from './Prompt';
import { styles } from '../styles/CategoryStyles';
import { Text, Alert } from 'react-native';

const Categories = ({ params, setScreen }) => {
    let categories = [];
    if (!params?.stats?.get()?.fields) params?.stats?.set({...params?.stats?.get(), fields: require('../utils/json/fields.json')});

    const onDelete = (name) => {
        Alert.alert('Confirm Delete', 'Are you sure you want to delete category?', [
            {
              text: 'Confirm',
              onPress: () => {
                params?.stats?.set({...params?.stats?.get(), fields: params?.stats?.get()?.fields?.filter(field => field.Category != name)});
              }
            },
            {
              text: 'Cancel',
              onPress: () => {}
            }
        ]);
    };

    const onEdit = (name, scrollRef) => {
        let Category = '', stats = params.stats;
        let listeners = {cancel: () => {stats.set({...stats.get(), prompt: undefined})}, submit: () => {
            let fields = [...stats?.get()?.fields];
            if (!fields) return;

            fields.forEach(elem => {
                if (elem.Category == name) elem.Category = Category;
            });

            stats.set({...stats.get(), fields, prompt: undefined})
        }, inputs: [(cat) => Category = cat]};
        
        scrollRef?.current?.measure((width, height, px, py, fx, fy)  => {
            let prompt = <Prompt title={'Enter Category'} yOffset={fy} inputs={['Category']} listeners={listeners} />;
            stats.set({...stats.get(), prompt});
        });
    };
    
    // add elements with all category names to the list
    for (let field of params?.stats?.get()?.fields) {
        if (field.Category == 'All') continue;
        categories.push(
            <Category data={field.Category} scrollRef={params?.scrollRef}  onEdit={onEdit} onDelete={onDelete} />
        );
    }
    if (categories.length <= 0) categories.push(<Text style={styles.emptyTextDark}>No Categories Found.</Text>);

    return (
        (categories) ? categories : 
        <Text style={styles.emptyTextDark}>No Categories Found.</Text>
    );  
};

export default Categories;