import { useEffect } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { getUser } from '@/utils/localStorage';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const userData = getUser();
    if (userData && userData.isLoggedIn) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = (username: string) => {
    console.log('User logged in:', username);
    navigate('/dashboard');
  };

  const handleSwitchToSignup = () => {
    navigate('/signup');
  };

  return (
    <LoginForm 
      onLogin={handleLogin} 
      onSwitchToSignup={handleSwitchToSignup} 
    />
  );
};

export default Index;
