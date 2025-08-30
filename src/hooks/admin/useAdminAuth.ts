'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useAdminAuthStore } from '@/stores/adminAuthStore';

export function useAdminAuth() {
  const {
    user,
    session,
    isAdmin,
    isLoading,
    setUser,
    setSession,
    setIsAdmin,
    setIsLoading,
    reset,
  } = useAdminAuthStore();

  const supabase = createClient();

  useEffect(() => {
    // 초기 세션 확인
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const isAdmin = await checkAdminRole(session.user.id);
          setUser(session.user);
          setSession(session);
          setIsAdmin(isAdmin);
          setIsLoading(false);
        } else {
          reset();
          setIsLoading(false);
        }
      } catch (error) {
        console.error('세션 확인 실패:', error);
        reset();
        setIsLoading(false);
      }
    };

    getInitialSession();

    // 인증 상태 변경 구독
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const isAdmin = await checkAdminRole(session.user.id);
          setUser(session.user);
          setSession(session);
          setIsAdmin(isAdmin);
          setIsLoading(false);
        } else {
          reset();
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth, setUser, setSession, setIsAdmin, setIsLoading, reset]);

  // 관리자 역할 확인
  const checkAdminRole = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        return false;
      }

      return data.role === 'admin' || data.role === 'super_admin';
    } catch (error) {
      console.error('관리자 역할 확인 실패:', error);
      return false;
    }
  };

  // 로그인
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        const isAdmin = await checkAdminRole(data.user.id);
        if (!isAdmin) {
          await supabase.auth.signOut();
          throw new Error('관리자 권한이 없습니다.');
        }
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '로그인에 실패했습니다.' 
      };
    }
  };

  // 로그아웃
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      reset();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '로그아웃에 실패했습니다.' 
      };
    }
  };

  return {
    user,
    session,
    isAdmin,
    isLoading,
    signIn,
    signOut,
  };
}
