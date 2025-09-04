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

    const { method } = req;
    
    if (method === 'POST') {
      // Create new KYC session
      const { language = 'en' } = await req.json();
      
      const sessionToken = crypto.randomUUID();
      
      const { data, error } = await supabase
        .from('kyc_sessions')
        .insert({
          session_token: sessionToken,
          language,
          status: 'started'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating KYC session:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ 
        sessionToken,
        sessionId: data.id,
        language: data.language
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (method === 'GET') {
      // Get KYC session status
      const url = new URL(req.url);
      const sessionToken = url.searchParams.get('token');
      
      if (!sessionToken) {
        return new Response(JSON.stringify({ error: 'Session token required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data, error } = await supabase
        .from('kyc_sessions')
        .select('*')
        .eq('session_token', sessionToken)
        .single();

      if (error) {
        console.error('Error fetching KYC session:', error);
        return new Response(JSON.stringify({ error: 'Session not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (method === 'PATCH') {
      // Update KYC session
      const { sessionToken, ...updates } = await req.json();
      
      if (!sessionToken) {
        return new Response(JSON.stringify({ error: 'Session token required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data, error } = await supabase
        .from('kyc_sessions')
        .update(updates)
        .eq('session_token', sessionToken)
        .select()
        .single();

      if (error) {
        console.error('Error updating KYC session:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in kyc-session function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});