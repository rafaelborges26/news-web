import Image from 'next/image';
import { SinginButton } from '../SinginButton'
import styles from './styles.module.scss';

export function Header() {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Image src="/images/logo.svg" alt="ig.news" width={50} height={50} />
                <nav>
                    <a className={styles.active} >Home</a>
                    <a>Posts</a>
                </nav>

                <SinginButton />
            </div>
        </header>
    )
}