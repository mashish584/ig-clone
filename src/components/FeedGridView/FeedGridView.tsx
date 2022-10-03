import React from 'react';
import {FlatList, FlatListProps, Image} from 'react-native';
import {Post} from '../../API';
import FeedGridItem from './FeedGridItem';

interface IFeedGridView<T>
  extends Pick<FlatListProps<T>, 'ListHeaderComponent'> {
  data: (Post | null)[];
}

const FeedGridView = ({data, ...props}: IFeedGridView<Post[]>) => {
  return (
    <FlatList
      data={data}
      renderItem={({item}) => {
        return (
          item && (
            <FeedGridItem data={{image: item.image, images: item.images}} />
          )
        );
      }}
      showsVerticalScrollIndicator={false}
      numColumns={3}
      style={{marginHorizontal: -1}}
      {...props}
    />
  );
};

export default FeedGridView;
