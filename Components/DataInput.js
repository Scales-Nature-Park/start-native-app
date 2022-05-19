import React, { useState } from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from 'react-native';

const DataInput = () => {
    let dateObj = new Date(),
        day = dateObj.getDate(), 
        month = dateObj.getMonth(),
        year = dateObj.getFullYear();

    const [currDay, setDay] = useState(day);
    const [currMonth, setMonth] = useState(month);
    const [currYear, setYear] = useState(year);
    const [species, setSpecies] = useState('');

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.inputView}>
                        <TextInput
                        style={styles.TextInput}
                        placeholder='Day'
                        placeholderTextColor='#000000'
                        onChangeText={(currDay) => setDay(currDay)}
                        />
                    </View>
     
                    <View style={styles.inputView}>
                        <TextInput
                        style={styles.TextInput}
                        placeholder='Month'
                        placeholderTextColor='#000000'
                        onChangeText={(currMonth) => setMonth(currMonth)}
                        />
                    </View>

                    <View style={styles.inputView}>
                        <TextInput
                        style={styles.TextInput}
                        placeholder='Day'
                        placeholderTextColor='#000000'
                        onChangeText={(currYear) => setYear(currYear)}
                        />
                    </View>

                    <TouchableOpacity style={styles.submitBtn}>
                        <Text style={styles.submitText}>submit</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: StatusBar.currentHeight * 70 / 100,
        paddingBottom: StatusBar.currentHeight * 70 / 100,
        backgroundColor: '#fff',    
    },

    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
   
    image: {
      marginBottom: 40,
    },
   
    inputView: {
      backgroundColor: '#79f79b',
      borderRadius: 30,
      width: '33%',
      height: 45,
      marginBottom: 20,
      alignItems: 'center',
    },
   
    TextInput: {
      height: 50,
      flex: 1,
      padding: 10,
      marginLeft: 20,
      color:'#000000',
    },
   
    forgot_button: {
      height: 30,
      marginBottom: 30,
      color: '#000000 ',
    },
   
    submitBtn: {
      width: '80%',
      borderRadius: 25,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 40,
      backgroundColor: '#089c2f',
    },
});

export default DataInput;