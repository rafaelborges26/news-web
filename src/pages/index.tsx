import Head from 'next/head'
import Image from 'next/image';
import styles from './home.module.scss';
import { SubscribeButton } from '../components/SubscribeButton'

export default function Home() {
  return (
    <>
      <Head>Home | ig.news</Head>
      <main className={styles.contentContainer} >
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>Wews about the <span>React</span> world.</h1>
          <p>Get access to all the publications <br/>
          <span>for $9.98 month</span>
          </p>
          <SubscribeButton />
        </section>
        <Image src="/images/avatar.svg" alt="Girl coding" width={400} height={400} />
      </main>
    </>
  )
}
