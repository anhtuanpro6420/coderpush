import { IUser } from '../types/user.interface';

export const favorite = (
  beFavoritedId: string,
  users: Array<IUser>
): Array<IUser> => {
  const userIndex: number = users.findIndex(
    (user: IUser) => user.id === beFavoritedId
  );
  const favoritedUser: IUser = { ...users[userIndex], isFavorited: true };
  const cloneUsers: Array<IUser> = [...users];
  cloneUsers[userIndex] = favoritedUser;
  return cloneUsers;
};

export const unFavorite = (
  beUnfavoritedId: string,
  users: Array<IUser>
): Array<IUser> => {
  const userIndex: number = users.findIndex(
    (user: IUser) => user.id === beUnfavoritedId
  );
  const favoritedUser: IUser = { ...users[userIndex], isFavorited: false };
  const cloneUsers: Array<IUser> = [...users];
  cloneUsers[userIndex] = favoritedUser;
  return cloneUsers;
};
