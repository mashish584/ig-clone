import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, View} from 'react-native';
import {Post} from '../../API';
import styles from './styles';
import Carousel from '../Carousel/Carousel';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import {Storage} from 'aws-amplify';
import {useMediaUpload} from '../../hooks';

interface IContent {
  post: Pick<Post, 'image' | 'images' | 'video'>;
  isVisible: boolean;
  spacing?: number;
  runDownloadMedia?: boolean;
}

const Content = ({
  post,
  isVisible,
  spacing,
  runDownloadMedia = true,
}: IContent) => {
  const {getUploadMediaUrls} = useMediaUpload();
  const [mediaURIs, setMediaURIs] = useState<string[]>([]);

  const downloadMedia = async () => {
    let medias: string[] = [];

    if (post.image) {
      medias.push(post.image);
    }

    if (post.video) {
      medias.push(post.video);
    }

    if (post.images) {
      medias = post.images;
    }

    const mediaURIs = await getUploadMediaUrls(medias);
    setMediaURIs(mediaURIs);
  };

  useEffect(() => {
    if (runDownloadMedia) {
      downloadMedia();
    }
  }, []);

  const isMediaAvailable = post.image || post.video || post.images?.length;
  const isFileReadyToLoad =
    (runDownloadMedia && mediaURIs.length) ||
    (!runDownloadMedia && isMediaAvailable);

  if (isFileReadyToLoad) {
    if (post.image) {
      return (
        <Image
          source={{
            uri: mediaURIs[0] || post.image,
          }}
          style={styles.image}
        />
      );
    } else if (post.images) {
      return (
        <Carousel
          images={mediaURIs?.length ? mediaURIs : post.images}
          spacing={spacing}
        />
      );
    } else if (post.video) {
      return <VideoPlayer uri={mediaURIs[0] || post.video} paused={false} />;
    }
  }

  return (
    <View>
      <ActivityIndicator />
    </View>
  );
};

export default Content;
