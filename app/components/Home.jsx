import React, { useState } from 'react';
import styles from '../styles/HomeStyles';
import {
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    Image,
} from 'react-native';

const Home = ({route, navigation}) => {
    let id = (route && route.params && route.params.id) ? route.params.id : '';
    const [dark, setDark] = useState(true);

    React.useLayoutEffect(() => {
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
            <View style={styles.overlay}/>
            <View style={(dark) ? styles.containerDark : styles.container}>
                <TouchableOpacity style={styles.buttonView}
                onPress= {() => {
                    if (route.params.data) route.params.data = undefined;
                    navigation.navigate('DataEntry', route.params);
                }}>
                    <Text style={styles.buttonText}>Data Entry</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonView}
                onPress= {() => {
                    navigation.navigate('Search', route.params);
                }}>
                    <Text style={styles.buttonText}>Search</Text>
                </TouchableOpacity>

                <TouchableOpacity style= {styles.buttonView}
                onPress= {() => {
                    navigation.navigate('PrevEntries', route.params);
                }}>
                    <Text style={styles.buttonText}>Saved Entries</Text>
                </TouchableOpacity>
                
                {(route?.params?.onlineMode) ? 
                <TouchableOpacity style= {styles.buttonView}
                onPress= {() => {
                    navigation.navigate('Account', route.params);
                }}>
                    <Text style={styles.buttonText}>Account</Text>
                </TouchableOpacity> : null}
            </View>
        </SafeAreaView>
    );
};

export default Home;
