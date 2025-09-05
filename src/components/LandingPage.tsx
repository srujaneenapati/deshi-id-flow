import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock, Wifi, Globe, FileCheck, Volume2, CheckCircle, Star, Users, Award } from "lucide-react";
import { getTranslation } from "@/lib/languages";

interface LandingPageProps {
  language: string;
  onGetStarted: () => void;
}

export function LandingPage({ language, onGetStarted }: LandingPageProps) {
  const t = (key: string) => getTranslation(key, language);

  const features = [
    {
      icon: Clock,
      title: t('feature1Title'),
      description: t('feature1Desc'),
      color: 'text-primary'
    },
    {
      icon: Shield,
      title: t('feature2Title'),
      description: t('feature2Desc'),
      color: 'text-success'
    },
    {
      icon: Wifi,
      title: t('feature3Title'),
      description: t('feature3Desc'),
      color: 'text-warning'
    },
    {
      icon: Globe,
      title: t('feature4Title'),
      description: t('feature4Desc'),
      color: 'text-primary'
    },
    {
      icon: FileCheck,
      title: t('feature5Title'),
      description: t('feature5Desc'),
      color: 'text-success'
    },
    {
      icon: Volume2,
      title: t('feature6Title'),
      description: t('feature6Desc'),
      color: 'text-warning'
    }
  ];

  const steps = [
    {
      number: "01",
      title: t('step1Title'),
      description: t('step1Desc'),
      icon: Globe
    },
    {
      number: "02",
      title: t('step2Title'),
      description: t('step2Desc'),
      icon: FileCheck
    },
    {
      number: "03",
      title: t('step3Title'),
      description: t('step3Desc'),
      icon: Shield
    },
    {
      number: "04",
      title: t('step4Title'),
      description: t('step4Desc'),
      icon: CheckCircle
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{t('appTitle')}</h1>
                <p className="text-xs text-muted-foreground">🇮🇳 {t('govApproved')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                <Shield className="h-3 w-3 mr-1" />
                {t('secureConnection')}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="space-y-6">
            <Badge variant="outline" className="border-primary/20 text-primary">
              <Star className="h-3 w-3 mr-1" />
              {t('trustTitle')}
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent leading-tight">
              {t('appTitle')}
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              {t('appSubtitle')}
            </p>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('appDescription')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Button
                variant="hero"
                size="xl"
                className="w-full sm:w-auto shadow-medium"
                onClick={onGetStarted}
              >
                <Shield className="h-5 w-5 mr-2" />
                {t('getStarted')}
              </Button>
              
              <Button
                variant="outline"
                size="xl"
                className="w-full sm:w-auto"
              >
                <Volume2 className="h-5 w-5 mr-2" />
                {t('learnMore')}
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 pt-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-success" />
                </div>
                {t('govApproved')}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Award className="h-4 w-4 text-primary" />
                </div>
                {t('bankGrade')}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-warning" />
                </div>
                {t('dataProtected')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('featuresTitle')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('appDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="p-6 shadow-soft hover:shadow-medium transition-all duration-300">
                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center ${feature.color}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('howItWorksTitle')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('completeIn2Min')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-medium">
                      <IconComponent className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-warning rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container max-w-4xl mx-auto">
          <Card className="p-8 shadow-medium">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-gradient-success rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {t('dataSecureNotice')}
              </h2>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('dataProtectionNotice')}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto bg-success/10 rounded-full flex items-center justify-center mb-3">
                    <Shield className="h-6 w-6 text-success" />
                  </div>
                  <p className="text-sm font-medium">{t('encryptedData')}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium">{t('noDataStored')}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto bg-warning/10 rounded-full flex items-center justify-center mb-3">
                    <Award className="h-6 w-6 text-warning" />
                  </div>
                  <p className="text-sm font-medium">{t('gdprCompliant')}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t('startKYC')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('completeIn2Min')} • {t('dataSecure')}
            </p>
            
            <Button
              variant="hero"
              size="xl"
              className="shadow-medium"
              onClick={onGetStarted}
            >
              <Shield className="h-5 w-5 mr-2" />
              {t('getStarted')}
            </Button>
            
            <p className="text-sm text-muted-foreground">
              🔒 {t('govRecognized')}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-foreground">{t('appTitle')}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 {t('appTitle')}. {t('dataProtected')} • {t('govApproved')}
            </p>
            <div className="flex justify-center gap-6 text-xs text-muted-foreground">
              <span>{t('secureConnection')}</span>
              <span>•</span>
              <span>{t('encryptedData')}</span>
              <span>•</span>
              <span>{t('gdprCompliant')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}