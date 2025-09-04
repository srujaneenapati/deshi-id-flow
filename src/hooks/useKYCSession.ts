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
      const { data, error } = await supabase.functions.invoke('kyc-session', {
        body: { language }
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
      localStorage.setItem('kyc_session_token', data.sessionToken);
      return newSession;
    } catch (err: any) {
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
          ...updates 
        }
      });

      if (error) throw error;

      const updatedSession = { ...session, ...data };
      setSession(updatedSession);
      return updatedSession;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadSession = async (token?: string) => {
    const sessionToken = token || localStorage.getItem('kyc_session_token');
    if (!sessionToken) return null;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://snotxicwhpivolqygtze.supabase.co/functions/v1/kyc-session?token=${sessionToken}`,
        {
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNub3R4aWN3aHBpdm9scXlndHplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODc1MzQsImV4cCI6MjA3MTM2MzUzNH0.jQZRKKk7yunbygeulomj7xF-B7q8vWwaUdybFMAFOKM`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNub3R4aWN3aHBpdm9scXlndHplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODc1MzQsImV4cCI6MjA3MTM2MzUzNH0.jQZRKKk7yunbygeulomj7xF-B7q8vWwaUdybFMAFOKM',
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
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearSession = () => {
    setSession(null);
    localStorage.removeItem('kyc_session_token');
  };

  // Auto-load session on mount
  useEffect(() => {
    const token = localStorage.getItem('kyc_session_token');
    if (token) {
      loadSession(token);
    }
  }, []);

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