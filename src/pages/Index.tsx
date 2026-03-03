import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getToken } from '@/lib/auth';
import { SignUpForm } from '@/components/auth/SignUpForm';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const token = getToken();

  if (token && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <SignUpForm />;
};

export default Index;
