
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { getCurrentUserData, getCurrentUserRole, UserData, UserRole } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  userRole: UserRole | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userData: null,
  userRole: null,
  loading: true
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Get user role and data
          const role = await getCurrentUserRole();
          const data = await getCurrentUserData();
          
          setUserRole(role);
          setUserData(data);
          
          // If no valid role found, log out and redirect
          if (!role) {
            await auth.signOut();
            navigate('/login');
          }
        } catch (error) {
          console.error("Error getting user data: ", error);
        }
      } else {
        setUserRole(null);
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [navigate]);

  const value = {
    currentUser,
    userData,
    userRole,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
