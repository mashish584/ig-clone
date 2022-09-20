import React from 'react';
import {View, Text, Image} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {IPost} from '../../types/model';
import {colors} from '../FeedPost/styles';

interface IFeedGridItem {
  data: Pick<IPost, 'image' | 'images'>;
}

const FeedGridItem = ({data}: IFeedGridItem) => {
  return (
    <View style={{flex: 1, padding: 1, aspectRatio: 1, maxWidth: '33.33%'}}>
      <Image source={{uri: data.image || data.images?.[0]}} style={{flex: 1}} />
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

export default FeedGridItem;
