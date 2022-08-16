import axios from 'axios';
import uuid from 'react-native-uuid';
import RNFS from 'react-native-fs';
import storage, { url, ArrayEquals } from './Storage';
import { UploadPhotos } from './ImageUpload';
import { Alert } from 'react-native';

const dataFields = require('./json/fields.json');

/**
 * Asynchronous function that fetches data fields from the server and compares
 * them with local fields then prompts the user to download the "update" or skip it
 * for now.
 */
const FetchFields = async () => {
  try {
    let fields = [];
    let localFields = [];
    
    // fetch data fields from the database
    try {
      let res = await axios({
        method: 'get',
        url: url + '/fields'
      });
      
      if (res?.data?.length > 0) fields = res.data;
      else fields = undefined;
    } catch (err) {
      fields = undefined;
    }
    
    // fetch local data fields from local mobile storage
    try {
      localFields = await storage.load({key: 'fields'});
    } catch (err) {
      // use fields.json if local data isn't found
      localFields = [...dataFields];
    }

    if (fields == undefined || ArrayEquals(localFields, fields, true)) return;
    
    // prompt user to download updated fields or skip download for now
    Alert.alert('New Update', 'A new update is currently available for download.', [
      {
        text: 'Remind Me Later',
        onPress: () => {}
      },
      {
        text: 'Download Now',
        onPress: () => {
          storage.save({
            key: 'fields',
            data: fields
          });
        }
      }
    ]);
  } catch (err) {}
};

/**
 * Asynchronous function callback for pressing the delete (x) button on an entry
 * in the Saved Entries screen. It deletes any saved images to local storage that are
 * linked to that entry and filters the entries document in local storage to delete 
 * the entry data. If the entry is shared it checks internet connection and calls
 * onShareDelete.
 */
const onDelete = async (netInfo, data, setRerender, user, allEntries) => {
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

/**
 * Asynchronous function callback for sharing an entry with a user. It checks for 
 * an internet connection, duplicates any images linked to the entry by sending
 * a post request to the /duplicate endpoint in the server then adds the entry
 * with the duplicate images to the sharedEntries list linked to the current signed in
 * user's document in the database. The reason we duplicate the images is so we can 
 * delete old shared entries when reshared without affecting the new shared entry.
 */
const onShare = async (netInfo, target, data, setShare) => {
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

/**
 * Function for deleting a shared entry. It makes a patch request to the server to
 * update the shared entries linked to the signed in user. 
 */
const onShareDelete = (field, user, setRerender) => {
  axios({
    method: 'patch',
    url: url + '/user/entry',
    data: {
      entryId: field?.entryId,
      username: user?.userInfo?.username
    }
  }).then(() => {
    // update user context to reflect the deletion success on screen
    let sharedEntries = (user?.userInfo?.sharedEntries?.length) ? user?.userInfo?.sharedEntries?.filter(elem => elem.entryId != field?.entryId) : [];
    user.setUserInfo({id: user?.userInfo?.id, username: user?.userInfo?.username, sharedEntries});
    setRerender(true);
  }).catch(err => {
    Alert.alert('ERROR', err?.response?.data || err?.message);
  });
};

export { FetchFields, onShare, onDelete, onShareDelete };