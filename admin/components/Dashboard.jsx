import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/DashStyles';
import PrevEntries from './PrevEntries';
import Categories from './Categories';
import Prompt from './Prompt';
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
  // fetch the amount of entries for turtles, snakes and lizards
  try {
    let response = await axios({
      method: 'get',
      url: url + '/search',
      params: {category: 'Turtle'},
    });
    if (stats.get()?.turtEntries != response.data.length) stats.set({...stats.get(), turtEntries: response.data.length});
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
    if (stats.get()?.snakeEntries != response.data.length) stats.set({...stats.get(), snakeEntries: response.data.length});
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
    if (stats.get()?.lizardEntries != response.data.length) stats.set({...stats.get(), lizardEntries: response.data.length});
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
    if (!ArrayEquals(response.data, stats?.get()?.accounts, true)) stats?.set({...stats.get(), accounts: response.data});
  } catch(err) {
    let message = err?.response?.data ? err?.response?.data : err.message;
    Alert.alert('ERROR', message);
  }
};

const UpdatePassword = (id, stats) => {
  let password = '';
  let listeners = {cancel: () => {stats.set({...stats.get(), prompt: undefined})}, submit: () => {
    axios({
      method: 'put',
      url: url + '/password/' + id,
      params: {admin: true, newPassword: password} 
    }).catch((err) => {
      let message = err?.response?.data ? err?.response?.data : err.message;
      Alert.alert('ERROR', message);
    });

    stats.set({...stats.get(), prompt: undefined})
  }, inputs: [(pass) => password = pass]};

  let prompt = <Prompt title={'Enter Password'} inputs={['Password']} listeners={listeners} />;
  stats.set({...stats.get(), prompt});
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
          console.log(err.response.data);
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

const Dashboard = ({ params, setScreen }) => {
  const stats = useSyncState({historicDays: 7, fetchedFields: false});
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
              <Text style={styles.logoutText}>Push Release</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.container, {minHeight: layout.height}]}>
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
                    <TouchableOpacity onPress={() => UpdatePassword(acc._id, stats)} style={styles.updateButton}>
                      <Text>Update Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => DeleteAccount(acc._id, stats)} style={styles.deleteButton}>
                      <Text>Delete Account</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
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
                  <Categories params={{...params, stats}} setScreen={setScreen} />
                  <View style={styles.categories}/>
                </ScrollView>
                <TouchableOpacity style={styles.addButton}>
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