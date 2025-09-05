import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DocumentUploadResult {
  id: string;
  type: string;
  status: 'verified' | 'failed' | 'pending';
  extractedData?: any;
}

export const useDocumentUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadDocument = async (
    sessionToken: string,
    documentType: string,
    file: File
  ): Promise<DocumentUploadResult | null> => {
    setUploading(true);
    setError(null);

    try {
      // Validate file size (max 5MB for security)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size too large. Maximum 5MB allowed.');
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
      }

      // Create secure form data
      const formData = new FormData();
      formData.append('sessionToken', sessionToken);
      formData.append('documentType', documentType);
      formData.append('file', file);

      // Add security headers and use HTTPS
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/document-upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            // Add security headers
            'X-Requested-With': 'XMLHttpRequest',
            'X-Content-Type-Options': 'nosniff',
          },
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      
      // Validate response data
      if (!data.success || !data.document) {
        throw new Error('Invalid response from server');
      }

      return data.document;
    } catch (err: any) {
      console.error('Document upload error:', err);
      setError(err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadDocument,
    uploading,
    error
  };
};