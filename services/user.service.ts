import axios from '../axios-instance';
import { IUserRequestOptions } from '../types/user.interface';

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
