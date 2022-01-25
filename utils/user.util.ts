import { IReaction, IUser } from '../types/user.interface';

const calculateAge = (dob: string) => {
  const ageDifMs: number = Date.now() - new Date(dob).getTime();
  const ageDate: Date = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export const renderUserInformation = (user: IUser) => {
  const { firstName, lastName, dateOfBirth } = user || {};
  return `${firstName} ${lastName}${
    (dateOfBirth && ', ' + calculateAge(dateOfBirth)) || ''
  }`;
};

export const filterLikedUsers = (users: Array<IReaction> = []) => {
  return users.map((reaction: IReaction) => ({
    ...reaction.likedUser,
  }));
};

export const filterMatchedUsers = (users: Array<IReaction> = []) => {
  return users.map((reaction: IReaction) => ({
    ...reaction.matchedUser,
  }));
};
