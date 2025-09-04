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
      // Step 1: Get DigiLocker OAuth URL
      const { data: authData, error: authError } = await supabase.functions.invoke('digilocker-auth', {
        body: {
          sessionToken,
          userConsent: true,
          action: 'authenticate'
        }
      });

      if (authError) throw authError;

      // Step 2: Redirect to DigiLocker (in production)
      // For demo, we'll simulate the OAuth flow
      if (authData.authUrl) {
        // In production: window.location.href = authData.authUrl;
        // For demo, simulate successful authentication
        await simulateDigiLockerFlow(sessionToken);
        
        // Step 3: Fetch documents after authentication
        const { data: docsData, error: docsError } = await supabase.functions.invoke('digilocker-auth', {
          body: {
            sessionToken,
            action: 'fetch-documents'
          }
        });

        if (docsError) throw docsError;
        return docsData.documents;
      }

      return authData.documents;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setAuthenticating(false);
    }
  };

  const simulateDigiLockerFlow = async (sessionToken: string) => {
    // Simulate OAuth callback processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In production, this would be handled by the actual DigiLocker callback
    const { error } = await supabase.functions.invoke('digilocker-auth', {
      body: {
        action: 'callback',
        code: 'demo_auth_code',
        state: `demo_state:${sessionToken}`
      }
    });

    if (error) throw error;
  };

  return {
    authenticateWithDigiLocker,
    authenticating,
    error
  };
};