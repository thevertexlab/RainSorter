import { useEffect, useState } from 'react';
import { useOAuthCallback } from '../hooks/useOAuthCallback';
import { Loader } from '../components/Loader';
import { ErrorMessage } from '../components/ErrorMessage';

export const CallbackPage = () => {
  const [code, setCode] = useState(null);

  useEffect(() => {
    console.log('📍 Callback page loaded');
    console.log('🔗 Full URL:', window.location.href);
    console.log('🔍 Search params:', window.location.search);

    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');

    console.log('✅ Auth code found:', authCode ? 'Yes' : 'No');
    if (authCode) {
      console.log('🔑 Code:', authCode);
    } else {
      console.error('❌ No code in URL. All params:', Object.fromEntries(urlParams.entries()));
    }

    setCode(authCode);
  }, []);

  const { loading, error } = useOAuthCallback(code);

  if (error) {
    return (
      <div className="callback-page">
        <ErrorMessage
          error={error}
          onRetry={() => window.location.href = '/'}
        />
      </div>
    );
  }

  return (
    <div className="callback-page">
      <Loader message="Completing login..." />
    </div>
  );
};
