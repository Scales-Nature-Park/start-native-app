import React, { useState } from 'react';
import {
    StatusBar,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
} from 'react-native';

const scalesColors = require('../utils/colors.json');
const searchFields = require('../utils/search.json');

const Search = ({navigation}) => {
    const [criteria, setCriteria] = useState([]);

    return (
        <SafeAreaView style={styles.safeArea}>
        <ScrollView>
            <View style={styles.container}>
                <TouchableOpacity style={styles.addCriteria}
                onPress={() => {

                }}>
                    <Text style={styles.emptyText}>ADD CRITERIA</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.search}>
                    <Text style={styles.emptyText}>SEARCH</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      paddingTop: StatusBar.currentHeight * 70 / 100,
      paddingBottom: StatusBar.currentHeight * 70 / 100,
      backgroundColor: '#fff',    
    },
  
    emptyText: {
      fontSize: 20,
      color: '#000000',
      textAlign: 'center',
    },
    
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },

    addCriteria: {
        width: "90%",
        borderRadius: 7.5,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: scalesColors.BlueRacer,
    },

    search: {
        width: "90%",
        borderRadius: 7.5,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: scalesColors.DeepGreen,
    }
});
  

export default Search;