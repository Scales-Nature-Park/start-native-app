import Feather from 'react-native-vector-icons/Feather';
import Dialog from 'react-native-dialog';
import React, { useState, useContext } from 'react';
import { onShare, onDelete } from '../utils/Fields';
import { UserContext } from '../utils/Storage';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { entryStyles } from '../styles/EntryStyles';
import { useNetInfo } from '@react-native-community/netinfo';

Feather.loadFont();

const Entry = ({data, allEntries, onPress, setRerender, onShareDelete}) => {
    const [share, setShare] = useState(false);
    const [target, setTarget] = useState('');
    const netInfo = useNetInfo();
    const user = useContext(UserContext);

    return (
        <TouchableOpacity style={(data.type == 'saved' || data.type == 'submitted') ? (data?.field?.valid || data.type == 'submitted') ? entryStyles.container : entryStyles.containe2 : entryStyles.container3} onPress={onPress}>
            <View style={entryStyles.buttonContainer}>
                {(netInfo?.isConnected && user?.userInfo?.id) ?
                <TouchableOpacity style={entryStyles.share} onPress={() => setShare(true)}>
                    <Feather name="share" size={25} color='blue' />
                </TouchableOpacity> : null}

                {allEntries && 
                <TouchableOpacity style={entryStyles.delete} onPress={() => {
                    Alert.alert('Confirm Deletion', 'Are you sure you want to delete this data entry?', [
                        {
                            text: 'Cancel', 
                            onPress: () => {}
                        },
                        {
                            text: 'Confirm',
                            onPress: () => onDelete(netInfo, data, setRerender, user, allEntries)
                        }
                    ]);
                }}>
                    <Feather name="x" size={30} color='red' />
                </TouchableOpacity>}
            </View>
             
            <Dialog.Container visible={share}>
                <Dialog.Title>Share Entry</Dialog.Title>
                <Dialog.Description>
                    Enter the user's username who you want to share the data entry with. 
                </Dialog.Description>
                <Dialog.Input onChangeText={text => setTarget(text)} />
                <Dialog.Button label="Cancel" onPress={() => setShare(false)}/>
                <Dialog.Button label="Share" onPress={() => onShare(netInfo, target, data, setShare)} />
            </Dialog.Container>

            <Text style={entryStyles.panelText}>{data?.field?.category} Entry</Text>
            <Text style={entryStyles.panelText}>{data?.field?.day}/{data?.field?.month}/{data?.field?.year} at {data?.field?.hours}:{data?.field?.mins}</Text>
        </TouchableOpacity>
    );   
};

export default Entry;