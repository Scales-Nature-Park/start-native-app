import React, { useState } from 'react';
import styles from '../styles/DashStyles';
import PrevEntries from './PrevEntries';
import {
    Text,
    TouchableOpacity,
    View,
    SafeAreaView,
    ScrollView,
} from 'react-native';

const Dashboard = ({ params, setScreen }) => {
  return (
      <SafeAreaView style={styles.safeArea}>
      <ScrollView>
          <Text style={styles.headText}>Hi {params?.username},</Text>
          <View style={styles.container}>
            <View style={styles.mainContainer}>
              <Text style={styles.fieldText}>Activity</Text>
              <View style={styles.rule} />
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