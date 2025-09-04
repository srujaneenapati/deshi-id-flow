import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2, Shield, Clock, CheckCircle } from "lucide-react";
import kycHeroIcon from "@/assets/kyc-hero-icon.png";

interface WelcomeScreenProps {
  selectedLanguage: string;
  onStart: () => void;
}

export function WelcomeScreen({ selectedLanguage, onStart }: WelcomeScreenProps) {
  const playWelcomeAudio = () => {
    // In real app, this would play actual audio in selected language
    console.log(`Playing welcome audio in ${selectedLanguage}`);
  };

  const features = [
    {
      icon: Clock,
      title: "Quick & Easy",
      description: "Complete in 2 minutes",
      titleHindi: "त्वरित और आसान"
    },
    {
      icon: Shield,
      title: "100% Secure",
      description: "Bank-grade security",
      titleHindi: "पूर्णतः सुरक्षित"
    },
    {
      icon: CheckCircle,
      title: "Instant Verification",
      description: "Real-time approval",
      titleHindi: "तत्काल सत्यापन"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="w-32 h-32 mx-auto">
          <img 
            src={kycHeroIcon} 
            alt="KYC Verification" 
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Digital KYC
          </h1>
          <h2 className="text-xl font-semibold text-foreground">
            {selectedLanguage === 'hi' ? 'डिजिटल पहचान सत्यापन' : 'Secure Identity Verification'}
          </h2>
          <p className="text-muted-foreground">
            {selectedLanguage === 'hi' 
              ? 'आसान और सुरक्षित तरीके से अपनी पहचान सत्यापित करें'
              : 'Verify your identity quickly and securely'
            }
          </p>
        </div>

        {/* Voice Guidance Button */}
        <Button
          variant="outline"
          size="lg"
          onClick={playWelcomeAudio}
          className="shadow-soft"
        >
          <Volume2 className="h-4 w-4 mr-2" />
          {selectedLanguage === 'hi' ? 'आवाज़ सुनें' : 'Listen to Audio Guide'}
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
                    {selectedLanguage === 'hi' && feature.titleHindi ? feature.titleHindi : feature.title}
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
          {selectedLanguage === 'hi' ? 'KYC शुरू करें' : 'Start KYC Verification'}
        </Button>
        
        <p className="text-center text-xs text-muted-foreground">
          {selectedLanguage === 'hi' 
            ? '🔒 आपका डेटा एन्क्रिप्टेड और सुरक्षित है'
            : '🔒 Your data is encrypted and secure'
          }
        </p>
      </div>

      {/* Trust Indicators */}
      <div className="bg-muted/30 rounded-lg p-4">
        <div className="text-center space-y-2">
          <div className="flex justify-center gap-4 text-2xl">
            🇮🇳 🏛️ ✅
          </div>
          <p className="text-sm font-medium">
            {selectedLanguage === 'hi' 
              ? 'सरकारी मान्यता प्राप्त • डिजिलॉकर समर्थित'
              : 'Government Recognized • DigiLocker Supported'
            }
          </p>
        </div>
      </div>
    </div>
  );
}