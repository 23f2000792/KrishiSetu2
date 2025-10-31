'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User as AuthUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

import { useFirebase } from '@/firebase/provider';
import type { User, UserRole } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { demoCredentials } from '@/lib/data';
import { updateDocumentNonBlocking } from '@/firebase';

interface AuthContextType {
  user: User | null;
  authUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  signup: (name:string, email: string, password: string, role: UserRole, phone: string, region: string) => void;
  updateUserProfile: (userId: string, data: Partial<User>) => Promise<void>;
  loading: boolean;
  handleDemoLogin: (role: 'Admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REDIRECT_KEY = 'auth-redirect';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { auth, firestore, isUserLoading, user: authUser } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUserProfile = useCallback(async (firebaseUser: AuthUser) => {
    try {
      const userDocRef = doc(firestore, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = { id: userDoc.id, ...userDoc.data() } as User;
        setUser(userData);
      } else {
        // This case can happen if a user is in auth but not in firestore
        // You might want to log them out or create a profile
        console.warn("User profile not found in Firestore for UID:", firebaseUser.uid);
        setUser(null); 
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUser(null);
    }
  }, [firestore]);

  const updateUserProfile = async (userId: string, data: Partial<User>) => {
    const userDocRef = doc(firestore, 'users', userId);
    updateDocumentNonBlocking(userDocRef, data);
    // Optimistically update local state
    setUser(prevUser => prevUser ? { ...prevUser, ...data } : null);
    toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
    });
  };
  

  useEffect(() => {
    if (!isUserLoading) {
      if (authUser) {
        fetchUserProfile(authUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    }
  }, [authUser, isUserLoading, fetchUserProfile]);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Auth state change will be handled by the onAuthStateChanged listener in useFirebase
      // which will then trigger the useEffect to fetch the user profile and redirect.
    } catch (error: any) {
      console.error("Login error:", error);
      toast({ variant: 'destructive', title: 'Login Failed', description: error.message });
    }
  };

  const handleDemoLogin = async (role: 'Admin') => {
    const creds = demoCredentials.admin;
    try {
        await signInWithEmailAndPassword(auth, creds.email, creds.password);
    } catch (error: any) {
         // If admin doesn't exist, create it
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, creds.email, creds.password);
                const firebaseUser = userCredential.user;
                const adminUser: Omit<User, 'id'> = {
                    name: 'Admin User',
                    email: creds.email,
                    role: 'Admin',
                    region: 'N/A',
                    phone: '',
                    prefs: { push: true, voice: false },
                };
                await setDoc(doc(firestore, "users", firebaseUser.uid), adminUser);
                // After creating, try signing in again.
                await signInWithEmailAndPassword(auth, creds.email, creds.password);
            } catch (signupError: any) {
                 if (signupError.code === 'auth/email-already-in-use') {
                    // This can happen if creation succeeded but sign-in failed before. Just sign in.
                     await signInWithEmailAndPassword(auth, creds.email, creds.password);
                 } else {
                    console.error("Admin creation/login error:", signupError);
                    toast({ variant: 'destructive', title: 'Admin Setup Failed', description: signupError.message });
                 }
            }
        } else {
            console.error("Admin Login error:", error);
            toast({ variant: 'destructive', title: 'Admin Login Failed', description: error.message });
        }
    }
  };


  const signup = async (name: string, email: string, password: string, role: UserRole, phone: string, region: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        const newUser: Omit<User, 'id'> = {
            name,
            email,
            role,
            region,
            phone,
            prefs: { push: true, voice: false },
        };

        await setDoc(doc(firestore, "users", firebaseUser.uid), newUser);
        
        // setUser will be handled by the auth state listener
        
        toast({
            title: "Account Created",
            description: "You have been successfully signed up.",
        });

    } catch (error: any) {
        console.error("Signup error:", error);
        toast({ variant: 'destructive', title: 'Signup Failed', description: error.message });
    }
  };


  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      router.push('/auth/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isAuthenticated = !!user;

  useEffect(() => {
    if (!loading) {
      const isAuthPage = pathname.startsWith('/auth');
      const publicPages = ['/', '/privacy-policy', '/terms-of-service'];
      const isPublicPage = publicPages.includes(pathname);
      
      if (!isAuthenticated && !isAuthPage && !isPublicPage) {
        sessionStorage.setItem(REDIRECT_KEY, pathname);
        router.push('/auth/login');
      }
      
      if (isAuthenticated) {
        const savedRedirect = sessionStorage.getItem(REDIRECT_KEY);
        if (savedRedirect) {
          sessionStorage.removeItem(REDIRECT_KEY);
          router.push(savedRedirect);
          return;
        }

        if (isAuthPage) {
          if (user.role === 'Admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/dashboard');
          }
        } else if (user.role === 'Admin' && !pathname.startsWith('/admin')) {
          router.push('/admin/dashboard');
        } else if (user.role === 'Farmer' && pathname.startsWith('/admin')) {
          router.push('/dashboard');
        }
      }
    }
  }, [isAuthenticated, loading, pathname, router, user]);

  const value = { user, authUser, isAuthenticated, login, logout, signup, loading, handleDemoLogin, updateUserProfile };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
