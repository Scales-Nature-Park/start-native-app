import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/DashStyles';
import PrevEntries from './PrevEntries';
import { url } from '../utils/SyncState';
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
  const [stats, setStats] = useState({historicDays: 7});
  const layout = useWindowDimensions();
  const turtle = require('../assets/turtle.png');
  const snake = require('../assets/snake.png');
  const lizard = require('../assets/lizard.png');
  
  let accounts = [{username: "Jeff Hathaway"},{username: "Scales Nature Park"}];

  // fetch the amount of entries for turtles, snakes and lizards
  axios({
    method: 'get',
    url: url + '/search',
    params: {category: 'Turtle'},
  }).then((response) => {
    if (stats?.turtEntries != response.data.length) setStats({...stats, turtEntries: response.data.length});
  }).catch((err) => {
    let message = typeof err.response !== "undefined" ? err.response.data.message : err.message;
    Alert.alert('ERROR', message);
  });

  axios({
    method: 'get',
    url: url + '/search',
    params: {category: 'Snake'},
  }).then((response) => {
    if (stats?.snakeEntries != response.data.length) setStats({...stats, snakeEntries: response.data.length});
  }).catch((err) => {
    let message = typeof err.response !== "undefined" ? err.response.data.message : err.message;
    Alert.alert('ERROR', message);
  });

  axios({
    method: 'get',
    url: url + '/search',
    params: {category: 'Lizard'},
  }).then((response) => {
    if (stats?.lizardEntries != response.data.length) setStats({...stats, lizardEntries: response.data.length});
  }).catch((err) => {
    let message = typeof err.response !== "undefined" ? err.response.data.message : err.message;
    Alert.alert('ERROR', message);
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={{height: layout.height}}>
          <View style={styles.header}>
            <Text style={styles.headText}>Hi {params?.username},</Text>
            <TouchableOpacity style={styles.logout} onPress={() => setScreen({params, val: 'Login'})}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.container, {minHeight: layout.height}]}>
            <View style={styles.mainContainer}>
              <View style={styles.entryCountContainer}>
                <View style={styles.recentActivity}>
                  <Text style={styles.fieldText}>Turtle Entries</Text>
                  <Text style={styles.activityNum}>{(stats?.turtEntries) ? stats.turtEntries : 0}</Text>
                  <Text style={styles.activityText}>Entries</Text>
                  <View style={styles.imageContainer}>
                    <Image source={turtle} resizeMode={'contain'} style={styles.turtleImage} />
                  </View>
                </View>

                <View style={styles.recentActivity}>
                  <Text style={styles.fieldText}>Snake Entries</Text>
                  <Text style={styles.activityNum}>{(stats?.snakeEntries) ? stats.snakeEntries : 0}</Text>
                  <Text style={styles.activityText}>Entries</Text>
                  <View style={styles.imageContainer}>
                    <Image source={snake} resizeMode={'contain'} style={styles.reptileImage} />
                  </View>
                </View>

                <View style={styles.recentActivity}>
                  <Text style={styles.fieldText}>Lizard Entries</Text>
                  <Text style={styles.activityNum}>{(stats?.lizardEntries) ? stats.lizardEntries : 0}</Text>
                  <Text style={styles.activityText}>Entries</Text>
                  <View style={styles.imageContainer}>
                    <Image source={lizard} resizeMode={'contain'} style={styles.reptileImage} />
                  </View>
                </View>
              </View>
              <View style={styles.margin} />
              
              {accounts.map((acc) => 
                <View style={styles.accountContainer}>
                  <View style={styles.accountContent}>
                    <View style={styles.accountName}>
                      <Text>{acc.username}</Text>
                    </View>
                    <TouchableOpacity style={styles.updateButton}>
                      <Text>Update Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton}>
                      <Text>Delete Account</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              <View style={styles.margin} />
            </View>
            
            <View style={styles.recentsContainer}>
              <Text style={styles.recentText}>Recent Entries</Text>
              <ScrollView>
                <PrevEntries params={params} setScreen={setScreen} />
              </ScrollView>
            </View>
          </View>
      </ScrollView>
    </SafeAreaView>
    );
}

export default Dashboard;