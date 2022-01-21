import type { NextPage } from 'next';
import axios from '../axios-instance';
import styles from '../styles/Home.module.css';
import { IUser } from '../types/user.interface';

interface Props {
  users: Array<IUser>;
  total: number;
  page: number;
  limit: number;
}

const Home: NextPage<Props> = ({ users, total, page, limit }) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>Home</main>
      <footer className={styles.footer}>Footer</footer>
    </div>
  );
};

export async function getStaticProps() {
  try {
    const { data } = await axios.get('/user');
    const { data: users, total, page, limit } = data || {};
    return {
      props: {
        users,
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
