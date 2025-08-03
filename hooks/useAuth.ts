import { useState, useEffect } from 'react';
import { AuthService, User } from '../services/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(AuthService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(true);
  const [requireAuth, setRequireAuth] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      await AuthService.initialize();
      const currentUser = AuthService.getCurrentUser();
      setUser(currentUser);
      setRequireAuth(!currentUser);
      setIsLoading(false);
    };

    initializeAuth();

    const unsubscribe = AuthService.subscribe((newUser) => {
      setUser(newUser);
      setRequireAuth(!newUser);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
    await AuthService.signOut();
    setRequireAuth(true);
  };

  return {
    user,
    isLoading,
    requireAuth,
    signOut,
    isAuthenticated: !!user,
  };
};