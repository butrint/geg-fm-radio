import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, ImageBackground, TouchableOpacity, Pressable } from 'react-native';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { Sound } from 'expo-av/build/Audio';

const AudioPlayer = () => {
    const [sound, setSound] = useState<Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        return () => {
            // Unload sound when the component unmounts
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    const playPauseSound = async () => {
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
            if (sound === null) {
                // Load and play the streaming audio from a URL
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: 'https://carina.streamerr.co:8252/stream' },
                    { shouldPlay: true } // Replace with your streaming URL
                );
                setSound(newSound);
                await newSound.playAsync();
                setIsPlaying(true);
            } else {
                if (isPlaying) {
                    await sound.pauseAsync();
                    setIsPlaying(false);
                } else {
                    await sound.playAsync();
                    setIsPlaying(true);
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Pressable style={styles.fullScreenPressable} onPress={playPauseSound}>
            <ImageBackground source={require('../../assets/geg-fm-mic.png')} style={styles.background} imageStyle={styles.image}>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.button} onPress={playPauseSound} >
                        <Ionicons
                            name={isPlaying ? 'pause' : 'play'}
                            size={32}
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
        width: 70, // Width of the button
        height: 70, // Height of the button
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
