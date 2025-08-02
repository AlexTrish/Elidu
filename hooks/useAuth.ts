import { useState, useEffect } from 'react';
import { AuthService, User } from '../services/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(AuthService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      await AuthService.initialize();
      setUser(AuthService.getCurrentUser());
      setIsLoading(false);
    };

    initializeAuth();

    const unsubscribe = AuthService.subscribe((newUser) => {
      setUser(newUser);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
    await AuthService.signOut();
  };

  return {
    user,
    isLoading,
    signOut,
    isAuthenticated: !!user,
  };
};