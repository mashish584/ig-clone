import React from 'react';
import {FlatList, FlatListProps, Image} from 'react-native';
import FeedGridItem from './FeedGridItem';
import {Post as PostType} from '../../API';

type Post = Pick<PostType, 'id' | 'image' | 'images' | 'description'>;

interface IFeedGridView<T>
  extends Pick<FlatListProps<T>, 'ListHeaderComponent'> {
  data: (Post | null)[];
  refetch: () => void;
  loading: boolean;
}

const FeedGridView = ({
  data,
  refetch,
  loading,
  ...props
}: IFeedGridView<Post[]>) => {
  return (
    <FlatList
      data={data}
      renderItem={({item}) => {
        return (
          <FeedGridItem data={{image: item?.image, images: item?.images}} />
        );
      }}
      showsVerticalScrollIndicator={false}
      numColumns={3}
      style={{marginHorizontal: -1}}
      onRefresh={refetch}
      refreshing={loading}
      {...props}
    />
  );
};

export default FeedGridView;
