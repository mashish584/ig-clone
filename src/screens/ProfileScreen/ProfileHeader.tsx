import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, Image} from 'react-native';
import {Auth} from 'aws-amplify';

import Button from '../../components/Button';
import {ProfileNavigationProp} from '../../types/navigation';
import styles from './styles';
import {User} from '../../API';
import {DEFAULT_USER_IMAGE} from '../../config';
import {useAuthContext} from '../../contexts/AuthContext';
import ProfileAvatar from '../../components/ProfileAvatar';

interface ProfileHeaderI {
  user: User;
}

const ProfileHeader = ({user}: ProfileHeaderI) => {
  const {userId} = useAuthContext();
  const navigation = useNavigation<ProfileNavigationProp>();
  navigation.setOptions({headerTitle: user.username || 'Profile'});
  return (
    <View style={styles.root}>
      <View style={styles.headerRow}>
        {/* Profile Image */}
        <ProfileAvatar image={user.image} />
        {/* Posts,Followers,Following */}
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>{user?.nofPosts}</Text>
          <Text>Posts</Text>
        </View>
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>{user?.nofFollowers}</Text>
          <Text>Followers</Text>
        </View>
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>{user?.nofFollowings}</Text>
          <Text>Followings</Text>
        </View>
      </View>

      <Text style={styles.username}>{user.username}</Text>
      <Text>{user.bio}</Text>

      {user.id === userId && (
        <View style={styles.actionGroup}>
          <Button
            text="Edit Profile"
            style={{flex: 0.49}}
            onPress={() => navigation.navigate('EditProfile')}
          />

          <Button
            text="Sign Out"
            style={{flex: 0.49}}
            onPress={() => Auth.signOut()}
          />
        </View>
      )}
    </View>
  );
};

export default ProfileHeader;
