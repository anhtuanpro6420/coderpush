import { Card } from 'antd';
import React, { FC } from 'react';
import Meta from 'antd/lib/card/Meta';
import { CloseOutlined, HeartOutlined } from '@ant-design/icons';
import { IUser } from '../../types/user.interface';
import style from './UserCard.module.css';

interface Props {
  user: IUser;
}

const UserCard: FC<Props> = ({ user }) => {
  return (
    <Card
      className="user-card"
      cover={
        <img
          src={user.picture}
          alt="User picture"
          className={style.userPicture}
        />
      }
      actions={[<CloseOutlined key="ignore" />, <HeartOutlined key="like" />]}
    >
      <Meta title={user.firstName} />
    </Card>
  );
};

export default UserCard;
