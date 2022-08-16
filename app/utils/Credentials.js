import axios from 'axios';
import { url } from './Storage';
import { Alert } from 'react-native';

/**
 * Function takes in username and password and authenticates those credentials
 * by making a get request to the /signin endpoint. Alerts the user with the results
 * accordingly. Responds with an error message if there was a problem signing in
 * or navigates to Home screen.
 */
const AuthenticateCredentials = (netInfo, username, password, navigation, user) => {
    // validate network connection
    if (!netInfo?.isConnected) {
      Alert.alert('Network Error', 'It seems that you are not connected to the internet. Please check your connection and try again later.');
      return;
    }

    axios({
      method: 'get',
      url: url + '/signin',
      params: {
        username,
        password
      }
    }).then(response => {
      if (!response?.data) throw 'Invalid credentials. Please verify you have entered the correct username and password.';

      user.setUserInfo({id: response?.data?.id || '', username: username || '', sharedEntries: (response?.data?.sharedEntries) ? [...response?.data?.sharedEntries] : []});
      navigation.navigate('Home');
    }).catch(error => {
      Alert.alert('ERROR', error.response.data || error.message);
      return;
    });
};

/**
 * Function for updating a signed in user's password, it takes in the current and 
 * new passwords, validates them against password validity criteria, authenticates
 * the current password with what's on the database then sends a put request
 * to the server to update the password.
 * @returns 
 */
const UpdatePassword = (netInfo, accountId, username, currPass, password, password2) => {
    // validate network connection
    if (!netInfo.isConnected) {
        Alert.alert('Network Error', 'It seems that you are not connected to the internet. Please check your connection and try again later.');
        return;
    }

    if (!accountId || !username) {
        Alert.alert('ERROR', 'Failed to retrieve your account information. This can be due to a lost internet connection, please login and try again.');
        return;
    }

    // validate passwords to match and be of appropriate sizes
    if (password.toString().length < 8) {
        Alert.alert('ERROR', "New password needs to be at least 8 characters.");
        return;
    }
    
    if (password.toString() !== password2.toString()) {
        Alert.alert('ERROR', "Entered passwords don't match.");
        return;
    }
    
    // vaidate new and current passwords to not match
    if (password.toString() == currPass.toString()) {
        Alert.alert('ERROR', "New password can't match your current password.");
        return;
    }

    axios({
        method: 'get',
        url: url + '/signin',
        params: {
            username: username,
            password: currPass
        }
    }).then(response => {
        RequestUpdate(currPass, password, accountId);
    }).catch(error => {
        Alert.alert('ERROR', error?.response?.data || error.message);
        return;
    });
};

/**
 * Update password helper function that takes in the new and old password, accountId 
 * and sends a put request to the /password/:accountId endpoint. Alerts the user
 * accordingly.
 */
const RequestUpdate = (currPass, password, accountId) => {
    axios({
        method: 'put',
        url: url + '/password/' + accountId,
        data: {
            currentPassword: currPass,
            newPassword: password
        }
    }).then(response => {
        Alert.alert('Success', 'Updated your password successfully.');
        return;
    }).catch(error => {
        Alert.alert('ERROR', error?.response?.data || error.message);
        return;
    });
};

/**
 * Delete a user account callback function that takes in an accountId and sends
 * a delete request to the /user/:accountId server endpoint then alerts the user
 * accordingly based on the server response 
 */
const DeleteUser = (netInfo, accountId, navigation) => {
    // validate network connection
    if (!netInfo?.isConnected) {
        Alert.alert('Network Error', 'It seems that you are not connected to the internet. Please check your connection and try again later.');
        return;
    }
    
    // verify the account id exists 
    if (!accountId) {
        Alert.alert('ERROR', 'Failed to retrieve your account information. This can be due to a lost internet connection, please login and try again.');
        return;
    }

    Alert.alert('Confirm Delete', 'Are you sure you want to delete your account?', [
        {
          text: 'Cancel',
          onPress: () => {}
        },
        {
            text: 'Confirm',
            onPress: () => {
              // request account deletion
              axios({
                  method: 'delete',
                  url: url + '/user/' + accountId,
              }).then(response => {
                  Alert.alert('Success', 'Deleted your account successfully. Return to login page.', [
                      {
                          text: 'Ok', 
                          onPress: () => navigation.navigate('Login')
                      }
                  ]);
              }).catch(error => {
                  Alert.alert('ERROR', error?.response?.data || error?.message || error);
                  return;
              });
            }
        },
    ]);
};

export { AuthenticateCredentials, UpdatePassword, DeleteUser };