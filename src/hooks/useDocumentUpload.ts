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
      const formData = new FormData();
      formData.append('sessionToken', sessionToken);
      formData.append('documentType', documentType);
      formData.append('file', file);

      const response = await fetch(
        `https://snotxicwhpivolqygtze.supabase.co/functions/v1/document-upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNub3R4aWN3aHBpdm9scXlndHplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODc1MzQsImV4cCI6MjA3MTM2MzUzNH0.jQZRKKk7yunbygeulomj7xF-B7q8vWwaUdybFMAFOKM`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNub3R4aWN3aHBpdm9scXlndHplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODc1MzQsImV4cCI6MjA3MTM2MzUzNH0.jQZRKKk7yunbygeulomj7xF-B7q8vWwaUdybFMAFOKM',
          },
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      return data.document;
    } catch (err: any) {
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