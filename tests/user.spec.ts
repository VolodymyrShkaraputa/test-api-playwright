import { expect } from '@playwright/test';
import { test } from '../fixtures/testWithAuth';

test.describe('A set of tests to verify API requests for users', () => {
  test('Get all users', async ({ request }) => {
    const getAllUsersResponse = await request.get(`${process.env.BASE_URL}/users`);
    const getAllUsersResponseJSON = await getAllUsersResponse.json();

    expect(getAllUsersResponse.status()).toBe(200);
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
    const loginUserResponse = await request.post(`${process.env.BASE_URL}/user/login`, {
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({
        username: 'emilys',
        password: 'emilyspass',
        expiresInMins: 30,
      }),
    });
    const loginUserResponseJSON = await loginUserResponse.json();
    expect(loginUserResponse.status()).toBe(200);
    expect(typeof loginUserResponseJSON).toBe('object');
    expect(loginUserResponseJSON).toHaveProperty('accessToken');
    expect(loginUserResponseJSON).toHaveProperty('id');
    expect(loginUserResponseJSON).toHaveProperty('email');
    expect(loginUserResponseJSON).toHaveProperty('firstName');
    expect(loginUserResponseJSON).toHaveProperty('lastName');
  });

  test('Get current authenticated user', async ({ request, accessToken }) => {
    const getAllUsersResponse = await request.get(`${process.env.BASE_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const getAllUsersResponseJSON = await getAllUsersResponse.json();

    expect(getAllUsersResponse.status()).toBe(200);
    expect(typeof getAllUsersResponseJSON).toBe('object');
    expect(getAllUsersResponseJSON).toHaveProperty('id');
    expect(getAllUsersResponseJSON).toHaveProperty('email');
    expect(getAllUsersResponseJSON).toHaveProperty('firstName');
    expect(getAllUsersResponseJSON).toHaveProperty('lastName');
    expect(getAllUsersResponseJSON).toHaveProperty('role');
  });
});
