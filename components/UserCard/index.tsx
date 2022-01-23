import { Card } from 'antd';
import React, { FC } from 'react';
import Meta from 'antd/lib/card/Meta';
import { IUser } from '../../types/user.interface';
import styles from './UserCard.module.css';
import { calculateAge } from '../../utils/user.util';

interface Props {
  user: IUser;
}

const UserCard: FC<Props> = ({ user }) => {
  const renderUserInformation = (userDetail: IUser) => {
    const { firstName, lastName, dateOfBirth } = userDetail || {};
    return `${firstName || lastName}${
      (dateOfBirth && ', ' + calculateAge(dateOfBirth)) || ''
    }`;
  };

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
      <Meta title={renderUserInformation(user)} />
    </Card>
  );
};

export default UserCard;
