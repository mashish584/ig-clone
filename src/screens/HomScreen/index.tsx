import {
  ActivityIndicator,
  FlatList,
  ViewabilityConfig,
  ViewToken,
} from 'react-native';
import {useRef, useState} from 'react';
import {useQuery} from '@apollo/client';

import FeedPost from '../../components/FeedPost';
import ApiErrorMessage from '../../components/ApiErrorMessage';
import {postsByDate} from './query';
import {
  ModelSortDirection,
  Post,
  PostsByDateQuery,
  PostsByDateQueryVariables,
} from '../../API';

const viewabilityConfig: ViewabilityConfig = {
  itemVisiblePercentThreshold: 51,
};

const HomeScreen = () => {
  const {data, loading, error, refetch} = useQuery<
    PostsByDateQuery,
    PostsByDateQueryVariables
  >(postsByDate, {
    variables: {type: 'POST', sortDirection: ModelSortDirection.DESC},
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

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <ApiErrorMessage title="Error fetching posts" message={error.message} />
    );
  }

  const posts = (data?.postsByDate?.items || []).filter(
    post => !post?._deleted,
  );

  return (
    <FlatList
      data={posts}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemChange.current}
      showsVerticalScrollIndicator={false}
      renderItem={({item}) => {
        return (
          item && (
            <FeedPost
              post={item as Post}
              isVisible={item.id === currentActivePost}
            />
          )
        );
      }}
      onRefresh={refetch}
      refreshing={loading}
    />
  );
};

export default HomeScreen;
