import {Alert, StyleSheet, Text} from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
import Entypo from 'react-native-vector-icons/Entypo';
import {DeletePostMutation, DeletePostMutationVariables, Post} from '../../API';
import {useMutation} from '@apollo/client';
import {deletePost} from './queries';
import {onDeletePost} from '../../graphql/subscriptions';
import {useAuthContext} from '../../contexts/AuthContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {FeedNavigationProp} from '../../types/navigation';

interface PostMenu {
  post: Pick<Post, 'id' | '_version' | 'userID'>;
  onDeleteCallback: () => void;
}

const PostMenu = ({post, onDeleteCallback}: PostMenu) => {
  const navigation = useNavigation<FeedNavigationProp>();
  const {bottom} = useSafeAreaInsets();
  const {userId} = useAuthContext();
  const isMyPost = userId === post.userID;

  const [doDeletePost] = useMutation<
    DeletePostMutation,
    DeletePostMutationVariables
  >(deletePost, {
    variables: {
      input: {
        id: post.id,
        _version: post._version,
      },
    },
  });

  const onReport = () => {};
  const onDelete = async () => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await doDeletePost();
          onDeleteCallback?.();
        },
      },
    ]);
  };
  const onEdit = () => navigation.navigate('UpdatePost', {id: post.id});

  return (
    <Menu renderer={renderers.SlideInMenu} style={styles.threeDots}>
      <MenuTrigger>
        <Entypo name="dots-three-horizontal" size={16} />
      </MenuTrigger>
      <MenuOptions optionsContainerStyle={{paddingBottom: bottom}}>
        <MenuOption onSelect={onReport}>
          <Text style={styles.optionText}>Report</Text>
        </MenuOption>
        {isMyPost && (
          <>
            <MenuOption onSelect={onDelete}>
              <Text style={[styles.optionText, {color: 'red'}]}>Delete</Text>
            </MenuOption>
            <MenuOption onSelect={onEdit}>
              <Text style={styles.optionText}>Edit</Text>
            </MenuOption>
          </>
        )}
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  threeDots: {
    marginLeft: 'auto',
  },
  optionText: {
    textAlign: 'center',
    fontSize: 20,
    padding: 10,
  },
});

export default PostMenu;
