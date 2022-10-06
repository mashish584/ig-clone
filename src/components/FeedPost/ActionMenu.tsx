import React from 'react';
import {Alert, Text} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

import {
  Menu,
  MenuTrigger,
  MenuOption,
  MenuOptions,
  renderers,
} from 'react-native-popup-menu';
import styles from './styles';
import {useMutation} from '@apollo/client';
import {deletePost} from './query';
import {DeletePostMutation, DeletePostMutationVariables, Post} from '../../API';
import {useAuthContext} from '../../context/AuthContext';

interface IActionMenu {
  post: Post;
}

const ActionMenu = ({post}: IActionMenu) => {
  const {userId} = useAuthContext();
  const isMyPost = userId === post.userID;
  const [onPostDelete] = useMutation<
    DeletePostMutation,
    DeletePostMutationVariables
  >(deletePost, {variables: {input: {id: post.id, _version: post._version}}});

  const startDeletetingPost = async () => {
    const response = await onPostDelete();
    if (response.data?.deletePost) {
    }
  };

  const onDelete = async () => {
    Alert.alert('Are you sure?', 'Deleting a post is permanent', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'Delete Post', style: 'destructive', onPress: startDeletetingPost},
    ]);
  };
  const onEdit = async () => {};

  return (
    <Menu style={styles.threeDots} renderer={renderers.SlideInMenu}>
      <MenuTrigger>
        <Entypo name="dots-three-horizontal" size={16} />
      </MenuTrigger>
      <MenuOptions>
        <MenuOption onSelect={() => Alert.alert('Report')}>
          <Text style={styles.optionText}>Report</Text>
        </MenuOption>
        {isMyPost && (
          <>
            <MenuOption onSelect={onDelete}>
              <Text style={[styles.optionText, {color: 'red'}]}>Delete</Text>
            </MenuOption>
            <MenuOption onSelect={onEdit} disabled={true}>
              <Text style={[styles.optionText]}>Edit</Text>
            </MenuOption>
          </>
        )}
      </MenuOptions>
    </Menu>
  );
};

export default ActionMenu;
