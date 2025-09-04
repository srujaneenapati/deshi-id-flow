import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const formData = await req.formData();
    const sessionToken = formData.get('sessionToken') as string;
    const documentType = formData.get('documentType') as string;
    const file = formData.get('file') as File;

    if (!sessionToken || !documentType || !file) {
      return new Response(JSON.stringify({ 
        error: 'Session token, document type, and file are required' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get session
    const { data: session } = await supabase
      .from('kyc_sessions')
      .select('id')
      .eq('session_token', sessionToken)
      .single();

    if (!session) {
      return new Response(JSON.stringify({ error: 'Invalid session' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Upload file to storage
    const fileName = `${session.id}/${documentType}_${Date.now()}.${file.name.split('.').pop()}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('kyc-documents')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return new Response(JSON.stringify({ error: 'Failed to upload file' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Simulate document verification (OCR and validation)
    const extractedData = simulateDocumentOCR(documentType, file.name);
    
    // Save document record
    const { data: document, error: docError } = await supabase
      .from('kyc_documents')
      .insert({
        session_id: session.id,
        document_type: documentType,
        file_path: uploadData.path,
        verification_status: 'verified',
        extracted_data: extractedData
      })
      .select()
      .single();

    if (docError) {
      console.error('Error saving document:', docError);
      return new Response(JSON.stringify({ error: 'Failed to save document' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update session status
    await supabase
      .from('kyc_sessions')
      .update({ 
        status: 'documents_uploaded',
        document_status: { [documentType]: 'verified' }
      })
      .eq('session_token', sessionToken);

    return new Response(JSON.stringify({
      success: true,
      document: {
        id: document.id,
        type: documentType,
        status: 'verified',
        extractedData
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in document-upload function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function simulateDocumentOCR(documentType: string, fileName: string) {
  // Simulate OCR extraction based on document type
  const mockData: Record<string, any> = {
    aadhaar: {
      number: '****-****-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      name: 'Placeholder Name',
      dob: '01/01/1990',
      address: 'Placeholder Address'
    },
    pan: {
      number: 'ABCDE' + Math.floor(Math.random() * 10000).toString().padStart(4, '0') + 'F',
      name: 'Placeholder Name',
      dob: '01/01/1990'
    }
  };

  return mockData[documentType] || {};
}