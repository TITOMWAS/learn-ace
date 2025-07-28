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

  const handleLogin = (username: string, analysisData?: any) => {
    console.log('User logged in:', username);
    if (analysisData) {
      // Store analysis data to be used in dashboard
      localStorage.setItem('pendingAnalysisData', JSON.stringify(analysisData));
    }
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
