import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FaceVerificationResult {
  id: string;
  status: 'completed' | 'failed' | 'pending';
  score: number;
  sessionCompleted: boolean;
}

export const useFaceVerification = () => {
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyFace = async (
    sessionToken: string,
    livenessChecks: Record<string, boolean>,
    faceImageData: string
  ): Promise<FaceVerificationResult | null> => {
    setVerifying(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('face-verification', {
        body: {
          sessionToken,
          livenessChecks,
          faceImageData
        }
      });

      if (error) throw error;

      return data.faceVerification;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setVerifying(false);
    }
  };

  return {
    verifyFace,
    verifying,
    error
  };
};