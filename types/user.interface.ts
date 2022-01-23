export interface IUser {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  picture: string;
  gender: string;
  email: string;
  dateOfBirth: string;
  phone: string;
  location: {
    street: string;
    city: string;
    state: string;
    country: string;
    timezone: string;
  };
  registerDate: string;
  updatedDate: string;
  isFavorited?: boolean;
}
export interface IUserRequestOptions {
  limit?: number;
  page?: number;
}

export interface IUsersResponse {
  limit?: number;
  page?: number;
}
