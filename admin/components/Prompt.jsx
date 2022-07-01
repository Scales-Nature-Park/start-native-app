import React from 'react';
import styles from '../styles/PromptStyles';
import { View, TouchableOpacity, Text, TextInput } from 'react-native'; 

const Prompt = ({ title, inputs, listeners }) => {
    return (
      <View style={styles.promptContainer}>
        <View style={styles.promptContent}>
          <Text style={styles.promptText}>{title}</Text>
          {inputs.map((input, index) => <TextInput placeholder={input} onChangeText={listeners.inputs[index]}></TextInput>)}
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={listeners.cancel}>
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={listeners.submit}>
            <Text>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
};

export default Prompt;