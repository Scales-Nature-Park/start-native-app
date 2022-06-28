import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/DashStyles';
import PrevEntries from './PrevEntries';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import {
    Text,
    TouchableOpacity,
    Image,
    View,
    SafeAreaView,
    ScrollView,
    Dimensions,
    useWindowDimensions,
} from 'react-native';

const Dashboard = ({ params, setScreen }) => {
  const [stats, setStats] = useState({historicDays: 7});
  const layout = useWindowDimensions();
  const turtle = require('../assets/turtle.png');
  const snake = require('../assets/snake.png');
  const lizard = require('../assets/lizard.png');
  
  // get the beginning date of historic data
  let currDate = new Date();
  let accounts = [{username: "Jeff Hathaway"},{username: "Ethan Ondzik"},{username: "Mazen Bahgat"},
  {username: "Shawna"},{username: "Kelsey"},{username: "Scales Nature Park"}];


  return (
      <SafeAreaView style={styles.safeArea}>
      <ScrollView>
          <Text style={styles.headText}>Hi {params?.username},</Text>
          <View style={[styles.container, {height: layout.height}]}>
            <View style={styles.mainContainer}>
              <View style={styles.entryCountContainer}>
                <View style={styles.recentActivity}>
                  <Text style={styles.fieldText}>Turtle Entries</Text>
                  <Text style={styles.activityNum}>24</Text>
                  <Text style={styles.activityText}>Entries</Text>
                  <View style={styles.imageContainer}>
                    <Image source={turtle} resizeMode={'contain'} style={styles.turtleImage} />
                  </View>
                </View>

                <View style={styles.recentActivity}>
                  <Text style={styles.fieldText}>Snake Entries</Text>
                  <Text style={styles.activityNum}>24</Text>
                  <Text style={styles.activityText}>Entries</Text>
                  <View style={styles.imageContainer}>
                    <Image source={snake} resizeMode={'contain'} style={styles.reptileImage} />
                  </View>
                </View>

                <View style={styles.recentActivity}>
                  <Text style={styles.fieldText}>Lizard Entries</Text>
                  <Text style={styles.activityNum}>24</Text>
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
            </View>
            
            <View style={styles.recentsContainer}>
              <Text style={styles.recentText}>Recent Entries</Text>
              <ScrollView>
                <PrevEntries />
              </ScrollView>
            </View>
          </View>
      </ScrollView>
      </SafeAreaView>
    );
}

export default Dashboard;