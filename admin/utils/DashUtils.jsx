import axios from 'axios';
import React from 'react';
import Prompt from '../components/Prompt';
import { url } from './SyncState';
import { Alert } from 'react-native';

/**
 * Function for checking whether to arrays are equal or not, it returns true if they're
 * equal, false otherwise.
 */
const ArrayEquals = (array1, array2, json) => {
    if (!array1 || !array2) return false;
  
    if (json) return array1.length === array2.length &&
        array1.every((elem, index) => JSON.stringify(elem) === JSON.stringify(array2[index]));
    
    return array1.length == array2.length &&
      array1.every((elem, index) => elem === array2[index]);
};

/**
 * Add category button callback function that prompts a user for a category name
 * then adds that category to the fields element of the stats sync state.
 */
const AddCategory = (stats, scrollRef) => {
    let Category = '';
    let listeners = {cancel: () => {stats.set({...stats.get(), prompt: undefined})}, submit: () => {
      stats?.set({...stats?.get(), fields: [...stats?.get()?.fields, {Category, conditionalFields: []}], prompt: undefined})
    }, inputs: [(cat) => Category = cat]};
    
    scrollRef?.current?.measure((width, height, px, py, fx, fy)  => {
      // prompt user for entering a category name
      let prompt = <Prompt title={'Enter Category'} yOffset={fy} inputs={['Category']} listeners={listeners} />;
      stats.set({...stats.get(), prompt});
    });
};

/**
 * Save changes button callback functions that updates the fields collection in 
 * the database. It takes in a stats sync state parameter that has a fields list 
 * element with all the field categories and their conditional fields, then sends a
 * put request to the server at /addFields enpoint which updates the database. 
 */
const PushRelease = (stats) => {
    // check if there is a fields list in the stats state
    if (!stats?.get()?.fields) {
      Alert.alert('ERROR', 'Failed to push new release due to fields');
      return;
    }
    
    // request to replace the old fields with the new ones
    axios({
      method: 'put',
      url: url + '/addFields',
      data: {fields: stats.get().fields}
    }).then(response => {
      Alert.alert('Update Released', response.data);
    }).catch(err => {
      Alert.alert('ERROR', err.response.data || err.message);
    });
};

/**
 * App stats function that fetches the number of entries for turtles, snakes and
 * lizards. It also fetches all usernames for all non-admin accounts. 
 */
const FetchStats = async (stats) => {
    // copy stats and perform changes on the temp object
    let newChange = false;
    let tempStats = {...stats?.get()};
    if (!tempStats) tempStats = {};
  
    // fetch the amount of entries for turtles, snakes and lizards
    try {
      let response = await axios({
        method: 'get',
        url: url + '/search',
        params: {category: 'Turtle'},
      });
  
      if (tempStats.turtEntries != response.data.length) {
        newChange = true;
        tempStats = {...tempStats, turtEntries: response.data.length};
      } 
    } catch(err) {
      let message = err?.response?.data || err?.message;
      Alert.alert('ERROR', message);
    }
  
    try {
      let response = await axios({
        method: 'get',
        url: url + '/search',
        params: {category: 'Snake'},
      });
  
      if (tempStats.snakeEntries != response.data.length) {
        newChange = true;
        tempStats = {...tempStats, snakeEntries: response.data.length};
      }
    } catch(err) {
      let message = err?.response?.data || err?.message;
      Alert.alert('ERROR', message);
    }
  
    try {
      let response = await axios({
        method: 'get',
        url: url + '/search',
        params: {category: 'Lizard'},
      });
  
      if (tempStats.lizardEntries != response.data.length) {
        newChange = true;
        tempStats = {...tempStats, lizardEntries: response.data.length};
      }
    } catch(err) {
      let message = err?.response?.data || err?.message;
      Alert.alert('ERROR', message);
    }
  
    // fetch all user data of non-admin credentials
    try {
      let response = await axios({
        method: 'get',
        url: url + '/username',
      });
  
      if (!ArrayEquals(response.data, tempStats.accounts, true)) {
        newChange = true;
        tempStats = {...tempStats, accounts: [...response.data]};
      }
    } catch(err) {
      let message = err?.response?.data ? err?.response?.data : err.message;
      Alert.alert('ERROR', message);
    }
  
    // set stats to the updated tempStats
    if (newChange) stats.set({...tempStats});
};

/**
 * Update password button function callback that takes in an account id and stats  
 * state, prompts the user to input a new password and sends a put request to the 
 * server with account id and password. Responds with an error message if failed.
 */
const UpdatePassword = (id, stats, scrollRef) => {
    let password = '';
    let listeners = {cancel: () => {stats.set({...stats.get(), prompt: undefined})}, submit: () => {
        // update pass request
        axios({
            method: 'put',
            url: url + '/password/' + id,
            data: {admin: true, newPassword: password} 
        }).catch(err => {
            let message = err?.response?.data ? err?.response?.data : err.message;
            Alert.alert('ERROR', message);
        });
        
        // remove prompt
        stats.set({...stats.get(), prompt: undefined})
    }, inputs: [(pass) => password = pass]};
    
    // measure the y scroll offset so we can display the prompt within the user's
    // screen window
    scrollRef?.current?.measure((width, height, px, py, fx, fy)  => {
      let prompt = <Prompt title={'Enter Password'} yOffset={fy} inputs={['Password']} listeners={listeners} />;
      stats.set({...stats.get(), prompt});
    });
};
  
/**
 * Delete account button callback function it takes in an account id and stats sync 
 * state, prompts the user to confirm account deletion then sends a delete request
 * to the server with passed in user account id. Updates the stats state on success or 
 * displays an error message.
 */
const DeleteAccount = (id, stats) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete account?', [
        {
            text: 'Confirm',
            onPress: () => {
                axios({
                    method: 'delete',
                    url: url + '/user/' + id
                }).then(() => {
                    FetchStats(stats);
                }).catch(err => {
                    let message = err?.response?.data || err?.message;
                    Alert.alert('ERROR', message);
                });
            }
        },
        {
            text: 'Cancel',
            onPress: () => {}
        }
    ]);
};

export { PushRelease, AddCategory, FetchStats, UpdatePassword, DeleteAccount, ArrayEquals };