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
import {ListPostsQuery, ListPostsQueryVariables} from '../../API';
import ApiErrorMessage from '../../components/ApiErrorMessage/ApiErrorMessage';

const viewabilityConfig: ViewabilityConfig = {
  itemVisiblePercentThreshold: 51,
};

const HomeScreen = () => {
  const {data, loading, error, refetch} = useQuery<
    ListPostsQuery,
    ListPostsQueryVariables
  >(listPosts, {variables: {filter: {_deleted: {ne: true}}}});
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
    />
  );
};

export default HomeScreen;
