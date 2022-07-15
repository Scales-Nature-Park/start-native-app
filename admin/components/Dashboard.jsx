import React, { useState, useRef } from 'react';
import axios from 'axios';
import styles from '../styles/DashStyles';
import PrevEntries from './PrevEntries';
import Categories from './Categories';
import Prompt from './Prompt';
import Fields from './Fields';
import useSyncState, { url } from '../utils/SyncState';
import {
    Text,
    TouchableOpacity,
    Image,
    View,
    SafeAreaView,
    Alert,
    ScrollView,
    useWindowDimensions,
} from 'react-native';

const ArrayEquals = (array1, array2, json) => {
  if (!array1 || !array2) return false;

  if (json) return array1.length === array2.length &&
      array1.every((elem, index) => JSON.stringify(elem) === JSON.stringify(array2[index]));
  
  return array1.length == array2.length &&
    array1.every((elem, index) => elem === array2[index]);
};

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
    let message = err?.response?.data ? err?.response?.data : err.message;
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
    let message = err?.response?.data ? err?.response?.data : err.message;
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
    let message = err?.response?.data ? err?.response?.data : err.message;
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

const UpdatePassword = (id, stats, scrollRef) => {
  let password = '';
  let listeners = {cancel: () => {stats.set({...stats.get(), prompt: undefined})}, submit: () => {
    // update pass request
    axios({
      method: 'put',
      url: url + '/password/' + id,
      params: {admin: true, newPassword: password} 
    }).catch((err) => {
      let message = err?.response?.data ? err?.response?.data : err.message;
      Alert.alert('ERROR', message);
    });
    
    // remove prompt
    stats.set({...stats.get(), prompt: undefined})
  }, inputs: [(pass) => password = pass]};
  
  scrollRef?.current?.measure((width, height, px, py, fx, fy)  => {
    let prompt = <Prompt title={'Enter Password'} yOffset={fy} inputs={['Password']} listeners={listeners} />;
    stats.set({...stats.get(), prompt});
  });
};

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
        }).catch((err) => {
          let message = err?.response?.data ? err?.response?.data : err.message;
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

const AddCategory = (stats, scrollRef) => {
  let Category = '';
  let listeners = {cancel: () => {stats.set({...stats.get(), prompt: undefined})}, submit: () => {
    // 
    stats?.set({...stats?.get(), fields: [...stats?.get()?.fields, {Category, conditionalFields: []}], prompt: undefined})
  }, inputs: [(cat) => Category = cat]};
  
  scrollRef?.current?.measure((width, height, px, py, fx, fy)  => {
    // prompt user for entering a category name
    let prompt = <Prompt title={'Enter Category'} yOffset={fy} inputs={['Category']} listeners={listeners} />;
    stats.set({...stats.get(), prompt});
  });
};

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
  }).then((response) => {
    Alert.alert('Update Released', response.data);
  }).catch(err => {
    Alert.alert('ERROR', err.response.data || err.message);
  });
};

const Dashboard = ({ params, setScreen }) => {
  const stats = useSyncState({historicDays: 7, fetchedFields: false});
  const scrollRef = useRef();
  const layout = useWindowDimensions();
  const turtle = require('../assets/turtle.png');
  const snake = require('../assets/snake.png');
  const lizard = require('../assets/lizard.png');


  FetchStats(stats);
  
  // set fields to the latest updated data fields in the database
  if (!stats?.get()?.fetchedFields) {
    axios({
      method: 'get',
      url: url + '/fields'
    }).then(fields => {
      stats.set({...stats.get(), fields: fields.data, fetchedFields: true});
    }).catch(err => {});
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView nestedScrollEnabled={true} style={{height: layout.height}}>
          <View style={styles.header}>
            <Text style={styles.headText}>Hi {params?.username},</Text>
            <TouchableOpacity style={styles.logout} onPress={() => setScreen({params, val: 'Login'})}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.release} onPress={() => PushRelease(stats)}>
              <Text style={styles.logoutText}>Save Changes</Text>
            </TouchableOpacity>
          </View>

          <View ref={scrollRef} style={[styles.container, {minHeight: layout.height}]}>
            <View style={styles.mainContainer}>
              <View style={styles.entryCountContainer}>
                <View style={styles.recentActivity}>
                  <Text style={styles.fieldText}>Turtle Entries</Text>
                  <Text style={styles.activityNum}>{(stats.get()?.turtEntries) ? stats.get().turtEntries : 0}</Text>
                  <Text style={styles.activityText}>Entries</Text>
                  <View style={styles.imageContainer}>
                    <Image source={turtle} resizeMode={'contain'} style={styles.turtleImage} />
                  </View>
                </View>

                <View style={styles.recentActivity}>
                  <Text style={styles.fieldText}>Snake Entries</Text>
                  <Text style={styles.activityNum}>{(stats.get()?.snakeEntries) ? stats.get().snakeEntries : 0}</Text>
                  <Text style={styles.activityText}>Entries</Text>
                  <View style={styles.imageContainer}>
                    <Image source={snake} resizeMode={'contain'} style={styles.reptileImage} />
                  </View>
                </View>

                <View style={styles.recentActivity}>
                  <Text style={styles.fieldText}>Lizard Entries</Text>
                  <Text style={styles.activityNum}>{(stats.get()?.lizardEntries) ? stats.get().lizardEntries : 0}</Text>
                  <Text style={styles.activityText}>Entries</Text>
                  <View style={styles.imageContainer}>
                    <Image source={lizard} resizeMode={'contain'} style={styles.reptileImage} />
                  </View>
                </View>
              </View>
              <View style={styles.margin} />
              
              {stats.get()?.accounts?.map((acc) => 
                <View style={styles.accountContainer}>
                  <View style={styles.accountContent}>
                    <View style={styles.accountName}>
                      <Text>{acc.username}</Text>
                    </View>
                    <TouchableOpacity onPress={() => UpdatePassword(acc._id, stats, scrollRef)} style={styles.updateButton}>
                      <Text>Update Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => DeleteAccount(acc._id, stats)} style={styles.deleteButton}>
                      <Text>Delete Account</Text>
                    </TouchableOpacity>
                  </View> 
                </View>
              )}
              <View style={styles.margin} />

              {(stats?.get()?.fields) ? <Fields params={{...params, stats}} setScreen={setScreen} /> : null}
              <View style={styles.margin} />
            </View>

            {(stats.get().prompt) ? stats.get().prompt : null}
            
            <View style={styles.sideContainer}>
              <View style={styles.recentsContainer}>
                <Text style={styles.recentText}>Recent Entries</Text>
                <ScrollView nestedScrollEnabled={true}>
                  <PrevEntries params={{...params, fields:stats?.get()?.fields}} setScreen={setScreen} />
                </ScrollView>
              </View>

              <View style={styles.categoryContainer}>
                <Text style={styles.recentText}>Categories</Text>
                <ScrollView nestedScrollEnabled={true}>
                  <Categories params={{...params, stats, scrollRef}} setScreen={setScreen} />
                </ScrollView>
                <TouchableOpacity style={styles.addButton} onPress={() => AddCategory(stats, scrollRef)}>
                  <Text>Add Category</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Dashboard;