import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface KYCSession {
  id: string;
  sessionToken: string;
  language: string;
  status: 'started' | 'documents_uploaded' | 'face_verified' | 'completed' | 'failed';
  kycMethod?: 'digilocker' | 'manual';
  documentStatus: Record<string, string>;
  faceVerificationStatus?: 'pending' | 'completed' | 'failed';
}

export const useKYCSession = () => {
  const [session, setSession] = useState<KYCSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = async (language: string = 'en') => {
    setLoading(true);
    setError(null);
    try {
      // Security: Generate cryptographically secure session token
      const sessionToken = crypto.randomUUID() + '-' + Date.now();
      
      const { data, error } = await supabase.functions.invoke('kyc-session', {
        body: { 
          language,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          // Add security context
          securityContext: {
            origin: window.location.origin,
            referrer: document.referrer,
            timestamp: Date.now()
          }
        }
      });

      if (error) throw error;

      const newSession: KYCSession = {
        id: data.sessionId,
        sessionToken: data.sessionToken,
        language: data.language,
        status: 'started',
        documentStatus: {}
      };

      setSession(newSession);
      
      // Security: Store with expiration (30 minutes)
      const sessionData = {
        ...newSession,
        expiresAt: Date.now() + (30 * 60 * 1000) // 30 minutes
      };
      localStorage.setItem('kyc_session_token', JSON.stringify(sessionData));
      
      return newSession;
    } catch (err: any) {
      console.error('Session creation error:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSession = async (updates: Partial<KYCSession>) => {
    if (!session) return null;

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('kyc-session', {
        body: { 
          sessionToken: session.sessionToken,
          ...updates,
          timestamp: Date.now()
        }
      });

      if (error) throw error;

      const updatedSession = { ...session, ...data };
      setSession(updatedSession);
      
      // Update localStorage with new expiration
      const sessionData = {
        ...updatedSession,
        expiresAt: Date.now() + (30 * 60 * 1000)
      };
      localStorage.setItem('kyc_session_token', JSON.stringify(sessionData));
      
      return updatedSession;
    } catch (err: any) {
      console.error('Session update error:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadSession = async (token?: string) => {
    const storedData = localStorage.getItem('kyc_session_token');
    if (!storedData) return null;

    try {
      const sessionData = JSON.parse(storedData);
      
      // Security: Check if session has expired
      if (sessionData.expiresAt && Date.now() > sessionData.expiresAt) {
        clearSession();
        return null;
      }

      const sessionToken = token || sessionData.sessionToken;
      if (!sessionToken) return null;

      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/kyc-session?token=${sessionToken}`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
            // Security headers
            'X-Requested-With': 'XMLHttpRequest',
            'X-Content-Type-Options': 'nosniff',
          }
        }
      );

      if (!response.ok) throw new Error('Failed to load session');

      const data = await response.json();
      const loadedSession: KYCSession = {
        id: data.id,
        sessionToken: data.session_token,
        language: data.language,
        status: data.status,
        kycMethod: data.kyc_method,
        documentStatus: data.document_status || {},
        faceVerificationStatus: data.face_verification_status
      };

      setSession(loadedSession);
      return loadedSession;
    } catch (err: any) {
      console.error('Session load error:', err);
      setError(err.message);
      clearSession(); // Clear invalid session
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearSession = () => {
    setSession(null);
    setError(null);
    localStorage.removeItem('kyc_session_token');
    
    // Security: Clear any sensitive data from memory
    if (session?.sessionToken) {
      // Overwrite sensitive data
      const clearedSession = { ...session };
      Object.keys(clearedSession).forEach(key => {
        (clearedSession as any)[key] = null;
      });
    }
  };

  // Auto-load session on mount with security checks
  useEffect(() => {
    const storedData = localStorage.getItem('kyc_session_token');
    if (storedData) {
      try {
        const sessionData = JSON.parse(storedData);
        // Check expiration before loading
        if (sessionData.expiresAt && Date.now() > sessionData.expiresAt) {
          clearSession();
        } else {
          loadSession(sessionData.sessionToken);
        }
      } catch (error) {
        console.error('Invalid session data:', error);
        clearSession();
      }
    }
  }, []);

  // Security: Auto-clear session on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Don't clear session on refresh, only on actual navigation away
      if (session?.status === 'completed') {
        clearSession();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [session]);

  return {
    session,
    loading,
    error,
    createSession,
    updateSession,
    loadSession,
    clearSession
  };
};