import { useState, useEffect } from "react";
import { RealTimeFaceDetection } from "./RealTimeFaceDetection";
import { useFaceVerification } from "@/hooks/useFaceVerification";
import { useToast } from "@/hooks/use-toast";
import { getTranslation } from "@/lib/languages";

interface FaceAuthenticationProps {
  sessionToken: string;
  language: string;
  onComplete: () => void;
}

export function FaceAuthentication({ sessionToken, language, onComplete }: FaceAuthenticationProps) {
  const { verifyFace, verifying } = useFaceVerification();
  const { toast } = useToast();
  const t = (key: string) => getTranslation(key, language);

  const handleFaceDetectionComplete = async (faceData: string) => {
    const result = await verifyFace(sessionToken, {
      blink: true,
      smile: true,
      headTurn: true,
      eyeMovement: true
    }, faceData);
    
    if (result && result.sessionCompleted) {
      toast({
        title: t('success'),
        description: t('kycCompleted'),
      });
      onComplete();
    } else {
      toast({
        title: t('error'),
        description: "Face verification failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFaceDetectionError = (errorMessage: string) => {
    toast({
      title: t('error'),
      description: errorMessage,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">{t('faceVerification')}</h2>
        <p className="text-muted-foreground">
          {t('verifyIdentity')}
        </p>
      </div>

      <RealTimeFaceDetection
        language={language}
        onComplete={handleFaceDetectionComplete}
        onError={handleFaceDetectionError}
      />
    </div>
  );
}