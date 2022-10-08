import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {RouteProp} from '@react-navigation/native';

export type RootNavigatorParamList = {
  Auth: undefined;
  Home: undefined;
  EditProfile: undefined;
  Comments: {postId: string};
};

export type BottomTabNavigatorParamList = {
  HomeStack: undefined;
  Search: undefined;
  Upload: undefined;
  Notifications: undefined;
  ProfileStack: undefined;
};

export type SearchTabNavigatorParamList = {
  Users: undefined;
  Posts: undefined;
};

export type HomeStackNavigatorParamList = {
  Feed: undefined;
  UserProfile: {userId: string};
  UpdatePost: {id: string};
  PostLikes: {id: string};
};

export type PostLikesRoute = RouteProp<
  HomeStackNavigatorParamList,
  'PostLikes'
>;

export type UpdatePostRouteProp = RouteProp<
  HomeStackNavigatorParamList,
  'UpdatePost'
>;

export type ProfileStackNavigatorParamList = {
  Profile: undefined;
  'Edit Profile': undefined;
};

export type UploadStackNavigatorParamList = {
  Camera: undefined;
  Create: {
    image?: string;
    images?: string[];
    video?: string;
  };
};

export type CommentRouteProp = RouteProp<RootNavigatorParamList, 'Comments'>;

export type CameraNavigatorProp = NativeStackNavigationProp<
  UploadStackNavigatorParamList,
  'Camera'
>;

export type CreatePostNavigationProp = NativeStackNavigationProp<
  UploadStackNavigatorParamList,
  'Create'
>;

export type CreatePostRouteProp = RouteProp<
  UploadStackNavigatorParamList,
  'Create'
>;

export type MyUserProfileNavigationProp = BottomTabNavigationProp<
  BottomTabNavigatorParamList,
  'ProfileStack'
>;

export type UserProfileNavigationProp = NativeStackNavigationProp<
  HomeStackNavigatorParamList,
  'UserProfile'
>;

export type MyProfileRouteProp = RouteProp<
  BottomTabNavigatorParamList,
  'ProfileStack'
>;

export type UserProfileRouteProp = RouteProp<
  HomeStackNavigatorParamList,
  'UserProfile'
>;

export type FeedNavigationProp = NativeStackNavigationProp<
  HomeStackNavigatorParamList,
  'Feed'
>;

export type ProfileNavigationProp = NativeStackNavigationProp<
  ProfileStackNavigatorParamList,
  'Profile'
>;

export type AuthStackNavigatorParamList = {
  'Sign in': undefined;
  'Sign up': undefined;
  'Confirm email': {username?: string};
  'Forgot password': undefined;
  'New password': undefined;
};

// Auth stack navigator types
export type SignInNavigationProp = NativeStackNavigationProp<
  AuthStackNavigatorParamList,
  'Sign in'
>;

export type SignUpNavigationProp = NativeStackNavigationProp<
  AuthStackNavigatorParamList,
  'Sign up'
>;

export type ConfirmEmailNavigationProp = NativeStackNavigationProp<
  AuthStackNavigatorParamList,
  'Confirm email'
>;
export type ConfirmEmailRouteProp = RouteProp<
  AuthStackNavigatorParamList,
  'Confirm email'
>;

export type ForgotPasswordNavigationProp = NativeStackNavigationProp<
  AuthStackNavigatorParamList,
  'Forgot password'
>;

export type NewPasswordNavigationProp = NativeStackNavigationProp<
  AuthStackNavigatorParamList,
  'New password'
>;
