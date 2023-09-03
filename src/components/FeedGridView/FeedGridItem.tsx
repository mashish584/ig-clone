import React, {useEffect, useState} from 'react';
import {View, Text, Image, ActivityIndicator, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../FeedPost/styles';
import {Post} from '../../API';
import {useMediaUpload} from '../../hooks';
import VideoPlayer from '../VideoPlayer/VideoPlayer';

interface IFeedGridItem {
  data: Pick<Post, 'image' | 'images' | 'video'>;
}

interface MediaViewI {
  isVideo: boolean;
  uri: string;
}

const MediaView = ({isVideo, uri}: MediaViewI) => {
  if (isVideo) {
    return <VideoPlayer uri={uri} paused={true} />;
  }
  return <Image source={{uri}} style={{flex: 1}} />;
};

const FeedGridItem = ({data}: IFeedGridItem) => {
  const {getUploadMediaUrls} = useMediaUpload();
  const [mediaURI, setMediaURI] = useState<null | string>(null);

  useEffect(() => {
    (async () => {
      const media = data.image || data.video || data.images?.[0];
      if (media) {
        const uri = await getUploadMediaUrls([media]);
        if (uri) {
          setMediaURI(uri[0]);
        }
      }
    })();
  }, []);

  return (
    <View style={[styles.container, !mediaURI && styles.alignCenter]}>
      {mediaURI ? (
        <MediaView isVideo={!!data.video} uri={mediaURI} />
      ) : (
        <ActivityIndicator />
      )}
      {data.images && (
        <MaterialIcons
          name="collections"
          size={16}
          color={colors.white}
          style={{position: 'absolute', top: 5, right: 5}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
    aspectRatio: 1,
    maxWidth: '33.33%',
    backgroundColor: colors.lightGray,
  },
  alignCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FeedGridItem;
