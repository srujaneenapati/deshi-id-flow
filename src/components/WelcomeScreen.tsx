import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2, Shield, Clock, CheckCircle } from "lucide-react";
import { useVoiceGuidance } from "@/hooks/useVoiceGuidance";
import { getTranslation } from "@/lib/languages";

interface WelcomeScreenProps {
  selectedLanguage: string;
  onStart: () => void;
}

export function WelcomeScreen({ selectedLanguage, onStart }: WelcomeScreenProps) {
  const { speak, isPlaying } = useVoiceGuidance();
  const t = (key: string) => getTranslation(key, selectedLanguage);

  const playWelcomeAudio = () => {
    speak('welcome', selectedLanguage);
  };

  const features = [
    {
      icon: Clock,
      title: t('quickEasy'),
      description: t('completeIn2Min'),
    },
    {
      icon: Shield,
      title: t('secure'),
      description: t('bankGradeSecurity'),
    },
    {
      icon: CheckCircle,
      title: t('instantVerification'),
      description: t('realTimeApproval'),
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="w-32 h-32 mx-auto">
          <div className="w-full h-full bg-gradient-primary rounded-full flex items-center justify-center">
            <Shield className="h-16 w-16 text-white" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            {t('welcomeTitle')}
          </h1>
          <h2 className="text-xl font-semibold text-foreground">
            {t('welcomeSubtitle')}
          </h2>
          <p className="text-muted-foreground">
            {t('welcomeDescription')}
          </p>
        </div>

        {/* Voice Guidance Button */}
        <Button
          variant="outline"
          size="lg"
          onClick={playWelcomeAudio}
          className="shadow-soft"
          disabled={isPlaying}
        >
          <Volume2 className={`h-4 w-4 mr-2 ${isPlaying ? 'animate-pulse' : ''}`} />
          {isPlaying ? t('playing') : t('listenAudio')}
        </Button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 gap-4">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <Card key={index} className="p-4 shadow-soft">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-primary rounded-lg">
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* CTA Button */}
      <div className="space-y-4">
        <Button
          variant="hero"
          size="xl"
          className="w-full shadow-medium"
          onClick={onStart}
        >
          {t('startKYC')}
        </Button>
        
        <p className="text-center text-xs text-muted-foreground">
          🔒 {t('dataSecure')}
        </p>
      </div>

      {/* Trust Indicators */}
      <div className="bg-muted/30 rounded-lg p-4">
        <div className="text-center space-y-2">
          <div className="flex justify-center gap-4 text-2xl">
            🇮🇳 🏛️ ✅
          </div>
          <p className="text-sm font-medium">
            {t('govRecognized')}
          </p>
        </div>
      </div>
    </div>
  );
}