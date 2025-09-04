import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'npm:@supabase/supabase-js@2.57.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

    // Get session with documents
    const { data: session } = await supabase
      .from('kyc_sessions')
      .select(`
        id,
        kyc_documents (
          document_type,
          extracted_data
        )
      `)
      .eq('session_token', sessionToken)
      .single();

    if (!session) {
      return new Response(JSON.stringify({ error: 'Invalid session' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Perform face verification
    const verificationResult = await performFaceVerification(
      faceImageData,
      session.kyc_documents,
      livenessChecks
    );

    // Save face verification record
    const { data: faceVerification, error: faceError } = await supabase
      .from('face_verifications')
      .insert({
        session_id: session.id,
        liveness_checks: livenessChecks || {},
        face_match_score: verificationResult.score,
        verification_status: verificationResult.status
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
    const sessionStatus = verificationResult.status === 'completed' ? 'completed' : 'failed';
    await supabase
      .from('kyc_sessions')
      .update({ 
        status: sessionStatus,
        face_verification_status: verificationResult.status,
        completed_at: verificationResult.status === 'completed' ? new Date().toISOString() : null
      })
      .eq('session_token', sessionToken);

    return new Response(JSON.stringify({
      success: true,
      faceVerification: {
        id: faceVerification.id,
        status: verificationResult.status,
        score: verificationResult.score,
        sessionCompleted: sessionStatus === 'completed',
        details: verificationResult.details
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

async function performFaceVerification(
  faceImageData: string,
  documents: any[],
  livenessChecks: Record<string, boolean>
) {
  try {
    // In production, integrate with face recognition services like:
    // - AWS Rekognition
    // - Azure Face API
    // - Google Cloud Vision API
    // - FaceX or similar Indian face recognition services

    // For now, simulate advanced face verification
    const livenessScore = calculateLivenessScore(livenessChecks);
    const faceQualityScore = analyzeFaceImageQuality(faceImageData);
    
    // Simulate document photo comparison
    const documentFaceScore = await compareFaceWithDocuments(faceImageData, documents);
    
    // Calculate overall score
    const overallScore = (livenessScore * 0.3 + faceQualityScore * 0.3 + documentFaceScore * 0.4);
    
    const status = overallScore > 0.85 ? 'completed' : 'failed';
    
    return {
      status,
      score: overallScore,
      details: {
        livenessScore,
        faceQualityScore,
        documentFaceScore,
        livenessChecks
      }
    };
  } catch (error) {
    console.error('Face verification error:', error);
    return {
      status: 'failed',
      score: 0,
      details: { error: error.message }
    };
  }
}

function calculateLivenessScore(livenessChecks: Record<string, boolean>): number {
  const checks = Object.values(livenessChecks);
  const passedChecks = checks.filter(Boolean).length;
  return passedChecks / checks.length;
}

function analyzeFaceImageQuality(faceImageData: string): number {
  try {
    // Basic image quality analysis
    const base64Data = faceImageData.split(',')[1];
    const binaryData = atob(base64Data);
    
    // Simple quality metrics
    const imageSize = binaryData.length;
    const hasGoodSize = imageSize > 10000 && imageSize < 500000; // 10KB - 500KB
    
    // In production, analyze:
    // - Image sharpness
    // - Lighting conditions
    // - Face angle and pose
    // - Image resolution
    
    return hasGoodSize ? 0.9 : 0.6;
  } catch (error) {
    console.error('Error analyzing face image quality:', error);
    return 0.5;
  }
}

async function compareFaceWithDocuments(faceImageData: string, documents: any[]): Promise<number> {
  try {
    // In production, this would:
    // 1. Extract face from document photos (Aadhaar, PAN, etc.)
    // 2. Compare facial features using ML models
    // 3. Return similarity score
    
    // For demo, simulate high confidence if documents are present
    const hasAadhaar = documents.some(doc => doc.document_type === 'aadhaar');
    const hasPAN = documents.some(doc => doc.document_type === 'pan');
    
    if (hasAadhaar && hasPAN) {
      // Simulate realistic face matching with some variance
      return 0.85 + (Math.random() * 0.1); // 85-95% match
    }
    
    return 0.75 + (Math.random() * 0.1); // 75-85% match
  } catch (error) {
    console.error('Error comparing face with documents:', error);
    return 0.6;
  }
}