import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../Comment/styles';

interface ProgressI {
  progress: number[];
}

const Progress = ({progress}: ProgressI) => {
  const filesUploadingCount = progress.length;
  const filesUploaded = progress.filter(progress => progress > 99).length;
  const isFileUploadCompleted = filesUploaded >= filesUploadingCount;

  let progressText = '';

  if (filesUploadingCount && !isFileUploadCompleted) {
    progressText += `(${filesUploadingCount} of ${filesUploaded} file uploaded) `;
  }

  if (!isFileUploadCompleted) {
    progressText += `${progress[filesUploaded]}% uploaded`;
  } else {
    progressText += 'Upload complete';
  }

  if (filesUploadingCount === 0) {
    return null;
  }

  return (
    <View style={styles.progressContainer}>
      <View style={[styles.progress, {width: `${progress}%`}]} />
      <Text style={styles.uploadText}>{progressText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    width: '100%',
    height: 25,
    backgroundColor: colors.lightGray,
    marginVertical: 10,
    borderRadius: 25,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    position: 'absolute',
    width: '10%',
    height: '100%',
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
  },
  uploadText: {
    color: colors.white,
  },
});

export default Progress;
