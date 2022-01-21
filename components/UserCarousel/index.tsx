import React, { FC } from 'react';
import { Carousel } from 'antd';
import { IUser } from '../../types/user.interface';
import UserCard from '../UserCard';

interface Props {
  users: Array<IUser>;
}

const UserCarousel: FC<Props> = ({ users }) => {
  return (
    <Carousel>
      {users.map((user: IUser) => (
        <UserCard key={user.id} user={user} />
      ))}
    </Carousel>
  );
};

export default UserCarousel;
