import { SignupForm } from '@/components/SignupForm';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  const handleSignup = (username: string) => {
    console.log('User signed up:', username);
    navigate('/dashboard');
  };

  const handleSwitchToLogin = () => {
    navigate('/');
  };

  return (
    <SignupForm 
      onSignup={handleSignup} 
      onSwitchToLogin={handleSwitchToLogin} 
    />
  );
};

export default Signup;