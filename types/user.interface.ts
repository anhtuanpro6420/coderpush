export interface IUser {
  _id: string;
  title: string;
  firstName: string;
  lastName: string;
  picture: string;
  gender: string;
  email: string;
  dateOfBirth: string;
  phone: string;
  isFavorited?: boolean;
}
export interface IUserRequestOptions {
  limit?: number;
  page?: number;
}

export interface IReaction {
  _id: string;
  userId: string;
  reactedUserId: string;
  hasLiked: boolean;
  likedUser: IUser;
  hasMatched: boolean;
}
