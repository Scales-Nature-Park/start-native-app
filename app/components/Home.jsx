import React, { useState, useContext, useLayoutEffect } from 'react';
import styles from '../styles/HomeStyles';
import { UserContext } from '../utils/Storage';
import {
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    Image,
} from 'react-native';

const Home = ({ navigation }) => {
    const user = useContext(UserContext);
    const [dark, setDark] = useState(true);

    useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity onPress= {() => setDark(!dark)}>
                {
                    (dark) ? <Image source={require('../assets/sun.png')} style={styles.iconImage}/> :
                             <Image source={require('../assets/moon.png')} style={styles.iconImage}/>
                }
            </TouchableOpacity>
          ),
        });
    });
    
    return (
        <SafeAreaView style={(dark) ? styles.safeAreaDark : styles.safeArea}>
            <View style={(dark) ? styles.containerDark : styles.container}>
                <TouchableOpacity style={styles.buttonView}
                onPress= {() => navigation.navigate('DataEntry')}>
                    <Text style={styles.buttonText}>Data Entry</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonView}
                onPress= {() => navigation.navigate('Search')}>
                    <Text style={styles.buttonText}>Search</Text>
                </TouchableOpacity>

                <TouchableOpacity style= {styles.buttonView}
                onPress= {() => navigation.navigate('PrevEntries')}>
                    <Text style={styles.buttonText}>Saved Entries</Text>
                </TouchableOpacity>
                
                {(user?.userInfo?.id) ? 
                <TouchableOpacity style= {styles.buttonView}
                onPress= {() => navigation.navigate('Account')}>
                    <Text style={styles.buttonText}>Account</Text>
                </TouchableOpacity> : null}
            </View>
        </SafeAreaView>
    );
};

export default Home;
