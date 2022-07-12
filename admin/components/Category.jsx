import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { categoryStyles } from '../styles/CategoryStyles';

const Category = ({ data, onEdit, onDelete }) => {
    return (
        <View style={categoryStyles.container}>
            <View style={categoryStyles.textContainer}>
                <Text style={categoryStyles.text}>{data}</Text>
            </View>
            <TouchableOpacity onPress={() => onEdit(data)} style={categoryStyles.editButton}>
                <Text style={categoryStyles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(data)} style={categoryStyles.deleteButton}>
                <Text style={categoryStyles.buttonText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );   
};

export default Category;