import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        Home
      </main>
      <footer className={styles.footer}>
        Footer
      </footer>
    </div>
  )
}

export default Home
