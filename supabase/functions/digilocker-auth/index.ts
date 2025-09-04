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

    const { sessionToken, userConsent } = await req.json();

    if (!sessionToken || !userConsent) {
      return new Response(JSON.stringify({ 
        error: 'Session token and user consent required' 
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

    // Simulate DigiLocker authentication and document fetch
    // In real implementation, this would:
    // 1. Redirect to DigiLocker OAuth
    // 2. Fetch documents from DigiLocker API
    // 3. Validate and store documents

    const simulatedDocuments = [
      {
        type: 'aadhaar',
        status: 'verified',
        data: {
          number: '****-****-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
          name: 'Placeholder Name',
          dob: '01/01/1990',
          address: 'Placeholder Address'
        }
      },
      {
        type: 'pan',
        status: 'verified',
        data: {
          number: 'ABCDE' + Math.floor(Math.random() * 10000).toString().padStart(4, '0') + 'F',
          name: 'Placeholder Name',
          dob: '01/01/1990'
        }
      }
    ];

    // Save documents
    const documentPromises = simulatedDocuments.map(doc => 
      supabase.from('kyc_documents').insert({
        session_id: session.id,
        document_type: doc.type,
        verification_status: doc.status,
        extracted_data: doc.data
      })
    );

    await Promise.all(documentPromises);

    // Update session
    await supabase
      .from('kyc_sessions')
      .update({ 
        status: 'documents_uploaded',
        kyc_method: 'digilocker',
        document_status: {
          aadhaar: 'verified',
          pan: 'verified'
        }
      })
      .eq('session_token', sessionToken);

    return new Response(JSON.stringify({
      success: true,
      message: 'DigiLocker documents fetched successfully',
      documents: simulatedDocuments
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in digilocker-auth function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});