import {
  ActivityIndicator,
  FlatList,
  ViewabilityConfig,
  ViewToken,
} from 'react-native';
import FeedPost from '../../components/FeedPost';
import posts from '../../assets/data/posts.json';
import {useEffect, useRef, useState} from 'react';
import {API, graphqlOperation} from 'aws-amplify';
import {useQuery} from '@apollo/client';
import {listPosts} from './queries';
import {ListPostsQuery, ListPostsQueryVariables} from '../../API';
import ApiErrorMessage from '../../components/ApiErrorMessage/ApiErrorMessage';

const viewabilityConfig: ViewabilityConfig = {
  itemVisiblePercentThreshold: 51,
};

const HomeScreen = () => {
  const {data, loading, error} = useQuery<
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
      <ApiErrorMessage
        title="Something went wrong while fetching posts"
        message={error?.message}
      />
    );
  }

  const posts = data?.listPosts?.items || [];

  return (
    <FlatList
      data={posts}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemChange.current}
      showsVerticalScrollIndicator={false}
      renderItem={({item}) =>
        item && (
          <FeedPost post={item} isVisible={item.id === currentActivePost} />
        )
      }
    />
  );
};

export default HomeScreen;
