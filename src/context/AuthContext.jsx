'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getStoredUser, isAuthenticated as checkIsAuthenticated, clearTokens, saveTokens, USER_DETAILS_KEY } from '@/lib/token';
import Cookies from "js-cookie";
import api from '@/lib/axios';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchProfile = useCallback(async () => {
    if (!checkIsAuthenticated()) {
      setUser(null);
      return;
    }
    try {
      const { data } = await api.get("/auth/me");
      const fetchedUser = data.user || data.data;
      setUser(fetchedUser);

      if (fetchedUser) {
        const currentDetails = getStoredUser() || {};
        const updatedDetails = { ...currentDetails, ...fetchedUser };
        Cookies.set(USER_DETAILS_KEY, JSON.stringify(updatedDetails), {
          expires: 7,
          sameSite: "lax",
        });
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        console.warn("[Auth] Profile fetch returned", status, "— clearing session.");
        clearTokens();
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      clearTokens();
      setUser(null);
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, fetchProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

