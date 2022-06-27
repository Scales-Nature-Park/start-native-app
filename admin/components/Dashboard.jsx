import React, { useState } from 'react';
import styles from '../styles/DashStyles';
import {
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from 'react-native';

const Dashboard = ({ setScreen }) => {
  return (
      <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <TouchableOpacity style={styles.buttonView} onPress={() => {
          setScreen('Login');
        }}>
          <Text>Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
      </SafeAreaView>
    );
}

export default Dashboard;