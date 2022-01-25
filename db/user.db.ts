import { ObjectId } from 'mongodb';
import {
  DEFAULT_USERS_LIMIT,
  DEFAULT_USERS_PAGE,
} from '../constants/user.constant';
import { IUserRequestOptions } from '../types/user.interface';
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

const getReactCollection = async () => {
  try {
    const db = await connectDb();
    const reactCollection = db.collection('reacts');
    return reactCollection;
  } catch (error) {
    console.log('Can not get reacts collection: ', error);
    throw error;
  }
};

export const getRandomUser = async () => {
  try {
    const usersCollection = await getUsersCollection();
    const users = await usersCollection.find({}).toArray();
    const randomUser = users[Math.floor(Math.random() * users.length)];
    return randomUser;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async (options: IUserRequestOptions) => {
  try {
    const { limit = DEFAULT_USERS_LIMIT, page = DEFAULT_USERS_PAGE } = options;
    const usersCollection = await getUsersCollection();
    const users = await usersCollection
      .find({})
      .skip(limit * (page - 1))
      .limit(limit)
      .toArray();
    return users || [];
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (userId: string) => {
  try {
    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    return user;
  } catch (error) {
    throw error;
  }
};

export const likeUser = async (userId: string, likedUserId: string) => {
  try {
    const reactsCollection = await getReactCollection();
    return await reactsCollection.insertOne({
      userId: new ObjectId(userId),
      reactedUserId: new ObjectId(likedUserId),
      hasLiked: true,
    });
  } catch (error) {
    throw error;
  }
};

export const passUser = async (userId: string, passedUserId: string) => {
  try {
    const reactsCollection = await getReactCollection();
    return await reactsCollection.insertOne({
      userId: new ObjectId(userId),
      reactedUserId: new ObjectId(passedUserId),
      hasLiked: false,
    });
  } catch (error) {
    throw error;
  }
};
