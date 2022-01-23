import axios from '../axios-instance';
import { IUserRequestOptions } from '../types/user.interface';

export const fetchUser = async (options?: IUserRequestOptions) => {
  try {
    const { data } = await axios.get('/user', { params: options });
    const { data: users, total, page, limit } = data || {};
    return { users, total, page, limit };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const fetchUserById = async (userId: string) => {
  try {
    const { data: user } = await axios.get(`/user/${userId}`);
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};
