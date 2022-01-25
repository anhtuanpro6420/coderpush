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
