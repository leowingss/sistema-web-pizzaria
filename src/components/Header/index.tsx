import styles from './styles.module.scss';
import Link from 'next/link';

import { FiLogOut } from 'react-icons/fi';
import { useContext } from 'react';

import { AuthContext } from '../../contexts/AuthContext';

export function Header() {


    const { signOut } = useContext(AuthContext);

    function handleSignOut() {
        signOut();
    }

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href='/dashboard'>
                    <img src='/logo.svg' width={190} height={60} />
                </Link>

                <nav className={styles.menuNav}>
                    <Link legacyBehavior href='/category'>
                        <a>Categoria</a>
                    </Link>

                    <Link legacyBehavior href='/product'>
                        <a>Cardápio</a>
                    </Link>

                    <button onClick={handleSignOut}>
                        <FiLogOut size={24} color="#FFF" />
                    </button>
                </nav>
            </div>
        </header>
    )
}