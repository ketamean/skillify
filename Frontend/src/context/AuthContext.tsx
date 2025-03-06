import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface AuthContextType {
    user: any;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            setIsLoading(true);
            const { data, error } = await supabase.auth.getSession();
            
            if (error) {
                console.error("Error fetching session:", error.message);
            }

            setUser(data?.session?.user || null);
            setIsLoading(false);
        };

        checkUser();

        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("Auth state changed:", event, session);
            setUser(session?.user || null);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error("Login error:", error.message);
            throw error;
        }
        setUser(data.user);
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};