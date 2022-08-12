import Feather from 'react-native-vector-icons/Feather';
import storage from '../utils/Storage';
import Dialog from 'react-native-dialog';
import axios from 'axios';
import uuid from 'react-native-uuid';
import RNFS from 'react-native-fs';
import React, { useState, useContext } from 'react';
import { url, UserContext } from '../utils/Storage';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { entryStyles } from '../styles/EntryStyles';
import { useNetInfo } from '@react-native-community/netinfo';
import { UploadPhotos } from '../utils/ImageUpload';

Feather.loadFont();

const Entry = ({data, allEntries, onPress, setRerender, onShareDelete}) => {
    const [share, setShare] = useState(false);
    const [target, setTarget] = useState('');
    const netInfo = useNetInfo();
    const user = useContext(UserContext);
    
    const onDelete = async () => {
        if (data?.type == 'shared') {
            if (!netInfo?.isConnected) {
                Alert.alert('Network Error', 'You need an internet connection to delete shared data entries. Please check your connection and try again later.')
                return;
            }

            onShareDelete(data?.field, user, setRerender);
            return;
        }

        if (data?.field?.photos?.length) {
            for (let photo of data.field.photos) {
                if (!photo.download) continue;
                
                try {
                    await RNFS.unlink(photo.uri)
                } catch (err) {}
            }
        }

        storage.save({
            key: 'entries',
            data: {
                fields: allEntries.filter(elem => elem !== data.field)
            }
        }).then(response => {
            setRerender(true);
        }).catch(err => {
            Alert.alert('ERROR', 'Failed to delete entry. Please try again later.');
        });
    }

    const onShare = async () => {
        if (!netInfo?.isConnected) {
            Alert.alert('Network Error', 'It seems that you are not connected to the internet. Please check your connection and try again later.')
            return;
        }

        try {
            // upload all the photos and retrieve their photoids
            let tempPhotoIds = []
            if(data?.field?.photoIds?.length) {
                tempPhotoIds = [...data.field.photoIds];
                let response = await axios({
                    method: 'post',
                    url: url  + '/duplicate',
                    data: {
                        collectionName: 'images',
                        docIds: [...tempPhotoIds]
                    }
                });
                
                tempPhotoIds = [...response.data];
            } 

            if (data?.field?.photos?.length) {
                tempPhotoIds = await UploadPhotos(data.field.photos, tempPhotoIds);
                if (!tempPhotoIds) return;
            }
            
            // replace photo ids with the new ones and undefine photos to avoid 
            // multiple source duplicate photos on same device 
            await axios({
                method: 'patch',
                url: url + '/user/shares',
                data: {
                    username: target,
                    data: {...data.field, photos: undefined, photoIds: tempPhotoIds || undefined, entryId: uuid.v4()},
                }
            });

            Alert.alert('Success', `Sent the data entry to ${target}.`);
            setShare(false);
        } catch(e) {
            Alert.alert('ERROR', e?.response?.data || e?.message || e);
            setShare(false);
        }
    }

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
                            onPress: onDelete
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
                <Dialog.Button label="Share" onPress={() => onShare(target)} />
            </Dialog.Container>

            <Text style={entryStyles.panelText}>{data?.field?.category} Entry</Text>
            <Text style={entryStyles.panelText}>{data?.field?.day}/{data?.field?.month}/{data?.field?.year} at {data?.field?.hours}:{data?.field?.mins}</Text>
        </TouchableOpacity>
    );   
};

export default Entry;