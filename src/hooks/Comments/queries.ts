import {gql} from '@apollo/client';

export const commentsByPostIDAndCreatedAt = gql`
  query CommentsByPostIDAndCreatedAt(
    $postID: ID!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    commentsByPostIDAndCreatedAt(
      postID: $postID
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        comment
        userID
        postID
        User {
          id
          username
          image
          _version
          _lastChangedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;

export const createComment = gql`
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
      id
      comment
      userID
      postID
      Post {
        id
        nofComments
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
        User {
          id
          image
          name
          username
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;

export const updatePost = gql`
  mutation UpdatePost(
    $input: UpdatePostInput!
    $condition: ModelPostConditionInput
  ) {
    updatePost(input: $input, condition: $condition) {
      id
      nofComments
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;

export const getPost = gql`
  query GetPost($id: ID!) {
    getPost(id: $id) {
      id
      nofComments
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;

export const onNewComment = gql`
  subscription OnNewComment($postID: ID!) {
    onNewComment(postID: $postID) {
      id
      comment
      userID
      postID
      Post {
        id
        nofComments
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
        User {
          id
          image
          name
          username
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
