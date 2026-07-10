import styles from "./style.module.css";

function Header({ user, onLogin, onRegister, onLogout, onHome }) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button type="button" className={styles.logo} onClick={onHome}>
          DRIVE2.RU
        </button>
        <span className={styles.slogan}>Automotive social network</span>
      </div>

      <div className={styles.actions}>
        {user ? (
          <>
            <span className={styles.userLabel}>{user.email}</span>
            <button type="button" className={styles.btn} onClick={onLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <button type="button" className={styles.btn} onClick={onLogin}>
              Log in
            </button>
            <button type="button" className={styles.btn} onClick={onRegister}>
              Register
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
