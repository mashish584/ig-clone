import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  Camera,
  CameraPictureOptions,
  CameraRecordingOptions,
  CameraType,
  FlashMode,
  VideoQuality,
} from 'expo-camera';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../../theme';
import {useNavigation} from '@react-navigation/native';
import {CameraNavigationProp, UploadPostT} from '../../types/navigation';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useMediaUpload from '../../hooks/useMediaUpload';

const flashModes = [
  FlashMode.off,
  FlashMode.on,
  FlashMode.auto,
  FlashMode.torch,
];

const flashModeToIcon = {
  [FlashMode.off]: 'flash-off',
  [FlashMode.on]: 'flash-on',
  [FlashMode.auto]: 'flash-auto',
  [FlashMode.torch]: 'highlight',
};

let media: UploadPostT = {
  image: null,
  images: null,
  video: null,
};

const CameraScreen = () => {
  const navigation = useNavigation<CameraNavigationProp>();

  const {top} = useSafeAreaInsets();
  const [hasPermissions, setHasPermissions] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [flash, setFlash] = useState(FlashMode.off);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<Camera>(null);

  const {openGallery: openMediaGallery} = useMediaUpload();

  function flipCamera() {
    setCameraType(
      cameraType === CameraType.front ? CameraType.back : CameraType.front,
    );
  }

  function toggleFlash() {
    const currentIndex = flashModes.indexOf(flash);
    const nextMode = flashModes[currentIndex + 1] || flashModes[0];
    setFlash(nextMode);
  }

  async function takePicture() {
    if (!isCameraReady || !cameraRef.current || isRecording) return;

    const options: CameraPictureOptions = {
      quality: 0.5,
      base64: false,
      skipProcessing: true,
    };

    try {
      const result = await cameraRef.current.takePictureAsync(options);
      if (result.uri) {
        navigation.navigate('UploadPost', {...media, image: result.uri});
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function startRecording() {
    if (!isCameraReady || !cameraRef.current || isRecording) return;

    const options: CameraRecordingOptions = {
      quality: VideoQuality['480p'],
      maxDuration: 60,
      maxFileSize: 10 * 1024 * 1024,
      mute: false,
    };

    setIsRecording(true);

    try {
      const result = await cameraRef.current.recordAsync(options);
      if (result.uri) {
        navigation.navigate('UploadPost', {...media, video: result.uri});
      }
    } catch (error) {
      console.log({error});
    }

    setIsRecording(false);
  }

  async function stopRecording() {
    if (isRecording) {
      cameraRef.current?.stopRecording();
      setIsRecording(false);
    }
  }

  const openGallery = async () => {
    let payload = {...media};
    const assets = await openMediaGallery('mixed', 3);
    console.log(assets[0]);
    if (assets.length === 1) {
      const key = assets[0].type;
      payload[key] = assets[0].uri;
    } else if (assets.length > 1) {
      payload.images = assets.map(asset => asset.uri);
    }

    if (assets.length) {
      navigation.navigate('UploadPost', payload);
    }
  };

  useEffect(() => {
    const getPermission = async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission =
        await Camera.requestMicrophonePermissionsAsync();
      const isPermissionGranted =
        cameraPermission.status === 'granted' &&
        microphonePermission.status === 'granted';
      setHasPermissions(isPermissionGranted);
    };
    getPermission();
  }, []);

  if (hasPermissions === null) {
    return <Text>Loading...</Text>;
  }

  if (hasPermissions === false) {
    return <Text>No Access to the Camera.</Text>;
  }

  return (
    <View style={styles.page}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={cameraType}
        flashMode={flash}
        ratio="4:3"
        onCameraReady={() => setIsCameraReady(true)}
      />
      <View style={[styles.buttonContainer, {top}]}>
        <Pressable onPress={() => navigation.goBack()}>
          <MaterialIcons name="close" size={30} color={colors.white} />
        </Pressable>
        <Pressable onPress={toggleFlash}>
          <MaterialIcons
            name={flashModeToIcon[flash]}
            size={30}
            color={colors.white}
          />
        </Pressable>
        <MaterialIcons name="settings" size={30} color={colors.white} />
      </View>
      <View style={[styles.buttonContainer, {bottom: 25}]}>
        <Pressable onPress={openGallery}>
          <MaterialIcons name="photo-library" size={30} color={colors.white} />
        </Pressable>
        {isCameraReady && (
          <Pressable
            onLongPress={startRecording}
            onPressOut={stopRecording}
            onPress={takePicture}>
            <View
              style={[
                styles.circle,
                {backgroundColor: isRecording ? colors.accent : colors.white},
              ]}
            />
          </Pressable>
        )}
        <Pressable onPress={flipCamera}>
          <MaterialIcons
            name="flip-camera-ios"
            size={30}
            color={colors.white}
          />
        </Pressable>
        {/* <Pressable>
          <MaterialIcons
            name="arrow-forward-ios"
            size={30}
            color={colors.white}
          />
        </Pressable> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
  camera: {
    width: '100%',
    aspectRatio: 3 / 4,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
  },
  circle: {
    width: 75,
    height: 75,
    aspectRatio: 1,
    borderRadius: 75,
    backgroundColor: colors.white,
  },
});

export default CameraScreen;
