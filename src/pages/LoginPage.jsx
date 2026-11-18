import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated || localStorage.getItem('studyhive_auth') === 'true') {
      navigate('/subjects', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleMessage = (e) => {
      if (
        e.data === 'studyhive_login_success' ||
        e.data?.type === 'studyhive_login_success'
      ) {
        login();
        navigate('/subjects', { replace: true });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [login, navigate]);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#0F0C09] z-50">
      <iframe
        src="/login/index.html"
        title="Signal — Log in"
        className="w-full h-full border-0 block"
        style={{ width: '100vw', height: '100vh', border: 'none' }}
      />
    </div>
  );
}
