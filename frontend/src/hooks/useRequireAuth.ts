import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hasAdminSessionToken } from '../api/client';

export function useRequireAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = hasAdminSessionToken();
    
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);
}
