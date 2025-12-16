import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useRequireAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('admin_authenticated');
    
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);
}
