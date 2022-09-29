import React from 'react';

import FeedGridView from '../../components/FeedGridView';
import ProfileHeader from './ProfileHeader';
import {
  ProfileNavigationProp,
  MyUserProfileNavigationProp,
  MyProfileRouteProp,
  UserProfileRouteProp,
} from '../../types/navigation';

import user from '../../assets/data/users.json';
import {useNavigation, useRoute} from '@react-navigation/native';

const ProfileScreen = () => {
  const route = useRoute<UserProfileRouteProp | MyProfileRouteProp>();
  const navigation = useNavigation<
    ProfileNavigationProp | MyUserProfileNavigationProp
  >();

  const userId = route.params?.userId;

  return <FeedGridView data={user.posts} ListHeaderComponent={ProfileHeader} />;
};

export default ProfileScreen;
