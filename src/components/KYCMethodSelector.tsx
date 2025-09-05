import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Upload, Shield, Clock } from "lucide-react";
import { getTranslation } from "@/lib/languages";

interface KYCMethodSelectorProps {
  language: string;
  onMethodSelect: (method: 'digilocker' | 'manual') => void;
}

export function KYCMethodSelector({ language, onMethodSelect }: KYCMethodSelectorProps) {
  const t = (key: string) => getTranslation(key, language);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">{t('completeKYC')}</h2>
        <p className="text-muted-foreground">{t('chooseMethod')}</p>
      </div>

      <div className="grid gap-4 max-w-md mx-auto">
        {/* DigiLocker Option */}
        <Card className="p-6 cursor-pointer hover:shadow-medium transition-all duration-300 border-2 hover:border-primary/50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-primary rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{t('digilockerKYC')}</h3>
                  <p className="text-sm text-muted-foreground">{t('instantSecure')}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                <Clock className="h-3 w-3 mr-1" />
                1 {t('minutes')}
              </Badge>
            </div>
            
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                {t('autoFetch')}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                {t('govVerified')}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                {t('fastestVerification')}
              </li>
            </ul>

            <Button 
              variant="hero" 
              size="xl" 
              className="w-full"
              onClick={() => onMethodSelect('digilocker')}
            >
              {t('continueDigilocker')}
            </Button>
          </div>
        </Card>

        {/* Manual Upload Option */}
        <Card className="p-6 cursor-pointer hover:shadow-medium transition-all duration-300 border-2 hover:border-primary/50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-success rounded-lg">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{t('uploadDocuments')}</h3>
                  <p className="text-sm text-muted-foreground">{t('manualVerification')}</p>
                </div>
              </div>
              <Badge variant="outline" className="border-warning text-warning">
                <Clock className="h-3 w-3 mr-1" />
                3 {t('minutes')}
              </Badge>
            </div>
            
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                {t('uploadAadhaarPan')}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                {t('takeClearPhotos')}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                {t('worksWithoutDigilocker')}
              </li>
            </ul>

            <Button 
              variant="large" 
              size="xl" 
              className="w-full"
              onClick={() => onMethodSelect('manual')}
            >
              {t('uploadDocuments')}
            </Button>
          </div>
        </Card>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          🔒 {t('dataSecure')}
        </p>
      </div>
    </div>
  );
}