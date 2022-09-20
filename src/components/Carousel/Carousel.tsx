import React, {useState} from 'react';
import {
  View,
  FlatList,
  Image,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
} from 'react-native';
import DoublePress from '../DoublePressable';
import Dot from './Dot';

interface ICarousel {
  images: string[];
  onDoublePress?: () => void;
}

const Carousel = ({images, onDoublePress}: ICarousel) => {
  const {width} = useWindowDimensions();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const Parent = onDoublePress ? DoublePress : React.Fragment;
  let parentProps: Pick<ICarousel, 'onDoublePress'> = {};

  if (onDoublePress) {
    parentProps.onDoublePress = onDoublePress;
  }

  function handleMomentumScrollEnd(
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) {
    const {x} = event.nativeEvent.contentOffset;
    const slide = Math.floor(x / width);
    setActiveImageIndex(slide);
  }

  return (
    <View>
      <FlatList
        data={images}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        renderItem={({item}) => (
          <Parent {...parentProps}>
            <Image
              source={{
                uri: item,
              }}
              style={{width, aspectRatio: 1}}
            />
          </Parent>
        )}
      />
      <View style={styles.dotContainer}>
        {images.map((_, index) => (
          <Dot key={`dot_${index}`} isActive={index === activeImageIndex} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
});

export default Carousel;
