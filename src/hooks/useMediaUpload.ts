import {useCallback, useState} from 'react';
import {Storage} from 'aws-amplify';
import {
  ImageLibraryOptions,
  MediaType,
  launchImageLibrary,
} from 'react-native-image-picker';

import {generateRandomID} from '../util';

const MEDIA_QUALITY = 0.8;

type Media = {
  uri: string;
  type: 'image' | 'video';
};

const useMediaUpload = () => {
  const [progress, setProgress] = useState<number[]>([]);
  const [isMediaUploading, setIsMediaUploading] = useState(false);

  const openGallery = useCallback(
    async (type: MediaType, selectionLimit: number) => {
      let medias: Media[] = [];
      const pickerConfig: ImageLibraryOptions = {
        mediaType: type,
        selectionLimit: selectionLimit,
        quality: MEDIA_QUALITY,
        videoQuality: 'medium',
      };

      if (selectionLimit === 1) {
        delete pickerConfig.selectionLimit;
      }

      const images = await launchImageLibrary(pickerConfig);
      if (images.assets?.length) {
        images.assets?.map(asset => {
          if (asset.uri) {
            medias.push({
              uri: asset.uri,
              type: asset.type?.startsWith('video') ? 'video' : 'image',
            });
          }
        });
      }

      return medias;
    },
    [],
  );

  const uploadMedia = useCallback(
    async (
      uri: string,
      userId: string,
      index: number,
      isMultipleUpload = false,
    ) => {
      try {
        if (!isMultipleUpload) {
          setIsMediaUploading(true);
        }
        const response = await fetch(uri);
        const blob = await response.blob();
        const extension = uri?.split('.').pop();
        const fileId = generateRandomID(25);
        const fileName = `post-${userId}-${fileId}.${extension}`;
        const s3Response = await Storage.put(fileName, blob, {
          progressCallback: progress => {
            const uploadProgress = progress.loaded / progress.total;
            setProgress(prev => {
              const progress = [...prev];
              progress[index] = Math.floor(uploadProgress * 100);
              return progress;
            });
          },
        });
        if (!isMultipleUpload) {
          setIsMediaUploading(false);
        }
        return s3Response.key;
      } catch (err) {
        setIsMediaUploading(false);
        console.log(
          `Error while uploading media to S3 bucket: ${(err as Error).message}`,
        );
      }
    },
    [],
  );

  const uploadMultipleMedias = useCallback(
    async (medias: string[], userId: string) => {
      try {
        let mediaKeys = [];
        setIsMediaUploading(true);
        setProgress(new Array(medias.length).fill(0));
        for (let i = 0; i < medias.length; i++) {
          const mediaKey = await uploadMedia(medias[i], userId, i, true);
          if (mediaKey) {
            mediaKeys.push(mediaKey);
          }
        }
        setIsMediaUploading(false);
        return mediaKeys;
      } catch (err) {
        console.log(
          `Error while uploading multiple medias to S3 bucket: ${
            (err as Error).message
          }`,
        );
      }
    },
    [],
  );

  const getUploadMediaUrls = useCallback(async (medias: string[]) => {
    try {
      let urls: string[] = [];
      for (let i = 0; i < medias.length; i++) {
        const url = await Storage.get(medias[0]);
        urls.push(url);
      }
      return urls;
    } catch (err) {
      console.log(`Error while getting media ${(err as Error).message}`);
    }
  }, []);

  return {
    openGallery,
    uploadMedia,
    uploadMultipleMedias,
    getUploadMediaUrls,
    isMediaUploading,
    progress,
  };
};

export default useMediaUpload;
