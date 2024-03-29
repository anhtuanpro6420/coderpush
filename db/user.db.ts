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

export const getAllUsers = async () => {
  try {
    const usersCollection = await getUsersCollection();
    const users = await usersCollection.find({}).toArray();
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
    if (userId === likedUserId) {
      throw new Error('Can not like yourself');
    }
    const reactsCollection = await getReactCollection();
    const hasLikedThisUser = await reactsCollection.findOne({
      userId: new ObjectId(userId),
      reactedUserId: new ObjectId(likedUserId),
      hasLiked: true,
    });
    if (hasLikedThisUser) {
      throw new Error('User was already liked');
    }
    const userHasLikedYou = await reactsCollection.findOne({
      userId: new ObjectId(likedUserId),
      reactedUserId: new ObjectId(userId),
      hasLiked: true,
    });
    if (userHasLikedYou) {
      const { insertedId } = await reactsCollection.insertOne({
        userId: new ObjectId(userId),
        reactedUserId: new ObjectId(likedUserId),
        hasLiked: true,
        hasMatched: true,
      });
      await reactsCollection.findOneAndUpdate(
        {
          userId: new ObjectId(likedUserId),
          reactedUserId: new ObjectId(userId),
          hasLiked: true,
          hasMatched: false,
        },
        { $set: { hasMatched: true } }
      );
      return insertedId;
    }
    const { insertedId } = await reactsCollection.insertOne({
      userId: new ObjectId(userId),
      reactedUserId: new ObjectId(likedUserId),
      hasLiked: true,
      hasMatched: false,
    });
    return insertedId;
  } catch (error) {
    console.log(error);
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

export const getLikedUsers = async (userId: string) => {
  try {
    const reactsCollection = await getReactCollection();
    const likedUsers = await reactsCollection
      .aggregate([
        { $match: { userId: new ObjectId(userId), hasLiked: true } },
        {
          $lookup: {
            from: 'users',
            localField: 'reactedUserId',
            foreignField: '_id',
            as: 'likedUser',
          },
        },
        { $unwind: '$likedUser' },
      ])
      .toArray();
    return likedUsers;
  } catch (error) {
    throw error;
  }
};

export const getReactById = async (reactId: ObjectId | string) => {
  try {
    const reactsCollection = await getReactCollection();
    return await reactsCollection.findOne({
      _id: reactId,
    });
  } catch (error) {
    throw error;
  }
};

export const getMatchedUsers = async (userId: string) => {
  try {
    const reactsCollection = await getReactCollection();
    const matchedUsers = await reactsCollection
      .aggregate([
        { $match: { userId: new ObjectId(userId), hasMatched: true } },
        {
          $lookup: {
            from: 'users',
            localField: 'reactedUserId',
            foreignField: '_id',
            as: 'matchedUser',
          },
        },
        { $unwind: '$matchedUser' },
      ])
      .toArray();
    return matchedUsers;
  } catch (error) {
    throw error;
  }
};
