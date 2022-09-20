import React from 'react';

import FeedGridView from '../../components/FeedGridView';
import ProfileHeader from './ProfileHeader';

import user from '../../assets/data/users.json';

const ProfileScreen = () => {
  return <FeedGridView data={user.posts} ListHeaderComponent={ProfileHeader} />;
};

export default ProfileScreen;
