import {gql} from '@apollo/client';

export const listPosts = gql`
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        description
        video
        image
        images
        nofComments
        nofLikes
        userID
        createdAt
        updatedAt
        User {
          id
          name
          username
          image
        }
        Comments(limit: 2) {
          items {
            id
            comment
            User {
              id
              name
              username
            }
          }
          nextToken
          startedAt
        }
        Likes {
          items {
            id
            User {
              id
              username
            }
            _deleted
          }
          nextToken
          startedAt
        }
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
