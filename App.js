import {useEffect} from 'react';
import {ToastProvider} from 'react-native-toast-notifications'
import {useToast} from "react-native-toast-notifications";
import {GestureHandlerRootView} from "react-native-gesture-handler";

import {StyleSheet, StatusBar} from 'react-native';

import * as MediaLibrary from 'expo-media-library';
import * as SplashScreen from 'expo-splash-screen';

import HomeScreen from "./src/screens/HomeScreen";


SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 5000);

export default function App() {
    const toast = useToast();
    const [status, requestPermission] = MediaLibrary.usePermissions();


    if (status === null) {
        requestPermission();
    }

    useEffect(() => {
        console.log(toast);
    }, []);


    return (
        <>
            <ToastProvider>
                <GestureHandlerRootView style={styles.container}>
                    <HomeScreen/>
                </GestureHandlerRootView>
            </ToastProvider>
            <StatusBar style="light"/>
        </>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: 'center',
    }
});
