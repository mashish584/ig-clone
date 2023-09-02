import React, {useState} from 'react';
import {
  View,
  FlatList,
  Image,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
  Dimensions,
} from 'react-native';
import DoublePress from '../DoublePressable';
import Dot from './Dot';

const IMAGE_WIDTH = Dimensions.get('screen').width;

interface ICarousel {
  images: string[];
  spacing?: number;
  onDoublePress?: () => void;
}

const Carousel = ({images, onDoublePress, spacing = 0}: ICarousel) => {
  const {width} = useWindowDimensions();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const Parent = onDoublePress ? DoublePress : View;
  let parentProps: Pick<ICarousel, 'onDoublePress'> = {};

  if (onDoublePress) {
    parentProps.onDoublePress = onDoublePress;
  }

  function handleMomentumScrollEnd(
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) {
    const {x} = event.nativeEvent.contentOffset;
    const slide = Math.floor((x + spacing * 2) / width);

    setActiveImageIndex(slide);
  }

  const imageContainerWidth = spacing ? IMAGE_WIDTH - spacing * 2 : IMAGE_WIDTH;

  return (
    <>
      <FlatList
        data={images}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        renderItem={({item}) => (
          <Parent
            {...parentProps}
            onStartShouldSetResponder={() => true}
            style={{
              width: imageContainerWidth,
              aspectRatio: 1,
            }}>
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
    </>
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
