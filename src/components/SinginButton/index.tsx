import { FaGithub } from 'react-icons/fa'
import styles from './styles.module.scss'
import { FiX } from 'react-icons/fi'

export function SinginButton() {

    const isUserLogedIn = true

    return (
        isUserLogedIn ? (
        <button type="button" className={styles.SignInButton}>
            <FaGithub color="#eba417" />
            Rafael Borges
            <FiX className={styles.closeIcon} />
        </button>
        ) : (
        <button type="button" className={styles.SignInButton}>
            <FaGithub color="#04d361"/>
            Sign in with Github
        </button>
        
        )
    )
}