import { IUser } from '../types/user.interface';
import connectDb from './connection.db';

const getUsersCollection = async () => {
  try {
    const db = await connectDb();
    const usersCollection = db.collection('users');
    return usersCollection;
  } catch (error) {
    console.log('Can not get users collection: ', error);
    throw error;
  }
};

export const clearUsers = async () => {
  try {
    const usersCollection = await getUsersCollection();
    const res = await usersCollection.deleteMany({});
    return res;
  } catch (error) {
    throw error;
  }
};

export const insertUsers = async (users: Array<IUser>) => {
  try {
    const usersCollection = await getUsersCollection();
    const res = await usersCollection.insertMany(users);
    return res;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const usersCollection = await getUsersCollection();
    const users = await usersCollection.find({}).toArray();
    console.log(`users`, users);
    return users || [];
  } catch (error) {
    throw error;
  }
};
