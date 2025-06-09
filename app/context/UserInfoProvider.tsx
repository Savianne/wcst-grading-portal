"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useSession, signOut } from "next-auth/react";

// Define the User Info Type
export interface UserInfo {
    uid: string;
    first_name: string;
    middle_name: string;
    surname: string;
    suffix: string;
    sex: string;
    date_of_birth: string;
    picture: string | null
}

// Define context value type
interface UserContextType {
    user: UserInfo | null;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserInfoProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserInfo | null>(null);

    const { data: session } = useSession();

    React.useEffect(() => {
        if(session?.user.email) {
            fetch('/api/get-user-info', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: session?.user.email})
            })
            .then(response => {
                if(response.ok) {
                    return response.json();
                } else {
                    throw new Error("Failed to fetch data");
                }
            })
            .then(data => {
                setUser({...data.data})
            })
            .catch(err => {
                console.log(err)
            })
        }
    }, [session?.user.email])

    return (
        <UserContext.Provider value={{ user }}>
        {children}
        </UserContext.Provider>
    );
};

// Custom hook for using context
export const useUserInfo = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
