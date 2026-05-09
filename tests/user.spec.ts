import { expect } from '@playwright/test';
// import { testWithAuth } from '../fixtures/testWithAuth';
import { testWithAuth } from '../fixtures/testWithAuth';
import { test } from '@playwright/test';
import { RequestHelper } from '../utils/requestHelper';

test.describe('A set of tests to verify API requests for users', () => {
  test('Get all users', async ({ request }) => {
    const api = new RequestHelper(request, process.env.BASE_URL!);
    const getAllUsersResponseJSON = await api
      .url(process.env.BASE_URL!)
      .path('/users')
      .getRequest(200);
    expect(Array.isArray(getAllUsersResponseJSON.users)).toBe(true);
    getAllUsersResponseJSON.users.forEach((userList: string) => {
      expect(userList).toHaveProperty('id');
      expect(userList).toHaveProperty('firstName');
      expect(userList).toHaveProperty('lastName');
      expect(userList).toHaveProperty('email');
      expect(userList).toHaveProperty('role');
    });
  });

  test('Login user and get tokens', async ({ request }) => {
    const api = new RequestHelper(request, process.env.BASE_URL!);
    const loginUserResponseJSON = await api
      .url(process.env.BASE_URL!)
      .path('/user/login')
      .body({
        username: process.env.BASE_USERNAME,
        password: process.env.BASE_PASSWORD,
        expiresInMins: 30,
      })
      .postRequest(200);

    expect(typeof loginUserResponseJSON).toBe('object');
    expect(loginUserResponseJSON).toHaveProperty('accessToken');
    expect(loginUserResponseJSON).toHaveProperty('id');
    expect(loginUserResponseJSON).toHaveProperty('email');
    expect(loginUserResponseJSON).toHaveProperty('firstName');
    expect(loginUserResponseJSON).toHaveProperty('lastName');
  });

  testWithAuth('Get current authenticated user', async ({ accessToken, requestHelper }) => {
    const getAllUsersResponseJSON = await requestHelper
      .url(process.env.BASE_URL!)
      .path('/user/me')
      .headers({ Authorization: `Bearer ${accessToken}` })
      .getRequest(200);

    expect(typeof getAllUsersResponseJSON).toBe('object');
    expect(getAllUsersResponseJSON).toHaveProperty('id');
    expect(getAllUsersResponseJSON).toHaveProperty('email');
    expect(getAllUsersResponseJSON).toHaveProperty('firstName');
    expect(getAllUsersResponseJSON).toHaveProperty('lastName');
    expect(getAllUsersResponseJSON).toHaveProperty('role');
  });

  test('Search users', async ({ request }) => {
    const api = new RequestHelper(request, process.env.BASE_URL!);
    const getSearchUserJSON = await api
      .url(process.env.BASE_URL!)
      .path('/users/search')
      .params({ q: 'John' })
      .getRequest(200);
    expect(Array.isArray(getSearchUserJSON.users)).toBe(true);
    getSearchUserJSON.users.forEach((userList: string) => {
      expect(userList).toHaveProperty('id');
      expect(userList).toHaveProperty('firstName');
      expect(userList).toHaveProperty('lastName');
      expect(userList).toHaveProperty('email');
      expect(userList).toHaveProperty('role');
    });
  });

  test('Filter users', async ({ request }) => {
    const api = new RequestHelper(request, process.env.BASE_URL!);
    const getFilterUsersJSON = await api
      .url(process.env.BASE_URL!)
      .path('/users/filter')
      .params({ key: 'hair.color', value: 'Brown' })
      .getRequest(200);
    expect(Array.isArray(getFilterUsersJSON.users)).toBe(true);
    getFilterUsersJSON.users.forEach((userList: string) => {
      expect(userList).toHaveProperty('id');
      expect(userList).toHaveProperty('firstName');
      expect(userList).toHaveProperty('lastName');
      expect(userList).toHaveProperty('email');
      expect(userList).toHaveProperty('role');
    });
  });

  test('Limit and skip users', async ({ request }) => {
    const api = new RequestHelper(request, process.env.BASE_URL!);
    const getLimitAndSkipUsersJSON = await api
      .url(process.env.BASE_URL!)
      .path('/users')
      .params({ limit: '5', skip: '10', select: 'firstName' })
      .getRequest(200);
    expect(Array.isArray(getLimitAndSkipUsersJSON.users)).toBe(true);
    getLimitAndSkipUsersJSON.users.forEach((userList: string) => {
      expect(userList).toHaveProperty('id');
      expect(userList).toHaveProperty('firstName');
    });
  });

  test('Sort and order users', async ({ request }) => {
    const api = new RequestHelper(request, process.env.BASE_URL!);
    const getLimitAndSkipUsersJSON = await api
      .url(process.env.BASE_URL!)
      .path('/users')
      .params({ sortBy: 'firstName', order: 'asc' })
      .getRequest(200);
    expect(Array.isArray(getLimitAndSkipUsersJSON.users)).toBe(true);
    getLimitAndSkipUsersJSON.users.forEach((userList: string) => {
      expect(userList).toHaveProperty('id');
      expect(userList).toHaveProperty('firstName');
      expect(userList).toHaveProperty('lastName');
      expect(userList).toHaveProperty('email');
      expect(userList).toHaveProperty('role');
    });
  });

  test('Get users carts by user id', async ({ request }) => {
    const api = new RequestHelper(request, process.env.BASE_URL!);
    const getUsersCartsJSON = await api
      .url(process.env.BASE_URL!)
      .path('/users/6/carts')
      .getRequest(200);

    expect(Array.isArray(getUsersCartsJSON.carts)).toBe(true);
    expect(getUsersCartsJSON.carts[0]).toHaveProperty('id', 6);
    expect(getUsersCartsJSON.carts[0]).toHaveProperty('products');
    expect(getUsersCartsJSON.carts[0]).toHaveProperty('discountedTotal');
  });

  test('Get users posts by user id', async ({ request }) => {
    const api = new RequestHelper(request, process.env.BASE_URL!);
    const getUsersPostsJSON = await api
      .url(process.env.BASE_URL!)
      .path('/users/5/posts')
      .getRequest(200);

    expect(Array.isArray(getUsersPostsJSON.posts)).toBe(true);

    if (getUsersPostsJSON.total > 0 && getUsersPostsJSON.posts.length > 0) {
      getUsersPostsJSON.posts.forEach((postProperties: string) => {
        expect(postProperties).toHaveProperty('id');
        expect(postProperties).toHaveProperty('title');
        expect(postProperties).toHaveProperty('body');
      });
    }
  });

  test('Get users todos by user id', async ({ request }) => {
    const api = new RequestHelper(request, process.env.BASE_URL!);
    const getUsersTodosJSON = await api
      .url(process.env.BASE_URL!)
      .path('/users/5/todos')
      .getRequest(200);

    expect(Array.isArray(getUsersTodosJSON.todos)).toBe(true);
  });

  test('Add, update,delete a new user', async ({ request }) => {
    const api = new RequestHelper(request, process.env.BASE_URL!);
    const addUserResponseJSON = await api
      .url(process.env.BASE_URL!)
      .path('/users/add')
      .body({
        firstName: 'Muhammad',
        lastName: 'Ovi',
        age: 250,
      })
      .postRequest(201);

    expect(typeof addUserResponseJSON).toBe('object');
    expect(addUserResponseJSON).toHaveProperty('id');
    expect(addUserResponseJSON).toHaveProperty('email');
    expect(addUserResponseJSON).toHaveProperty('firstName', 'Muhammad');
    expect(addUserResponseJSON).toHaveProperty('lastName', 'Ovi');
    expect(addUserResponseJSON).toHaveProperty('role');

    const updateUserResponseJSON = await api
      .url(process.env.BASE_URL!)
      .path(`/users/2`)
      .body({
        lastName: 'Owais',
      })
      .putRequest(200);

    expect(typeof updateUserResponseJSON).toBe('object');
    expect(updateUserResponseJSON).toHaveProperty('id', 2);
    expect(updateUserResponseJSON).toHaveProperty('email');
    expect(updateUserResponseJSON).toHaveProperty('firstName');
    expect(updateUserResponseJSON).toHaveProperty('lastName', 'Owais');
    expect(updateUserResponseJSON).toHaveProperty('role');

    const deleteUserResponseJSON = await api
      .url(process.env.BASE_URL!)
      .path(`/users/2`)
      .deleteRequest(200);

    expect(typeof deleteUserResponseJSON).toBe('object');
    expect(deleteUserResponseJSON).toHaveProperty('isDeleted', true);
  });
});
