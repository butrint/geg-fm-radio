import { SafeAreaView, StyleSheet, Dimensions, View, Image } from 'react-native';
import AudioPlayer from './src/components/AudioPlayer';

const { width, height } = Dimensions.get('window');

export default function App () {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('./assets/geg-fm-purple-lime.png')} // Your image path
          style={styles.image}
          resizeMode="contain" // Ensures the image is scaled to fit while maintaining aspect ratio
        />
      </View>
      <AudioPlayer />
    </SafeAreaView>
  );
}

console.log("das")

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(17 21 58)'
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center', // Centers the image vertically
    alignItems: 'center', // Centers the image horizontally
  },
  image: {
    width: width * 0.9, // Image width is 90% of the screen width
    height: height * 0.5, // Image height is 50% of the screen height
    maxWidth: 300, // Set a maximum width to prevent the image from getting too large on bigger screens
    maxHeight: 300, // Set a maximum height
  },
});
