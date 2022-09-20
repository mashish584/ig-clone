import React from 'react';
import {View, Text, FlatList} from 'react-native';
import comments from '../../assets/data/comments.json';
import Comment from '../../components/Comment';
import Input from './Input';

interface ICommentScreen {
  includeDetails?: boolean;
}

const CommentsScreen = ({includeDetails}: ICommentScreen) => {
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={comments}
        renderItem={({item}) => (
          <Comment comment={item} includeDetails={includeDetails} />
        )}
        style={{padding: 10}}
        showsVerticalScrollIndicator={false}
      />
      <Input />
    </View>
  );
};

export default CommentsScreen;
