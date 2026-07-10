import { useState } from "react";
import Header from "./components/header";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import authStyles from "./pages/auth.module.css";
import "./App.css";

const PAGES = {
  home: "home",
  login: "login",
  register: "register",
};

function AppContent() {
  const { user, ready, logout } = useAuth();
  const [page, setPage] = useState(PAGES.home);

  const goHome = () => setPage(PAGES.home);
  const goLogin = () => setPage(PAGES.login);
  const goRegister = () => setPage(PAGES.register);

  const handleAuthSuccess = () => setPage(PAGES.home);

  if (!ready) {
    return null;
  }

  let content = null;

  if (page === PAGES.login && !user) {
    content = <Login onRegister={goRegister} onSuccess={handleAuthSuccess} />;
  } else if (page === PAGES.register && !user) {
    content = <Register onLogin={goLogin} onSuccess={handleAuthSuccess} />;
  } else if (user) {
    content = (
      <main className={authStyles.home}>
        <div className={authStyles.homeCard}>
          <h1>Welcome!</h1>
          <p>
            You are logged in as{" "}
            <strong>{user.displayName || user.email}</strong>
            {user.email && user.displayName ? ` · ${user.email}` : ""}
            {user.phone ? ` · ${user.phone}` : ""}
          </p>
        </div>
      </main>
    );
  } else {
    content = (
      <main className={authStyles.home}>
        <div className={authStyles.homeCard}>
          <h1>DRIVE2</h1>
          <p>Click "Login" or "Register" in the website header</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <Header
        user={user}
        onHome={goHome}
        onLogin={goLogin}
        onRegister={goRegister}
        onLogout={() => {
          logout();
          goHome();
        }}
      />
      {content}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
