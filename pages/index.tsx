import { Button, Carousel } from 'antd';
import { CarouselRef } from 'antd/lib/carousel';
import type { NextPage } from 'next';
import { useRef, useState } from 'react';
import { CloseOutlined, HeartOutlined } from '@ant-design/icons';
import axios from '../axios-instance';
import UserCard from '../components/UserCard';
import styles from '../styles/Home.module.css';
import { IUser } from '../types/user.interface';
import { favorite, unFavorite } from '../utils/user.util';

interface Props {
  usersProp: Array<IUser>;
  total: number;
  page: number;
  limit: number;
}

const Home: NextPage<Props> = ({ usersProp, total, page, limit }) => {
  const [users, setUsers] = useState<Array<IUser>>(usersProp || []);
  const [currentUser, setCurrentUser] = useState<IUser>(users[0] || {});
  const carouselEl = useRef<CarouselRef>(null);

  const handleFavorite = (userId: string) => {
    if (carouselEl && carouselEl.current) {
      carouselEl.current.next();
      const favoritedUsers: Array<IUser> = favorite(userId, users);
      console.log(favoritedUsers);
      setUsers(favoritedUsers);
    }
  };

  const handleUnFavorite = (userId: string) => {
    if (carouselEl && carouselEl.current) {
      carouselEl.current.next();
      const unFavoritedUsers: Array<IUser> = unFavorite(userId, users);
      console.log(unFavoritedUsers);

      setUsers(unFavoritedUsers);
    }
  };

  const onBeforeChange = (from: number, to: number) => {
    const currentUser: IUser = users[to];
    setCurrentUser(currentUser);
  };

  return (
    <main className={styles.main}>
      <Carousel dots={false} ref={carouselEl} beforeChange={onBeforeChange}>
        {users.map((user: IUser) => (
          <UserCard key={user.id} user={user} />
        ))}
      </Carousel>
      <div className={styles.actionContainer}>
        <Button
          size="large"
          className={styles.btnAction}
          shape="circle"
          icon={<CloseOutlined />}
          onClick={() => handleUnFavorite(currentUser.id)}
        />
        <Button
          size="large"
          className={styles.btnAction}
          shape="circle"
          icon={<HeartOutlined />}
          onClick={() => handleFavorite(currentUser.id)}
        />
      </div>
    </main>
  );
};

export async function getStaticProps() {
  try {
    const { data } = await axios.get('/user');
    const { data: usersProp, total, page, limit } = data || {};
    return {
      props: {
        usersProp,
        total,
        page,
        limit,
      },
      revalidate: 1,
    };
  } catch (err) {
    console.log(err);
  }
}

export default Home;
