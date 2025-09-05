import { useState, useEffect } from "react";
import { LandingPage } from "@/components/LandingPage";
import { LanguageSelector } from "@/components/LanguageSelector";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { KYCMethodSelector } from "@/components/KYCMethodSelector";
import { DocumentUpload } from "@/components/DocumentUpload";
import { FaceAuthentication } from "@/components/FaceAuthentication";
import { SuccessScreen } from "@/components/SuccessScreen";
import { DigiLockerAuth } from "@/components/DigiLockerAuth";
import { useKYCSession } from "@/hooks/useKYCSession";
import { useToast } from "@/hooks/use-toast";
import { getTranslation } from "@/lib/languages";

type KYCStep = 'landing' | 'language' | 'welcome' | 'method' | 'digilocker' | 'upload' | 'face' | 'success' | 'complete';
type KYCMethod = 'digilocker' | 'manual' | null;

const Index = () => {
  const [currentStep, setCurrentStep] = useState<KYCStep>('landing');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [kycMethod, setKycMethod] = useState<KYCMethod>(null);
  const { session, createSession, loading } = useKYCSession();
  const { toast } = useToast();

  const t = (key: string) => getTranslation(key, selectedLanguage);

  const handleGetStarted = () => {
    setCurrentStep('language');
  };

  const handleLanguageSelect = async (language: string) => {
    setSelectedLanguage(language);
    const newSession = await createSession(language);
    if (newSession) {
      setCurrentStep('welcome');
      toast({
        title: t('success'),
        description: t('languageSelected'),
      });
    } else {
      toast({
        title: t('error'),
        description: t('networkError'),
        variant: "destructive",
      });
    }
  };

  const handleWelcomeStart = () => {
    setCurrentStep('method');
  };

  const handleMethodSelect = (method: 'digilocker' | 'manual') => {
    setKycMethod(method);
    if (method === 'digilocker') {
      setCurrentStep('digilocker');
    } else {
      setCurrentStep('upload');
    }
  };

  const handleUploadComplete = () => {
    setCurrentStep('face');
  };

  const handleFaceComplete = () => {
    setCurrentStep('success');
  };

  const handleKYCComplete = () => {
    setCurrentStep('complete');
    // In a real app, redirect to the main application
    setTimeout(() => {
      toast({
        title: t('kycSuccessful'),
        description: t('kycCompleted'),
      });
    }, 2000);
  };

  // Security: Clear sensitive data on unmount
  useEffect(() => {
    return () => {
      // Clear any sensitive data from memory
      if (session?.sessionToken) {
        // In production, also clear from localStorage after successful completion
        localStorage.removeItem('kyc_session_token');
      }
    };
  }, [session]);

  const renderStep = () => {
    switch (currentStep) {
      case 'landing':
        return (
          <LandingPage
            language={selectedLanguage}
            onGetStarted={handleGetStarted}
          />
        );
      case 'language':
        return (
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageSelect={handleLanguageSelect}
          />
        );
      case 'welcome':
        return (
          <WelcomeScreen
            selectedLanguage={selectedLanguage}
            onStart={handleWelcomeStart}
          />
        );
      case 'method':
        return (
          <KYCMethodSelector 
            language={selectedLanguage}
            onMethodSelect={handleMethodSelect} 
          />
        );
      case 'digilocker':
        return (
          <DigiLockerAuth 
            sessionToken={session?.sessionToken || ''} 
            language={selectedLanguage}
            onComplete={() => setCurrentStep('face')} 
          />
        );
      case 'upload':
        return (
          <DocumentUpload 
            sessionToken={session?.sessionToken || ''} 
            language={selectedLanguage}
            onComplete={handleUploadComplete} 
          />
        );
      case 'face':
        return (
          <FaceAuthentication 
            sessionToken={session?.sessionToken || ''} 
            language={selectedLanguage}
            onComplete={handleFaceComplete} 
          />
        );
      case 'success':
        return (
          <SuccessScreen 
            language={selectedLanguage}
            onComplete={handleKYCComplete} 
          />
        );
      case 'complete':
        return (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-success">{t('kycSuccessful')}</h2>
            <p className="text-muted-foreground">{t('pleaseWait')}</p>
            <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        );
      default:
        return null;
    }
  };

  // Show landing page in full screen, others in container
  if (currentStep === 'landing') {
    return renderStep();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Security indicator */}
      <div className="bg-success/10 border-b border-success/20 py-2">
        <div className="container max-w-lg mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-xs text-success">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            {t('secureConnection')} • {t('encryptedData')}
          </div>
        </div>
      </div>

      <div className="container max-w-lg mx-auto px-4 py-8">
        {renderStep()}
      </div>
    </div>
  );
};

export default Index;