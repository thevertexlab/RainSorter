import { useAuth } from '../hooks/useAuth';

export const Header = () => {
  const { logout } = useAuth();

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">RainSorter</h1>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
};
