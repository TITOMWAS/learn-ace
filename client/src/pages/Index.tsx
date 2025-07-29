import { useEffect } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { getUser } from '@/utils/localStorage';
import { useLocation } from 'wouter';

const Index = () => {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if user is already logged in
    const userData = getUser();
    if (userData && userData.isLoggedIn) {
      setLocation('/dashboard');
    }
  }, [setLocation]);

  const handleLogin = (username: string) => {
    console.log('User logged in:', username);
    setLocation('/dashboard');
  };

  const handleSwitchToSignup = () => {
    setLocation('/signup');
  };

  return (
    <LoginForm 
      onLogin={handleLogin} 
      onSwitchToSignup={handleSwitchToSignup} 
    />
  );
};

export default Index;
