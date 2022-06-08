import React, { useState } from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    Image,
    Dimensions
} from 'react-native';

const scalesColors = require('../utils/colors.json');
const { width, height } = Dimensions.get('window');

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

                <TouchableOpacity style= {styles.buttonView}
                onPress= {() => {
                }}>
                    <Text style={styles.buttonText}>Account</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    buttonView: {
        width: '100%',
        borderRadius: 10,
        height: '20%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        backgroundColor: scalesColors.DeepGreen,
    },

    iconImage: {
        width: 40,
        height: 40
    },

    buttonText: {
        fontSize: 20,
        color: '#000000',
        textAlign: 'center',
    },

    safeArea: {
        flex: 1,
        padding: StatusBar.currentHeight * 70 / 100,
        backgroundColor: '#fff',    
    },

    safeAreaDark: {
        flex: 1,
        padding: StatusBar.currentHeight * 70 / 100,
        backgroundColor: '#121212',
    },

    overlay: {
        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: 0.14,
        backgroundColor: '#fff',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',   
        flexDirection:'column',
        width: '100%',
        height: 50,
        marginTop: 20,
    },

    containerDark: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',   
        flexDirection:'column',
        width: '100%',
        height: 50,
        marginTop: 20,
    },
});

export default Home;
