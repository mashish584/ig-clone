import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '../FeedPost/styles';

interface IVideoPlayer {
  uri: string;
  paused: boolean;
}

const VideoPlayer = ({uri, paused}: IVideoPlayer) => {
  const [isMuted, setIsMuted] = useState(true);

  function toggleMute() {
    setIsMuted(!isMuted);
  }

  return (
    <View>
      <Video
        source={{uri}}
        style={styles.video}
        resizeMode="contain"
        repeat={true}
        muted={isMuted}
        paused={paused}
      />
      <Pressable onPress={toggleMute} style={styles.muteButton}>
        <Ionicons
          name={isMuted ? 'volume-mute' : 'volume-medium'}
          size={14}
          color={colors.white}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  video: {
    width: '100%',
    aspectRatio: 1,
  },
  muteButton: {
    backgroundColor: colors.black,
    padding: 5,
    position: 'absolute',
    bottom: 10,
    right: 10,
    borderRadius: 25,
  },
});

export default VideoPlayer;
