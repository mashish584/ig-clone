import {
  ActivityIndicator,
  FlatList,
  Text,
  ViewabilityConfig,
  ViewToken,
} from 'react-native';
import {useRef, useState} from 'react';
import {useQuery} from '@apollo/client';

import FeedPost from '../../components/FeedPost';
import posts from '../../assets/data/posts.json';
import {listPosts} from './query';
import {ListPostsQuery, ListPostsQueryVariables} from '../../API';
import ApiErrorMessage from '../../components/ApiErrorMessage';

const viewabilityConfig: ViewabilityConfig = {
  itemVisiblePercentThreshold: 51,
};

const HomeScreen = () => {
  const {data, loading, error, refetch} = useQuery<
    ListPostsQuery,
    ListPostsQueryVariables
  >(listPosts);
  const [currentActivePost, setCurrentActivePost] = useState<string | null>(
    null,
  );

  const onViewableItemChange = useRef(function ViewableItemChange({
    viewableItems,
  }: {
    viewableItems: Array<ViewToken>;
  }) {
    if (viewableItems.length > 0) {
      setCurrentActivePost(viewableItems[0].item.id);
    }
  });

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <ApiErrorMessage title="Error fetching posts" message={error.message} />
    );
  }

  const posts = (data?.listPosts?.items || []).filter(post => !post?._deleted);

  return (
    <FlatList
      data={posts}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemChange.current}
      showsVerticalScrollIndicator={false}
      renderItem={({item}) => {
        return (
          item && (
            <FeedPost post={item} isVisible={item.id === currentActivePost} />
          )
        );
      }}
      onRefresh={refetch}
      refreshing={loading}
    />
  );
};

export default HomeScreen;
