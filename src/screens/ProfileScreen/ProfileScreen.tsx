import React from 'react';

import FeedGridView from '../../components/FeedGridView';
import ProfileHeader from './ProfileHeader';
import {
  ProfileNavigationProp,
  MyProfileNavigationProp,
  MyProfileRouteProp,
  UserProfileRouteProp,
} from '../../types/navigation';

import {useNavigation, useRoute} from '@react-navigation/native';
import {useQuery} from '@apollo/client';
import {getUser} from './queries';
import {GetUserQuery, GetUserQueryVariables} from '../../API';
import {ActivityIndicator} from 'react-native';
import ApiErrorMessage from '../../components/ApiErrorMessage/ApiErrorMessage';
import {useAuthContext} from '../../contexts/AuthContext';

const ProfileScreen = () => {
  const route = useRoute<UserProfileRouteProp | MyProfileRouteProp>();
  const {userId: authUserId} = useAuthContext();
  const navigation = useNavigation<
    ProfileNavigationProp | MyProfileNavigationProp
  >();

  const userId = route.params?.userId || authUserId;
  const {data, loading, error, refetch} = useQuery<
    GetUserQuery,
    GetUserQueryVariables
  >(getUser, {
    variables: {id: userId},
  });

  const user = data?.getUser;

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error || !user) {
    return (
      <ApiErrorMessage
        title="Error fetching the user"
        message={error?.message || 'User not found.'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <FeedGridView
      data={user?.Posts?.items || []}
      ListHeaderComponent={() => <ProfileHeader user={user} />}
      refetch={refetch}
      loading={loading}
    />
  );
};

export default ProfileScreen;
