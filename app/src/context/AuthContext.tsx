/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-refresh/only-export-components */
// import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
// import type { AuthState } from '@/types';
// import { authAPI } from '@/services/api';

// interface AuthContextType extends AuthState {
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
//   error: string | null;
//   clearError: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [state, setState] = useState<AuthState>({
//     user: null,
//     isAuthenticated: false,
//     isLoading: true,
//   });
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const initAuth = async () => {
//       try {
//         const user = await authAPI.getCurrentUser();
//         setState({
//           user,
//           isAuthenticated: !!user,
//           isLoading: false,
//         });
//       } catch {
//         setState({
//           user: null,
//           isAuthenticated: false,
//           isLoading: false,
//         });
//       }
//     };
//     initAuth();
//   }, []);

//   const login = async (email: string, password: string) => {
//     try {
//       setError(null);
//       const { user } = await authAPI.login(email, password);
//       setState({
//         user,
//         isAuthenticated: true,
//         isLoading: false,
//       });
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Login failed');
//       throw err;
//     }
//   };

//   const logout = async () => {
//     try {
//       await authAPI.logout();
//       setState({
//         user: null,
//         isAuthenticated: false,
//         isLoading: false,
//       });
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Logout failed');
//     }
//   };

//   const clearError = () => setError(null);

//   return (
//     <AuthContext.Provider
//       value={{
//         ...state,
//         login,
//         logout,
//         error,
//         clearError,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };





















import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  type User 
} from 'firebase/auth';
import { auth } from '../firebase'; // Ensure this points to your firebase config

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, pass: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      console.error("Login failed", err);
      // Friendly error messages
      if (err.code === 'auth/invalid-credential') setError("Invalid email or password.");
      else if (err.code === 'auth/user-not-found') setError("No user found with this email.");
      else if (err.code === 'auth/wrong-password') setError("Incorrect password.");
      else setError("Failed to sign in. Please try again.");
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') setError("No account found with this email.");
      else setError("Failed to send reset email.");
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      error, 
      login, 
      logout,
      resetPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};