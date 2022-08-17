import React from 'react';
import Prompt from '../components/Prompt';
import { Alert } from 'react-native';

/**
 * Delete category button callback function that prompts user for category deletion 
 * confirmation then filters out the category with the passed in name from the stats
 * sync state list parameter. 
 */
const onDelete = (name, stats) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete category?', [
        {
          text: 'Confirm',
          onPress: () => {
            stats?.set({...stats?.get(), fields: stats?.get()?.fields?.filter(field => field.Category != name)});
          }
        },
        {
          text: 'Cancel',
          onPress: () => {}
        }
    ]);
};

/**
 * Edit category button callback function that prompts user for new category name
 * and replaces the passed in category name with the new name in the sync state
 * stats list.
 */
const onEdit = (name, scrollRef, stats) => {
    let Category = '';
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

export { onEdit, onDelete };