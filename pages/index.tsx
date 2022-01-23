import { Button } from 'antd';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { CloseOutlined, HeartOutlined } from '@ant-design/icons';
import UserCard from '../components/UserCard';
import styles from '../styles/Home.module.css';
import { IUser } from '../types/user.interface';
import { fetchUser, fetchUserById } from '../services/user.service';
import {
  DEFAULT_USERS_TOTAL,
  DEFAULT_USERS_PAGE,
  DEFAULT_USERS_LIMIT,
} from '../constants/user.constant';

interface Props {
  usersProp: Array<IUser>;
  totalProp: number;
  pageProp: number;
  limitProp: number;
}

const Home: NextPage<Props> = ({
  usersProp,
  totalProp,
  pageProp,
  limitProp,
}) => {
  const [users, setUsers] = useState<Array<IUser>>(usersProp || []);
  const [total, setTotal] = useState<number>(totalProp || DEFAULT_USERS_TOTAL);
  const [page, setPage] = useState<number>(pageProp || DEFAULT_USERS_PAGE);
  const [limit, setLimit] = useState<number>(limitProp || DEFAULT_USERS_LIMIT);
  const [currentUser, setCurrentUser] = useState<IUser>(users[0] || {});

  useEffect(() => {
    getUserById(currentUser.id);
  }, [currentUser.id]);

  const getUserById = async (userId: string) => {
    const userDetail: IUser = await fetchUserById(userId);
    setCurrentUser(userDetail);
  };

  const getNextUser = async (user: IUser) => {
    const curUserIndex: number = users.findIndex(
      (userEl: IUser) => userEl.id === user.id
    );
    const nextUserIndex: number = curUserIndex + 1;
    const nextUser: IUser = users[nextUserIndex];
    if (!nextUser && shouldLoadMore()) {
      await loadMore();
    } else {
      const userDetail: IUser = await fetchUserById(nextUser.id);
      setCurrentUser(userDetail);
    }
  };

  const handleFavorite = async (user: IUser) => {
    await getNextUser(user);
  };

  const handleUnFavorite = async (user: IUser) => {
    await getNextUser(user);
  };

  const shouldLoadMore = (): boolean => limit * page < total;

  const loadMore = async () => {
    const nextPage: number = page + 1;
    const {
      users: fetchUsers,
      total: fetchTotal,
      page: fetchPage,
    } = (await fetchUser({ page: nextPage })) || {};
    setUsers(fetchUsers);
    setCurrentUser(fetchUsers[0]);
    setTotal(fetchTotal);
    setPage(fetchPage);
  };

  return (
    <main className={styles.main}>
      <UserCard user={currentUser} />
      <div className={styles.actionContainer}>
        <Button
          size="large"
          className={styles.btnAction}
          shape="circle"
          icon={<CloseOutlined />}
          onClick={() => handleUnFavorite(currentUser)}
        />
        <Button
          size="large"
          className={styles.btnAction}
          shape="circle"
          icon={<HeartOutlined />}
          onClick={() => handleFavorite(currentUser)}
        />
      </div>
    </main>
  );
};

export async function getStaticProps() {
  try {
    const { users = [], total, page, limit } = (await fetchUser()) || {};
    return {
      props: {
        usersProp: users,
        totalProp: total,
        pageProp: page,
        limitProp: limit,
      },
      revalidate: 1,
    };
  } catch (err) {
    console.log(err);
  }
}

export default Home;
