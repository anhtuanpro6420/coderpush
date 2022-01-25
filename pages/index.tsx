import { Button, Card, Col, Radio, Row, Spin } from 'antd';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { CloseOutlined, HeartOutlined } from '@ant-design/icons';
import Meta from 'antd/lib/card/Meta';
import UserCard from '../components/UserCard';
import styles from '../styles/Home.module.css';
import { IUser } from '../types/user.interface';
import {
  fetchLikedUsers,
  fetchRandomUser,
  fetchUser,
  fetchUserById,
  likeUser,
  passUser,
} from '../services/user.service';
import {
  DEFAULT_USERS_TOTAL,
  DEFAULT_USERS_PAGE,
  DEFAULT_USERS_LIMIT,
  USER_TABS,
} from '../constants/user.constant';
import Overlay from '../components/Overlay';
import { renderUserInformation } from '../utils/user.util';

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
  const [selectedTab, setSelectedTab] = useState<string>(USER_TABS.DISCOVER);
  const [likedUsers, setLikedUsers] = useState<Array<IUser>>([]);

  useEffect(() => {
    getRandomUser();
  }, []);

  useEffect(() => {
    getLikedUsers();
  }, []);

  useEffect(() => {
    getUserById(currentUser?._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRandomUser = async () => {
    if (!localStorage.getItem('userId')) {
      const userId: IUser = await fetchRandomUser();
      localStorage.setItem('userId', userId?._id);
    }
  };

  const getLikedUsers = async () => {
    const likedUsers: Array<IUser> = await fetchLikedUsers();
    setLikedUsers(likedUsers);
  };

  const getUserById = async (userId: string) => {
    if (!userId) {
      return;
    }
    const userDetail: IUser = await fetchUserById(userId);
    setCurrentUser(userDetail);
  };

  const getNextUser = async (user: IUser) => {
    const curUserIndex: number = users.findIndex(
      (userEl: IUser) => userEl._id === user._id
    );
    const nextUserIndex: number = curUserIndex + 1;
    const nextUser: IUser = users[nextUserIndex];
    if (!nextUser && shouldLoadMore()) {
      await loadMore();
    } else {
      await getUserById(nextUser?._id);
    }
  };

  const handleLike = async (user: IUser) => {
    setIsFetching(true);
    await likeUser(user._id);
    setLikedUsers([...likedUsers, user]);
    await getNextUser(user);
    setIsFetching(false);
  };

  const handleIgnore = async (user: IUser) => {
    setIsFetching(true);
    await passUser(user._id);
    await getNextUser(user);
    setIsFetching(false);
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
    await getUserById(firstUser._id);
    setTotal(fetchTotal);
    setPage(fetchPage);
  };

  const renderLikedTab = () => {
    return (
      <Row gutter={8}>
        {likedUsers.map((user: IUser) => {
          return (
            <Col key={user._id} span={12} className={styles.rowContainer}>
              <Card
                hoverable
                cover={<img alt="User picture" src={user.picture} />}
              >
                <Meta title={renderUserInformation(user)} />
              </Card>
            </Col>
          );
        })}
      </Row>
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
            onClick={() => handleIgnore(currentUser)}
          />
          <Button
            size="large"
            className={styles.btnAction}
            shape="circle"
            icon={<HeartOutlined />}
            onClick={() => handleLike(currentUser)}
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
        <Radio.Button value={USER_TABS.LIKED} className={styles.btnTab}>
          {USER_TABS.LIKED}
        </Radio.Button>
        <Radio.Button value={USER_TABS.DISCOVER} className={styles.btnTab}>
          {USER_TABS.DISCOVER}
        </Radio.Button>
        <Radio.Button value={USER_TABS.MATCHES} className={styles.btnTab}>
          {USER_TABS.MATCHES}
        </Radio.Button>
      </Radio.Group>
    );
  };

  const renderTabs = () => {
    if (selectedTab === USER_TABS.LIKED) {
      return renderLikedTab();
    } else if (selectedTab === USER_TABS.MATCHES) {
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
