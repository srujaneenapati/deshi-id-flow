import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DigiLockerDocument {
  type: string;
  status: 'verified' | 'failed';
  data: any;
}

export const useDigiLocker = () => {
  const [authenticating, setAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticateWithDigiLocker = async (
    sessionToken: string
  ): Promise<DigiLockerDocument[] | null> => {
    setAuthenticating(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('digilocker-auth', {
        body: {
          sessionToken,
          userConsent: true
        }
      });

      if (error) throw error;

      return data.documents;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setAuthenticating(false);
    }
  };

  return {
    authenticateWithDigiLocker,
    authenticating,
    error
  };
};