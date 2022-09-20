import React from 'react';
import {FlatList, FlatListProps, Image} from 'react-native';
import {IPost} from '../../types/model';
import FeedGridItem from './FeedGridItem';

type Post = Pick<IPost, 'id' | 'image' | 'images' | 'description'>;

interface IFeedGridView<T>
  extends Pick<FlatListProps<T>, 'ListHeaderComponent'> {
  data: Post[];
}

const FeedGridView = ({data, ...props}: IFeedGridView<Post[]>) => {
  return (
    <FlatList
      data={data}
      renderItem={({item}) => {
        return <FeedGridItem data={{image: item.image, images: item.images}} />;
      }}
      showsVerticalScrollIndicator={false}
      numColumns={3}
      style={{marginHorizontal: -1}}
      {...props}
    />
  );
};

export default FeedGridView;
