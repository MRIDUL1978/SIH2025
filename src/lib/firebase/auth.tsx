
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile,
  Auth
} from 'firebase/auth';
import { auth, db } from './config';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';

type Role = 'student' | 'faculty' | 'admin';

// Extend the register function to accept a name and role
type RegisterFunction = (
  auth: Auth,
  email: string,
  password: string,
  name: string,
  role: Role
) => Promise<any>;


type AuthContextType = {
  user: User | null;
  loading: boolean;
  register: RegisterFunction;
  signIn: typeof signInWithEmailAndPassword;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register: RegisterFunction = async (auth, email, password, name, role) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // This adds the user's name to their auth profile
    await updateProfile(user, { displayName: name });
    
    // This creates the user's profile document in Firestore.
    // This is the ONLY write operation that happens for a new user.
    // This action is allowed by the security rule `allow create: if request.auth.uid == userId;`
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name,
      email: user.email,
      role: role,
    });
    
    return userCredential;
  };
  
  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push('/');
  };


  const value = { user, loading, register, signIn: signInWithEmailAndPassword, signOut };

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin" />
        </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
