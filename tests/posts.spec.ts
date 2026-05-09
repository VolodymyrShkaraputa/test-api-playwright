import { test } from '../fixtures/api';
import { expect } from '@playwright/test';

test.describe('Tests for Posts', () => {
  test('Get all posts', async ({ api }) => {
    const getAllPostsJSON = await api.url().path('/posts').getRequest(200);

    expect(Array.isArray(getAllPostsJSON.posts)).toBe(true);
    getAllPostsJSON.posts.forEach((postsParameters: string) => {
      expect(postsParameters).toHaveProperty('id');
      expect(postsParameters).toHaveProperty('title');
      expect(postsParameters).toHaveProperty('body');
      expect(postsParameters).toHaveProperty('userId');
    });
  });

  test('Get a single post', async ({ api }) => {
    const getPostJSON = await api.url().path('/posts/1').getRequest(200);

    expect(getPostJSON).toHaveProperty('id', 1);
    expect(getPostJSON).toHaveProperty('title');
    expect(getPostJSON).toHaveProperty('body');
    expect(getPostJSON).toHaveProperty('tags');
    expect(getPostJSON).toHaveProperty('views');
  });

  test('Search posts', async ({ api }) => {
    type Post = {
      id: number;
      title: string;
      body: string;
    };

    const getSearchPostJSON = await api
      .url()
      .path('/posts/search')
      .params({ q: 'love' })
      .getRequest(200);

    expect(Array.isArray(getSearchPostJSON.posts)).toBe(true);
    getSearchPostJSON.posts.forEach((searchPost: Post) => {
      expect(searchPost).toHaveProperty('body');
      expect(searchPost.body.toLowerCase()).toContain('love');
    });
  });

  test('Limit and skip posts', async ({ api }) => {
    const getLimitAndSkipPostJSON = await api
      .url()
      .path('/posts/tags')
      .params({ limit: '10', skip: '10', select: 'title,reactions,userId' })
      .getRequest(200);

    expect(typeof getLimitAndSkipPostJSON).toBe('object');
  });

  test('Sort posts', async ({ api }) => {
    const getSortPostJSON = await api
      .url()
      .path('/posts')
      .params({ sortBy: 'title', order: 'asc' })
      .getRequest(200);

    expect(typeof getSortPostJSON).toBe('object');
  });

  test('Get all posts tags', async ({ api }) => {
    const getAllPostTagsJSON = await api
      .url()
      .path('/posts/tags')
      .getRequest(200);

    expect(typeof getAllPostTagsJSON).toBe('object');
    getAllPostTagsJSON.forEach((postsTags: string) => {
      expect(postsTags).toHaveProperty('slug');
      expect(postsTags).toHaveProperty('name');
      expect(postsTags).toHaveProperty('url');
    });
  });

  test('Get posts tag list', async ({ api }) => {
    const getAllPostTagsJSON = await api
      .url()
      .path('/posts/tag-list')
      .getRequest(200);

    expect(Array.isArray(getAllPostTagsJSON)).toBe(true);
  });

  test('Get posts by a tag', async ({ api }) => {
    const getPostByTagsJSON = await api
      .url()
      .path('/posts/tag/life')
      .getRequest(200);

    expect(typeof getPostByTagsJSON).toBe('object');

    getPostByTagsJSON.posts.forEach((tags: string) => {
      expect(tags).toHaveProperty('id');
      expect(tags).toHaveProperty('title');
      expect(tags).toHaveProperty('body');
      expect(tags).toHaveProperty('tags');
      expect(tags).toHaveProperty('tags');
    });
  });

  test('Get all posts by user id', async ({ api }) => {
    const getPostByTagsJSON = await api
      .url()
      .path('/posts/user/5')
      .getRequest(200);

    expect(typeof getPostByTagsJSON).toBe('object');
    expect(getPostByTagsJSON.posts[0]).toHaveProperty('userId', 5);
    expect(getPostByTagsJSON.posts[0]).toHaveProperty('title');
    expect(getPostByTagsJSON.posts[0]).toHaveProperty('body');
    expect(getPostByTagsJSON.posts[0]).toHaveProperty('tags');
  });

  test('Get posts comments', async ({ api }) => {
    const getPostCommentsJSON = await api
      .url()
      .path('/posts/1/comments')
      .getRequest(200);

    expect(typeof getPostCommentsJSON).toBe('object');
    expect(Array.isArray(getPostCommentsJSON.comments)).toBe(true);
    getPostCommentsJSON.comments.forEach((comments: string) => {
      expect(comments).toHaveProperty('id');
      expect(comments).toHaveProperty('body');
      expect(comments).toHaveProperty('postId');
      expect(comments).toHaveProperty('likes');
    });
  });

  test('Add a new post', async ({ api }) => {
    const createCommentsJSON = await api
      .url()
      .path('/posts/add')
      .body({ title: 'I am in love with someone.', userId: 5 })
      .postRequest(201);

    expect(createCommentsJSON).toHaveProperty('title', 'I am in love with someone.');
  });

  test('Update a post', async ({ api }) => {
    const updateCommentsJSON = await api
      .url()
      .headers({ 'Content-Type': 'application/json' })
      .path('/posts/1')
      .body({ title: 'I think I should shift to the moon' })
      .putRequest(200);

    expect(updateCommentsJSON).toHaveProperty('title', 'I think I should shift to the moon');
  });

  test('Delete a post', async ({ api }) => {
    const deleteCommentsJSON = await api
      .url()
      .path('/posts/1')
      .deleteRequest(200);

    expect(deleteCommentsJSON).toHaveProperty('isDeleted', true);
  });
});
