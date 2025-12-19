'use client';

import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import type { User } from '@/types';
import type { LoginInput, RegisterInput, ChangePasswordInput } from '@/lib/validations';

interface AuthResponse {
  user: User;
  token: string;
}

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, login: setAuth, logout: clearAuth } = useAuthStore();

  // Get current user
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await api.get<{ data: User }>('/auth/me');
      return response.data.data;
    },
    enabled: isAuthenticated,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await api.post<AuthResponse>('/auth/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      queryClient.setQueryData(['auth', 'me'], data.user);
      router.push('/dashboard');
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterInput) => {
      const response = await api.post<AuthResponse>('/auth/register', data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      queryClient.setQueryData(['auth', 'me'], data.user);
      router.push('/dashboard');
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout');
    },
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      router.push('/login');
    },
    onError: () => {
      // Even if logout fails on server, clear local state
      clearAuth();
      queryClient.clear();
      router.push('/login');
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: ChangePasswordInput) => {
      const response = await api.post('/auth/change-password', data);
      return response.data;
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<User>) => {
      const response = await api.put<{ data: User }>('/auth/profile', data);
      return response.data.data;
    },
    onSuccess: (updatedUser) => {
      useAuthStore.getState().setUser(updatedUser);
      queryClient.setQueryData(['auth', 'me'], updatedUser);
    },
  });

  const login = useCallback(
    (data: LoginInput) => loginMutation.mutateAsync(data),
    [loginMutation]
  );

  const register = useCallback(
    (data: RegisterInput) => registerMutation.mutateAsync(data),
    [registerMutation]
  );

  const logout = useCallback(() => logoutMutation.mutate(), [logoutMutation]);

  const changePassword = useCallback(
    (data: ChangePasswordInput) => changePasswordMutation.mutateAsync(data),
    [changePasswordMutation]
  );

  const updateProfile = useCallback(
    (data: Partial<User>) => updateProfileMutation.mutateAsync(data),
    [updateProfileMutation]
  );

  return {
    user: currentUser || user,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
    login,
    register,
    logout,
    changePassword,
    updateProfile,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}
