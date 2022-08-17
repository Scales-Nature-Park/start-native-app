import axios from 'axios';
import styles from '../styles/DashStyles';
import PrevEntries from './PrevEntries';
import Categories from './Categories';
import Fields from './Fields';
import React, { useState, useRef } from 'react';
import useSyncState, { url } from '../utils/SyncState';
import {
  PushRelease,
  AddCategory,
  UpdatePassword,
  DeleteAccount, 
  GiveUserPerm,
  FetchStats
} from '../utils/DashUtils'
import {
    Text,
    TouchableOpacity,
    Image,
    View,
    SafeAreaView,
    ScrollView,
    useWindowDimensions,
} from 'react-native';

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

  console.log(stats.get().accounts);

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
              
              {stats.get()?.accounts?.map(acc => 
                <View style={styles.accountContainer}>
                  <View style={styles.accountContent}>
                    <View style={styles.accountName}>
                      <Text>{acc.username}</Text>
                    </View>
                    <TouchableOpacity onPress={() => GiveUserPerm(acc._id, stats, !acc.read || false, true)} style={styles.updateButton}>
                      {acc.read ? <Text>Revoke Read Permission</Text> : 
                      <Text>Give Read Permission</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => GiveUserPerm(acc._id, stats, !acc.write || false, false)} style={styles.updateButton}>
                      {acc.write ? <Text>Revoke Write Permission</Text> :
                      <Text>Give Write Permission</Text>}
                    </TouchableOpacity>
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