import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

// Google OAuth configuration
const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://www.googleapis.com/oauth2/v4/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  participantId?: string;
  isGuest?: boolean;
}

const STORAGE_KEY = '@admission_tracker_user';
const PARTICIPANT_ID_KEY = '@admission_tracker_participant_id';

export class AuthService {
  private static user: User | null = null;
  private static listeners: ((user: User | null) => void)[] = [];

  static async initialize() {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEY);
      const participantId = await AsyncStorage.getItem(PARTICIPANT_ID_KEY); // <-- participantId читается отсюда
      if (userData) {
        this.user = { ...JSON.parse(userData), participantId };
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  static async continueAsGuest(participantId?: string) {
    try {
      const guestUser: User = {
        id: 'guest_' + Date.now(),
        email: 'guest@local',
        name: 'Гость',
        isGuest: true,
        participantId,
      };
      
      await this.setUser(guestUser);
      if (participantId) {
        await AsyncStorage.setItem(PARTICIPANT_ID_KEY, participantId);
      }
      return guestUser;
    } catch (error) {
      console.error('Error creating guest user:', error);
      throw error;
    }
  }

  static async updateParticipantId(participantId: string) {
    try {
      if (this.user) {
        const updatedUser = { ...this.user, participantId };
        await this.setUser(updatedUser);
        await AsyncStorage.setItem(PARTICIPANT_ID_KEY, participantId);
      }
    } catch (error) {
      console.error('Error updating participant ID:', error);
      throw error;
    }
  }

  static getCurrentUser(): User | null {
    return this.user;
  }

  static async signOut() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      await AsyncStorage.removeItem(PARTICIPANT_ID_KEY);
      this.user = null;
      this.notifyListeners();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  static async setUser(user: User) {
    try {
      this.user = user;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      this.notifyListeners();
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  static subscribe(listener: (user: User | null) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notifyListeners() {
    this.listeners.forEach(listener => listener(this.user));
  }
}

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_GOOGLE_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: makeRedirectUri({
        scheme: 'myapp',
        path: 'auth',
      }),
    },
    discovery
  );

  const signInWithGoogle = async () => {
    try {
      const result = await promptAsync();
      
      if (result?.type === 'success') {
        const { authentication } = result;
        
        // Fetch user info from Google
        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${authentication?.accessToken}`
        );
        
        const userInfo = await userInfoResponse.json();
        
        const user: User = {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
        };
        
        await AuthService.setUser(user);
        return user;
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  return {
    signInWithGoogle,
    request,
  };
};