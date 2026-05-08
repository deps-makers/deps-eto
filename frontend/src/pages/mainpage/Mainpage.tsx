import { useLocation } from 'react-router';

import logoSrc from '@/assets/placeholder-logo.png';

import AuthPrompt from './auth/AuthPrompt';
import SignInForm from './auth/SignInForm';
import SignUpForm from './auth/SignUpForm';
import styles from './Mainpage.module.scss';

const Mainpage = () => {
  const { pathname } = useLocation();

  return (
    <>
      <div className={styles.backdrop}>
        <div className={styles.star1} />
        <div className={styles.star2} />
        <div className={styles.star3} />
      </div>
      <main>
        <section className={styles.intro}>
          <img src={logoSrc} alt='Logo' className={styles.logo} />
          <p className={styles.description}>
            <span className={styles.welcome}>welcome to</span> {import.meta.env.VITE_DOMAIN_NAME!}
          </p>
          <div className={styles.hrWrapper}>
            <hr />
          </div>
          {pathname === '/' && <AuthPrompt />}
          {pathname === '/signup' && <SignUpForm />}
          {pathname === '/signin' && <SignInForm />}
        </section>
      </main>
      <footer className={styles.footer}>
        powered by{' '}
        <a href='https://github.com/deps-makers/deps-eto' target='_blank' rel='noreferrer'>
          Eto
        </a>
      </footer>
    </>
  );
};

export default Mainpage;
