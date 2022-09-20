import {FlatList, ViewabilityConfig, ViewToken} from 'react-native';
import FeedPost from '../../components/FeedPost';
import posts from '../../assets/data/posts.json';
import {useRef, useState} from 'react';

const viewabilityConfig: ViewabilityConfig = {
  itemVisiblePercentThreshold: 51,
};

const HomeScreen = () => {
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

  return (
    <FlatList
      data={posts}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemChange.current}
      showsVerticalScrollIndicator={false}
      renderItem={({item}) => (
        <FeedPost post={item} isVisible={item.id === currentActivePost} />
      )}
    />
  );
};

export default HomeScreen;
