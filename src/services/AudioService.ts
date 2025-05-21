import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

export interface Track {
  id: string;
  url: string;
  title: string;
  artist?: string;
  artwork?: string;
}

class AudioService {
  private sound: Audio.Sound | null = null;
  private playlist: Track[] = [];
  private currentTrackIndex: number = 0;
  private isPlaying: boolean = false;
  private onPlaybackStatusUpdate: ((status: any) => void) | null = null;

  constructor() {
    this.setupAudio();
    this.setupNotifications();
  }

  private async setupAudio() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Error setting up audio:', error);
    }
  }

  private async setupNotifications() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        }),
      });

      Notifications.addNotificationResponseReceivedListener((response) => {
        const actionId = response.notification.request.content.data?.actionId;
        if (actionId === 'play_pause') {
          this.togglePlayPause();
        } else if (actionId === 'stop') {
          this.stop();
        }
      });
    }
  }

  private async togglePlayPause() {
    if (this.isPlaying) {
      await this.pause();
    } else {
      await this.play();
    }
  }

  public setPlaylist(tracks: Track[]) {
    this.playlist = tracks;
    this.currentTrackIndex = 0;
  }

  public async loadTrack(track: Track) {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: track.url },
        { shouldPlay: false },
        this.onPlaybackStatusUpdate
      );

      this.sound = sound;
    } catch (error) {
      console.error('Error loading track:', error);
    }
  }

  public async play() {
    try {
      if (!this.sound) {
        await this.loadTrack(this.playlist[this.currentTrackIndex]);
      }
      await this.sound?.playAsync();
      this.isPlaying = true;
      this.updateNotification();
    } catch (error) {
      console.error('Error playing track:', error);
    }
  }

  public async pause() {
    try {
      await this.sound?.pauseAsync();
      this.isPlaying = false;
      this.updateNotification();
    } catch (error) {
      console.error('Error pausing track:', error);
    }
  }

  public async stop() {
    try {
      await this.sound?.stopAsync();
      this.isPlaying = false;
      this.updateNotification();
    } catch (error) {
      console.error('Error stopping track:', error);
    }
  }

  public getCurrentTrack(): Track | null {
    return this.playlist[this.currentTrackIndex] || null;
  }

  private async updateNotification() {
    if (Platform.OS === 'android') {
      const currentTrack = this.getCurrentTrack();
      await Notifications.scheduleNotificationAsync({
        content: {
          title: currentTrack?.title || 'GEG FM Radio',
          body: this.isPlaying ? 'Playing' : 'Paused',
          data: { actionId: 'play_pause' },
        },
        trigger: null,
      });
    }
  }

  public async cleanup() {
    if (this.sound) {
      await this.sound.unloadAsync();
      this.sound = null;
    }
  }
}

export const audioService = new AudioService(); 