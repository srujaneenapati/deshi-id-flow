import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, AlertCircle, FileText, Loader2 } from "lucide-react";
import { useDigiLocker } from "@/hooks/useDigiLocker";
import { useToast } from "@/hooks/use-toast";
import { getTranslation } from "@/lib/languages";

interface DigiLockerAuthProps {
  sessionToken: string;
  language: string;
  onComplete: () => void;
}

export function DigiLockerAuth({ sessionToken, language, onComplete }: DigiLockerAuthProps) {
  const [step, setStep] = useState<'consent' | 'connecting' | 'success' | 'error'>('consent');
  const [documents, setDocuments] = useState<any[]>([]);
  const { authenticateWithDigiLocker, authenticating } = useDigiLocker();
  const { toast } = useToast();
  const t = (key: string) => getTranslation(key, language);

  const handleConnect = async () => {
    setStep('connecting');
    
    const result = await authenticateWithDigiLocker(sessionToken);
    
    if (result) {
      setDocuments(result);
      setStep('success');
      toast({
        title: t('success'),
        description: "Documents fetched from DigiLocker",
      });
      
      // Auto proceed after 3 seconds
      setTimeout(() => {
        onComplete();
      }, 3000);
    } else {
      setStep('error');
      toast({
        title: t('error'),
        description: "DigiLocker connection failed",
        variant: "destructive",
      });
    }
  };

  if (step === 'consent') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
            <Shield className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            {t('digilockerAuth')}
          </h2>
          <p className="text-muted-foreground">
            {t('allowSecureAccess')}
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="font-semibold">
              {t('requestAccess')}
            </h3>
            <ul className="space-y-2">
              {[
                { name: t('aadhaarCard'), required: true },
                { name: t('panCard'), required: true },
                { name: t('drivingLicense'), required: false },
              ].map((doc, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{doc.name}</span>
                  </div>
                  <Badge variant={doc.required ? "default" : "outline"}>
                    {doc.required ? t('required') : t('optional')}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <div className="bg-muted/30 rounded-lg p-4">
          <div className="text-center space-y-2">
            <div className="flex justify-center gap-2 text-lg">
              🔒 🛡️ ✅
            </div>
            <p className="text-sm font-medium">
              {t('dataSecure')} • {t('govRecognized')}
            </p>
          </div>
        </div>

        <Button
          variant="hero"
          size="xl"
          className="w-full"
          onClick={handleConnect}
          disabled={authenticating}
        >
          {authenticating ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              {t('connecting')}
            </>
          ) : (
            <>
              <Shield className="h-5 w-5 mr-2" />
              {t('connectDigilocker')}
            </>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          {t('redirectNotice')}
        </p>
      </div>
    );
  }

  if (step === 'connecting') {
    return (
      <div className="text-center space-y-6">
        <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-white animate-spin" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-primary">
            {t('connecting')} DigiLocker
          </h2>
          <p className="text-muted-foreground">
            Please wait while we fetch your documents...
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-center gap-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="w-24 h-24 mx-auto bg-gradient-success rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-success">
            Successfully Connected!
          </h2>
          <p className="text-muted-foreground">
            Your documents have been verified
          </p>
        </div>

        <div className="space-y-3">
          {documents.map((doc, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <div>
                    <h3 className="font-medium">
                      {doc.type === 'aadhaar' 
                        ? t('aadhaarCard')
                        : doc.type === 'pan'
                          ? t('panCard')
                          : t('drivingLicense')
                      }
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {doc.data?.number || 'Document verified'}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-success/10 text-success">
                  {t('verified')}
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Proceeding to face verification...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="h-12 w-12 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-red-600">
          Connection Failed
        </h2>
        <p className="text-muted-foreground">
          There was a problem connecting to DigiLocker
        </p>
      </div>

      <Button
        variant="outline"
        size="xl"
        className="w-full"
        onClick={() => setStep('consent')}
      >
        {t('tryAgain')}
      </Button>
    </div>
  );
}