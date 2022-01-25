import axios from '../axios-instance';
import { IUserRequestOptions } from '../types/user.interface';
import { filterLikedUsers } from '../utils/user.util';

export const fetchUser = async (options?: IUserRequestOptions) => {
  try {
    const {
      data: { data },
    } = await axios.get('/users', { params: options });
    const { users, total, page, limit } = data || {};
    return { users, total, page, limit };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const fetchUserById = async (userId: string) => {
  try {
    const { data } = await axios.get(`/users/${userId}`);
    const { data: user } = data || {};
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const fetchRandomUser = async () => {
  try {
    const { data } = await axios.get(`/users/random`);
    const { data: user } = data || {};
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const likeUser = async (reactedUserId: string) => {
  try {
    const userId: string | null = localStorage.getItem('userId');
    const { data } = await axios.post(`/users/like`, { userId, reactedUserId });
    const { data: reaction } = data || {};
    return reaction;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const passUser = async (reactedUserId: string) => {
  try {
    const userId: string | null = localStorage.getItem('userId');
    return await axios.post(`/users/pass`, { userId, reactedUserId });
  } catch (error) {
    console.log(error);
  }
};

export const fetchLikedUsers = async () => {
  try {
    const userId: string | null = localStorage.getItem('userId');
    const { data } = await axios.get(`/users/liked`, {
      headers: { userid: userId as string },
    });
    const { data: likedUsers } = data || {};
    return filterLikedUsers(likedUsers);
  } catch (error) {
    console.log(error);
    return [];
  }
};
