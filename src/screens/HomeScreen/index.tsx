import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  ViewabilityConfig,
  ViewToken,
} from 'react-native';
import FeedPost from '../../components/FeedPost';
import {useRef, useState} from 'react';
import {useQuery} from '@apollo/client';
import {listPosts} from './queries';
import {
  ModelSortDirection,
  PostsByDateQuery,
  PostsByDateQueryVariables,
} from '../../API';
import ApiErrorMessage from '../../components/ApiErrorMessage/ApiErrorMessage';

const viewabilityConfig: ViewabilityConfig = {
  itemVisiblePercentThreshold: 51,
};

const HomeScreen = () => {
  const isMorePostsLoading = useRef(false);
  const {data, loading, error, refetch, fetchMore} = useQuery<
    PostsByDateQuery,
    PostsByDateQueryVariables
  >(listPosts, {
    variables: {type: 'Post', sortDirection: ModelSortDirection.DESC, limit: 2},
  });

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

  const nextToken = data?.postsByDate?.nextToken;

  const loadMorePosts = async () => {
    if (!nextToken || isMorePostsLoading.current) {
      return;
    }
    isMorePostsLoading.current = true;
    await fetchMore({variables: {nextToken}});
    isMorePostsLoading.current = false;
  };

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

  const posts = data?.postsByDate?.items || [];

  return (
    <FlatList
      data={posts}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemChange.current}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{flexGrow: 1}}
      onRefresh={refetch}
      refreshing={loading}
      ListEmptyComponent={
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>No Posts.</Text>
        </View>
      }
      renderItem={({item}) =>
        item && (
          <FeedPost
            post={item}
            isVisible={item.id === currentActivePost}
            onPostUpdate={refetch}
          />
        )
      }
      onEndReached={loadMorePosts}
    />
  );
};

export default HomeScreen;
