import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Provider } from "@supabase/supabase-js";

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  oAuthLogin: (provider: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const avatarCache = new Map<string, string>();

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchUserProfile = async (id: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("id, email, first_name, last_name, avatar_image_link, bio, type")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error.message);
      return null;
    }
    const avatarBlobUrl = await getAvatarUrl(data.avatar_image_link);

    return {
      id: data.id,
      email: data.email,
      fname: data.first_name,
      lname: data.last_name,
      bio: data.bio,
      is_instructor: data.type,
      avatar_url: avatarBlobUrl,
    };
  };

  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.auth.getSession();
      if (error || !data?.session?.user) {
        console.error("Error fetching session:", error?.message);
        setUser(null);
        setIsLoading(false);
        return;
      }

      const profile = await fetchUserProfile(data.session.user.id);
      setUser(profile);
      setIsLoading(false);
    };

    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session);
        (async () => {
          if (session?.user) {
            const profile = await fetchUserProfile(session.user.id);
            setUser(profile);
          } else {
            setUser(null);
          }
        })();
      },
    );

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
    const profile = await fetchUserProfile(data.user.id);
    setUser(profile);
  };

  const oAuthLogin = async (provider: string) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as Provider,
    });
    if (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error("Register error:", error.message);
      throw error;
    }
    if (data.user) {
      const profile = await fetchUserProfile(data.user.id);
      setUser(profile);
    }
  };

  const logout = async () => {
    avatarCache.clear();
    await supabase.auth.signOut();
    setUser(null);
  };

  const getAvatarUrl = async (avatarPath: string | null | undefined): Promise<string> => {
    if (!avatarPath) {
      return "https://ui-avatars.com/api/?name=User&background=cccccc&color=ffffff";
    }
  
    if (avatarPath.startsWith("http")) {
      return avatarPath;
    }
  
    if (avatarCache.has(avatarPath)) {
      return avatarCache.get(avatarPath)!;
    }

    const { data, error } = await supabase.storage
      .from("useravatars")
      .download(avatarPath);
  
    if (error || !data) {
      console.error("Failed to download avatar:", error?.message);
      return "https://ui-avatars.com/api/?name=User&background=cccccc&color=ffffff";
    }
  
    const blobUrl = URL.createObjectURL(data);
    avatarCache.set(avatarPath, blobUrl);
    return blobUrl;
  };
  
  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, register, oAuthLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
