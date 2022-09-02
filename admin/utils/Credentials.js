import axios from 'axios';
import { url } from './SyncState'
import { Alert } from 'react-native';

/**
 * Function takes in username and password and authenticates those credentials
 * by making a get request to the /admin-signin endpoint. Alerts the user with the results
 * accordingly. Responds with an error message if there was a problem signing in
 * or navigates to Dashboard.
 */
const AuthenticateCredentials = (setScreen, username, password, id) => {
    axios({
      method: 'get',
      url: url + '/admin-signin',
      params: {
        username,
        password
      }
    }).then(response => {
      setScreen({val: 'Dashboard', params: {username, id}});
    }).catch(error => {
      Alert.alert('ERROR', error?.response?.data || error?.message);
      return;
    });
};

export { AuthenticateCredentials };