import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, Text, Image, StyleSheet, Pressable} from 'react-native';
import {colors, fonts} from '../../theme';

import {User} from '../../API';
import {UserProfileNavigationProp} from '../../types/navigation';

interface IUserListItem {
  user: Pick<User, 'image' | 'name' | 'username' | 'id'>;
}

const UserListItem = ({user}: IUserListItem) => {
  const navigation = useNavigation<UserProfileNavigationProp>();

  const goToUserScreen = () => {
    navigation.navigate('UserProfile', {userId: user.id});
  };

  return (
    <Pressable onPress={goToUserScreen} style={styles.root}>
      <Image
        source={{uri: user.image || 'https://unsplash.it/100/100'}}
        style={styles.image}
      />
      <View>
        <Text>{user.name}</Text>
        <Text>{user.username}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontWeight: fonts.weight.bold,
    marginBottom: 5,
  },
  username: {
    color: colors.gray,
  },
});

export default UserListItem;
