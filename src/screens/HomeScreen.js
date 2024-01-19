import {useState, useRef, useEffect} from 'react';
import {useToast} from "react-native-toast-notifications";

import {StyleSheet, View, Platform} from 'react-native';
import {captureRef} from 'react-native-view-shot';

import ImageViewer from "../components/ImageViewer";
import Button from "../components/Button";
import CircleButton from '../components/CircleButton';
import IconButton from '../components/IconButton';
import EmojiPicker from "../components/EmojiPicker";
import EmojiList from '../components/EmojiList';
import EmojiSticker from '../components/EmojiSticker';

import domtoimage from 'dom-to-image';

import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as SplashScreen from 'expo-splash-screen';

const PlaceholderImage = require('../../assets/images/background-image.png');

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 5000);

export default function HomeScreen() {
    const toast = useToast();
    const imageRef = useRef();
    const [status, requestPermission] = MediaLibrary.usePermissions();
    const [pickedEmoji, setPickedEmoji] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showAppOptions, setShowAppOptions] = useState(false);
    const [savedImage, setSavedImage] = useState(false);

    if (status === null) {
        requestPermission();
    }

    useEffect(() => {
        Object.keys(toast).length > 0 ? toast.show('Hello World') : null;
    }, [toast]);

    const onSaveImageAsync = async () => {
        if (Platform.OS !== 'web') {
            try {
                const localUri = await captureRef(imageRef, {
                    height: 440,
                    quality: 1,
                });
                await MediaLibrary.saveToLibraryAsync(localUri);
                if (localUri) {

                    alert('Saved!');
                    setSavedImage(true);
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            try {
                const dataUrl = await domtoimage.toJpeg(imageRef.current, {
                    quality: 0.95,
                    width: 320,
                    height: 440,
                });

                let link = document.createElement('a');
                link.download = 'sticker-smash.jpeg';
                link.href = dataUrl;
                link.click();
            } catch (e) {
                console.log(e);
            }
        }
    };
    const onReset = () => {
        setShowAppOptions(false);
    };

    const onAddSticker = () => {
        setIsModalVisible(true);
    };

    const onModalClose = () => {
        setIsModalVisible(false);
    };

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            setShowAppOptions(true);
        } else {
            alert('You did not select any image.');
        }
    };

    return (
        <>
            <View style={styles.imageContainer}>
                <View ref={imageRef} collapsable={false}>
                    <ImageViewer
                        placeholderImageSource={PlaceholderImage}
                        selectedImage={selectedImage}
                    />
                    {pickedEmoji ? <EmojiSticker imageSize={40} stickerSource={pickedEmoji}/> : ""}
                </View>
            </View>
            {
                showAppOptions ? (
                    <View style={styles.optionsContainer}>
                        <View style={styles.optionsRow}>
                            <IconButton icon="refresh" label="Reset" onPress={onReset}/>
                            <CircleButton onPress={onAddSticker}/>
                            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync}/>
                        </View>
                    </View>
                ) : (
                    <View style={styles.footerContainer}>
                        <Button theme="primary" label="Choose a photo" onPress={pickImageAsync}/>
                        <Button label="Use this photo" onPress={() => setShowAppOptions(true)}/>
                    </View>
                )
            }
            <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
                <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose}/>
            </EmojiPicker>
        </>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        paddingTop: 58,
    },
    image: {
        width: 320,
        height: 440,
        borderRadius: 18,
    },
    footerContainer: {
        flex: 1 / 3,
        alignItems: 'center',
    },
    optionsContainer: {
        position: 'absolute',
        bottom: 80,
    },
    optionsRow: {
        alignItems: 'center',
        flexDirection: 'row',
    }
});
