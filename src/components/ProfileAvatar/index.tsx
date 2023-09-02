import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {DEFAULT_USER_IMAGE} from '../../config';
import {User} from '../../API';
import {colors} from '../Comment/styles';
import {useEffect, useState} from 'react';
import {useMediaUpload} from '../../hooks';

interface ProfileAvatarI extends Pick<User, 'image'> {
  isSmallIcon?: boolean;
  isLoading?: boolean;
  style?: ViewStyle;
}

const ProfileAvatar = ({
  image,
  isSmallIcon,
  isLoading,
  style,
}: ProfileAvatarI) => {
  const [imageURI, setImageURI] = useState<null | string>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const {getUploadMediaUrls} = useMediaUpload();

  useEffect(() => {
    if (image) {
      (async () => {
        const urls = await getUploadMediaUrls([image]);
        if (urls?.length) {
          setImageURI(urls[0]);
        }
      })();
    }
  }, [image]);

  useEffect(() => {
    setIsImageLoading(isLoading ? true : false);
  }, [isLoading]);

  return (
    <View
      style={[
        styles.avatar,
        isSmallIcon && styles.smallAvatar,
        isImageLoading && styles.alignCenter,
        style,
      ]}>
      <Image
        source={{uri: imageURI || DEFAULT_USER_IMAGE}}
        onLoadStart={() => setIsImageLoading(true)}
        onLoadEnd={() => setIsImageLoading(false)}
        style={styles.image}
      />
      {isImageLoading && (
        <View style={[styles.loading, styles.alignCenter]}>
          <ActivityIndicator
            color={colors.primary}
            size={isSmallIcon ? 'small' : 'large'}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 100,
    aspectRatio: 1,
    borderRadius: 50,
    backgroundColor: colors.lightGray,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  alignCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallAvatar: {
    width: 50,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.white,
    opacity: 0.5,
  },
});

export default ProfileAvatar;
