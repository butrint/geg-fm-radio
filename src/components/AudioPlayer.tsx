import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, ImageBackground, TouchableOpacity, Pressable, AppState } from 'react-native';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { Sound } from 'expo-av/build/Audio';

const AudioPlayer = () => {
    const [sound, setSound] = useState<Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [appState, setAppState] = useState(AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            setAppState(nextAppState);
            if (nextAppState === 'active' && sound && isPlaying) {
                // Ensure audio continues playing when app comes to foreground
                sound.playAsync();
            }
        });

        return () => {
            subscription.remove();
            if (sound) {
                console.log("unloading sound")
                sound.unloadAsync();
            }
        };
    }, [sound, isPlaying]);

    const setupAudio = async () => {
        try {
            await Audio.setAudioModeAsync({
                staysActiveInBackground: true,
                interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
                shouldDuckAndroid: false,
                playThroughEarpieceAndroid: false,
                allowsRecordingIOS: false,
                interruptionModeIOS: InterruptionModeIOS.DoNotMix,
                playsInSilentModeIOS: true,
            });
        } catch (e) {
            console.error('Error setting up audio:', e);
        }
    };

    const playPauseSound = async () => {
        try {
            await setupAudio();
            
            if (sound === null || sound === undefined) {
                // Load and play the streaming audio from a URL
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: 'https://carina.streamerr.co:8252/stream' },
                    { 
                        shouldPlay: true,
                        progressUpdateIntervalMillis: 1000,
                        positionMillis: 0,
                        volume: 1.0,
                        rate: 1.0,
                        shouldCorrectPitch: true,
                    }
                );
                setSound(newSound);
                await newSound.playAsync();
                setIsPlaying(true);
            } else {
                if (isPlaying) {
                    console.log("pausing sound")
                    await sound.pauseAsync();
                    setIsPlaying(false);
                } else {
                    console.log("playing sound")
                    await sound.playAsync();
                    setIsPlaying(true);
                }
            }
        } catch (e) {
            console.error('Error in playPauseSound:', e);
        }
    };

    return (
        <Pressable style={styles.fullScreenPressable} onPress={playPauseSound}>
            <ImageBackground source={require('../../assets/geg-fm-mic.png')} style={styles.background} imageStyle={styles.image}>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.button} onPress={playPauseSound} >
                        <Ionicons
                            name={isPlaying ? 'pause' : 'play'}
                            size={50}
                            color="#fff" // Icon color
                        />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'contain', // or 'contain' depending on your image
        width: '100%', // Ensure the background covers the entire width
        height: '100%', // Ensure the background covers the entire height
        justifyContent: 'center', // Center the child content (AudioPlayer)
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginBottom: 20
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    image: {
        resizeMode: 'contain', // 'cover' ensures the image covers the area entirely
    },
    button: {
        width: 100, // Width of the button
        height: 100, // Height of the button
        paddingTop: 20,
        backgroundColor: 'transparent', // Transparent background
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'transparent',
    },
    fullScreenPressable: {
        flex: 1,
    },
});

export default AudioPlayer;
