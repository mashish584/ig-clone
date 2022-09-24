import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, Image} from 'react-native';

import user from '../../assets/data/users.json';
import Button from '../../components/Button';
import {ProfileNavigationProp} from '../../navigation/types';
import styles from './styles';

const ProfileHeader = () => {
  const navigation = useNavigation<ProfileNavigationProp>();
  return (
    <View style={styles.root}>
      <View style={styles.headerRow}>
        {/* Profile Image */}
        <Image source={{uri: user.image}} style={styles.avatar} />
        {/* Posts,Followers,Following */}
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>98</Text>
          <Text>Posts</Text>
        </View>
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>98</Text>
          <Text>Followers</Text>
        </View>
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>98</Text>
          <Text>Follwings</Text>
        </View>
      </View>

      <Text style={styles.username}>{user.name}</Text>
      <Text>{user.bio}</Text>

      <View style={styles.actionGroup}>
        <Button
          text="Edit Profile"
          style={{flex: 0.49}}
          onPress={() => navigation.navigate('Edit Profile')}
        />
        <Button
          text="Go Back"
          style={{flex: 0.49}}
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
};

export default ProfileHeader;
