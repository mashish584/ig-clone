import React from 'react';
import {View, Text, FlatList} from 'react-native';
import comments from '../../assets/data/comments.json';
import Comment from '../../components/Comment';
import Input from './Input';

const CommentsScreen = () => {
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={comments}
        renderItem={({item}) => (
          <Comment comment={item} includeDetails={true} />
        )}
        style={{padding: 10}}
        showsVerticalScrollIndicator={false}
      />
      <Input />
    </View>
  );
};

export default CommentsScreen;
