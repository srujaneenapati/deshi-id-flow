-- Create KYC-related tables
CREATE TABLE public.kyc_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_token TEXT NOT NULL UNIQUE,
  language TEXT NOT NULL DEFAULT 'en',
  kyc_method TEXT CHECK (kyc_method IN ('digilocker', 'manual')),
  status TEXT CHECK (status IN ('started', 'documents_uploaded', 'face_verified', 'completed', 'failed')) DEFAULT 'started',
  document_status JSONB DEFAULT '{}',
  face_verification_status TEXT CHECK (face_verification_status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create documents table
CREATE TABLE public.kyc_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.kyc_sessions(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('aadhaar', 'pan', 'driving_license', 'voter_id')),
  file_path TEXT,
  verification_status TEXT CHECK (verification_status IN ('pending', 'verified', 'failed')) DEFAULT 'pending',
  extracted_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create face verification table
CREATE TABLE public.face_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.kyc_sessions(id) ON DELETE CASCADE,
  liveness_checks JSONB DEFAULT '{}',
  face_match_score DECIMAL(5,4),
  verification_status TEXT CHECK (verification_status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.kyc_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.face_verifications ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (since KYC is often done before user registration)
CREATE POLICY "KYC sessions are accessible by session token" 
ON public.kyc_sessions 
FOR ALL 
USING (true);

CREATE POLICY "KYC documents are accessible by session" 
ON public.kyc_documents 
FOR ALL 
USING (true);

CREATE POLICY "Face verifications are accessible by session" 
ON public.face_verifications 
FOR ALL 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_kyc_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_kyc_sessions_updated_at
  BEFORE UPDATE ON public.kyc_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_kyc_timestamps();

CREATE TRIGGER update_kyc_documents_updated_at
  BEFORE UPDATE ON public.kyc_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_kyc_timestamps();

CREATE TRIGGER update_face_verifications_updated_at
  BEFORE UPDATE ON public.face_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_kyc_timestamps();

-- Create storage bucket for KYC documents
INSERT INTO storage.buckets (id, name, public) VALUES ('kyc-documents', 'kyc-documents', false);

-- Create storage policies for KYC documents
CREATE POLICY "KYC documents are accessible by session token" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'kyc-documents');

-- Create indexes for better performance
CREATE INDEX idx_kyc_sessions_session_token ON public.kyc_sessions(session_token);
CREATE INDEX idx_kyc_sessions_status ON public.kyc_sessions(status);
CREATE INDEX idx_kyc_documents_session_id ON public.kyc_documents(session_id);
CREATE INDEX idx_face_verifications_session_id ON public.face_verifications(session_id);