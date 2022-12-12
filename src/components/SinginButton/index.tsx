import { FaGithub } from 'react-icons/fa'
import styles from './styles.module.scss'
import { FiX } from 'react-icons/fi'
import { signIn, signOut, useSession } from 'next-auth/react'


export function SinginButton() {

    const {data: session} = useSession()

    console.log(session, 'user')

    return (
        session ? (
        <button type="button" className={styles.SignInButton} onClick={() => signOut()}>
            <FaGithub color="#04d361" />
            { session.user?.name }
            <FiX className={styles.closeIcon} />
        </button>
        ) : (
        <button type="button" className={styles.SignInButton} onClick={() => signIn('github')} >
            <FaGithub color="#eba417"/>
            Sign in with Github
        </button>
        
        )
    )
}