import { useAuth } from '../hooks/useAuth';

export const LoginPage = () => {
  const { login } = useAuth();

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Welcome to RainSorter</h1>
        <p className="login-subtitle">
          Organize your unsorted Raindrop.io bookmarks with ease
        </p>
        <button className="login-btn" onClick={login}>
          Login with Raindrop.io
        </button>
      </div>
    </div>
  );
};
