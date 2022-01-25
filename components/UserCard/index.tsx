import { Card } from 'antd';
import React, { FC } from 'react';
import Meta from 'antd/lib/card/Meta';
import { IUser } from '../../types/user.interface';
import styles from './UserCard.module.css';
import { renderUserInformation } from '../../utils/user.util';

interface Props {
  user: IUser;
}

const UserCard: FC<Props> = ({ user }) => {
  return (
    <Card
      className={styles.userCard}
      cover={
        <img
          src={user?.picture}
          alt="User picture"
          className={styles.userPicture}
        />
      }
    >
      <Meta title={renderUserInformation(user)} />
    </Card>
  );
};

export default UserCard;
