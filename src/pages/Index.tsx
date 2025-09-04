import { useState } from "react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { KYCMethodSelector } from "@/components/KYCMethodSelector";
import { DocumentUpload } from "@/components/DocumentUpload";
import { FaceAuthentication } from "@/components/FaceAuthentication";
import { SuccessScreen } from "@/components/SuccessScreen";

type KYCStep = 'language' | 'welcome' | 'method' | 'digilocker' | 'upload' | 'face' | 'success' | 'complete';
type KYCMethod = 'digilocker' | 'manual' | null;

const Index = () => {
  const [currentStep, setCurrentStep] = useState<KYCStep>('language');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [kycMethod, setKycMethod] = useState<KYCMethod>(null);

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setCurrentStep('welcome');
  };

  const handleWelcomeStart = () => {
    setCurrentStep('method');
  };

  const handleMethodSelect = (method: 'digilocker' | 'manual') => {
    setKycMethod(method);
    if (method === 'digilocker') {
      // In real app, this would redirect to DigiLocker
      setTimeout(() => setCurrentStep('face'), 2000);
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
  };

  const renderStep = () => {
    switch (currentStep) {
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
          <KYCMethodSelector onMethodSelect={handleMethodSelect} />
        );
      case 'upload':
        return (
          <DocumentUpload onComplete={handleUploadComplete} />
        );
      case 'face':
        return (
          <FaceAuthentication onComplete={handleFaceComplete} />
        );
      case 'success':
        return (
          <SuccessScreen onComplete={handleKYCComplete} />
        );
      case 'complete':
        return (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-success">KYC Complete!</h2>
            <p className="text-muted-foreground">You will now be redirected to your app...</p>
            <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-lg mx-auto px-4 py-8">
        {renderStep()}
      </div>
    </div>
  );
};

export default Index;
