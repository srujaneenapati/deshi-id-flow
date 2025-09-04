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

    const { sessionToken, livenessChecks, faceImageData } = await req.json();

    if (!sessionToken) {
      return new Response(JSON.stringify({ error: 'Session token required' }), {
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

    // Simulate face verification process
    const faceMatchScore = Math.random() * 0.2 + 0.8; // Random score between 0.8-1.0
    const verificationStatus = faceMatchScore > 0.85 ? 'completed' : 'failed';

    // Save face verification record
    const { data: faceVerification, error: faceError } = await supabase
      .from('face_verifications')
      .insert({
        session_id: session.id,
        liveness_checks: livenessChecks || {},
        face_match_score: faceMatchScore,
        verification_status: verificationStatus
      })
      .select()
      .single();

    if (faceError) {
      console.error('Error saving face verification:', faceError);
      return new Response(JSON.stringify({ error: 'Failed to save face verification' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update session status
    const sessionStatus = verificationStatus === 'completed' ? 'completed' : 'failed';
    await supabase
      .from('kyc_sessions')
      .update({ 
        status: sessionStatus,
        face_verification_status: verificationStatus,
        completed_at: verificationStatus === 'completed' ? new Date().toISOString() : null
      })
      .eq('session_token', sessionToken);

    return new Response(JSON.stringify({
      success: true,
      faceVerification: {
        id: faceVerification.id,
        status: verificationStatus,
        score: faceMatchScore,
        sessionCompleted: sessionStatus === 'completed'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in face-verification function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});