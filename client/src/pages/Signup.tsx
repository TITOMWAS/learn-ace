import { SignupForm } from '@/components/SignupForm';
import { useLocation } from 'wouter';

const Signup = () => {
  const [, setLocation] = useLocation();

  const handleSignup = (username: string) => {
    console.log('User signed up:', username);
    setLocation('/dashboard');
  };

  const handleSwitchToLogin = () => {
    setLocation('/');
  };

  return (
    <SignupForm 
      onSignup={handleSignup} 
      onSwitchToLogin={handleSwitchToLogin} 
    />
  );
};

export default Signup;