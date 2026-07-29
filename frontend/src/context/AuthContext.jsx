import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { getMe, loginUser, registerUser, verifyOtp } from "../services/authService";
import { getStoredToken, setStoredToken, setUnauthorizedHandler } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const wasAuthenticated = useRef(false);

  const logout = useCallback(() => {
    setStoredToken(null);
    setUser(null);
    setStats(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setStats(null);
      return null;
    }
    const { data } = await getMe();
    setUser(data.user);
    setStats(data.stats || data.status);
    return data;
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      if (wasAuthenticated.current) {
        toast.error("Session expired. Please sign in again.");
      }
      logout();
    });
  }, [logout]);

  useEffect(() => {
    wasAuthenticated.current = Boolean(user);
  }, [user]);

  useEffect(() => {
    (async () => {
      try {
        if (getStoredToken()) await refreshUser();
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    })();
  }, [logout, refreshUser]);

  const login = async (email, password) => {
    const { data } = await loginUser({ email, password });
    setStoredToken(data.token);
    setUser(data.user);
    await refreshUser();
    return data;
  };

  const register = async (formData) => {
    const { data } = await registerUser(formData);
    return data;
  };

  const completeVerification = async (email, otp) => {
    const { data } = await verifyOtp({ email, otp });
    setStoredToken(data.token);
    setUser(data.user);
    await refreshUser();
    return data;
  };

  const value = useMemo(
    () => ({
      user,
      stats,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      completeVerification,
      logout,
      refreshUser,
      setUser,
    }),
    [user, stats, loading, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
