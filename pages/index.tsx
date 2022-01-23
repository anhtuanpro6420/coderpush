import { Button, Radio, Spin } from 'antd';
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
import Overlay from '../components/Overlay';

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
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>('discover');

  useEffect(() => {
    getUserById(currentUser.id);
  }, []);

  const getUserById = async (userId: string) => {
    setIsFetching(true);
    const userDetail: IUser = await fetchUserById(userId);
    setIsFetching(false);
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
      await getUserById(nextUser.id);
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
    const firstUser: IUser = fetchUsers[0];
    await getUserById(firstUser.id);
    setTotal(fetchTotal);
    setPage(fetchPage);
  };

  const renderFavoritedTab = () => {
    return (
      <div className="favorited-container tab-container">
        Favorited container
      </div>
    );
  };

  const renderDiscoverTab = () => {
    return (
      <div className="discover-container tab-container">
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
      </div>
    );
  };

  const renderMatchsTab = () => {
    return (
      <div className="matchs-container tab-container">Matchs container</div>
    );
  };

  const handleTabClick = (e: any) => {
    setSelectedTab(e.target.value);
  };

  const renderButtonTabs = () => {
    return (
      <Radio.Group
        value={selectedTab}
        onChange={handleTabClick}
        className={styles.btnTabContainer}
      >
        <Radio.Button value="favorited" className={styles.btnTab}>
          Favorited
        </Radio.Button>
        <Radio.Button value="discover" className={styles.btnTab}>
          Discover
        </Radio.Button>
        <Radio.Button value="matchs" className={styles.btnTab}>
          Matchs
        </Radio.Button>
      </Radio.Group>
    );
  };

  const renderTabs = () => {
    if (selectedTab === 'favorited') {
      return renderFavoritedTab();
    } else if (selectedTab === 'matchs') {
      return renderMatchsTab();
    } else {
      return renderDiscoverTab();
    }
  };

  return (
    <>
      <main className={styles.main}>
        {renderTabs()}
        {renderButtonTabs()}
      </main>
      {isFetching && (
        <Overlay>
          <Spin className={styles.spinner} />
        </Overlay>
      )}
    </>
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
