import {useRoute} from '@react-navigation/native';
import {PostLikesRouteProp} from '../../types/navigation';
import {useQuery} from '@apollo/client';
import {likesByPost} from './queries';
import {LikesByPostQuery, LikesByPostQueryVariables} from '../../API';
import {FlatList, Text} from 'react-native';
import UserListItem from '../../components/UserListItem/UserListItem';

const PostLikesScreen = () => {
  const route = useRoute<PostLikesRouteProp>();
  const postId = route.params?.id;

  const {data, refetch, loading} = useQuery<
    LikesByPostQuery,
    LikesByPostQueryVariables
  >(likesByPost, {variables: {postID: postId, filter: {_deleted: {ne: true}}}});

  const postLikes = data?.likesByPost?.items || [];

  return (
    <FlatList
      data={postLikes}
      renderItem={({item}) => <UserListItem user={item?.User} />}
      onRefresh={refetch}
      refreshing={loading}
      ListEmptyComponent={
        <Text style={{padding: 16, textAlign: 'center', color: '#a9a9a9'}}>
          {'No user like this post.\nPull down to "refresh" the list.'}
        </Text>
      }
    />
  );
};

export default PostLikesScreen;
