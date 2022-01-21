import { Card } from 'antd';
import React, { FC } from 'react';
import Meta from 'antd/lib/card/Meta';
import { IUser } from '../../types/user.interface';
import styles from './UserCard.module.css';

interface Props {
  user: IUser;
}

const UserCard: FC<Props> = ({ user }) => {
  return (
    <Card
      className={styles.userCard}
      cover={
        <img
          src={user.picture}
          alt="User picture"
          className={styles.userPicture}
        />
      }
    >
      <Meta title={user.firstName} />
    </Card>
  );
};

export default UserCard;
