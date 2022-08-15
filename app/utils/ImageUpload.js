import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import { url } from './Storage';
import { Platform, Alert } from 'react-native';

const createFormData = (photo) => {
    if (!photo) return;
    const data = new FormData();
    
    data.append('photo', {
      name: photo.uri,
      type: photo.mime || 'image/jpeg',
      uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
    });

    return data;
}

const UploadPhotos = async (images, photoIds, second = undefined) => {
    try {
        // create image forms for each photo and upload them to the server and the retrieve
        // the entry ids into the database to be linked to this data entry
        let i = 0;
        for (let photo of images) {
            i++
            let imageForm = createFormData(photo);
                            
            let photoId = undefined;
            try {
                photoId = await    
                axios.post(url + '/imageUpload', imageForm, {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'multipart/form-data',
                    }
                });
            } catch(e) {
                imageForm = undefined;
            };

            // if image upload fails, try it again. give network error alert if on second attempt
            if(!imageForm) {
                if (second) {
                    Alert.alert('ERROR', 'Process execution failure, we could not upload your images, please try again later.');
                    return undefined;
                }
                else return await UploadPhotos(images, photoIds, true);
            }
            photoIds = (photoId) ? (typeof photoIds == 'object') ? [...photoIds, photoId.data] : [photoId.data] : [...photoIds];
        }
    } catch (error) {
        Alert.alert('ERROR', error?.message || error);
        return undefined;
    }
    
    return photoIds;
}

const DownloadPhoto = async (image) => {
    try {      
        // fetch the image from the server and download it to local app storage
        let res = await RNFetchBlob.config({fileCache: true, appendExt : 'jpg'}).fetch('GET', image.uri)
        let path = 'file://' + res.path();

        image.uri = path;
        image.download = true;
    } catch (err) {
        Alert.alert('ERROR', 'Failed to download your photos. Please try again later.');
    }
}

export { UploadPhotos, DownloadPhoto };