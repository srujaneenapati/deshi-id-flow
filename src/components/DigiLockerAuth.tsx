import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, AlertCircle, FileText, Loader2 } from "lucide-react";
import { useDigiLocker } from "@/hooks/useDigiLocker";
import { useToast } from "@/hooks/use-toast";

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

  const isHindi = language === 'hi';

  const handleConnect = async () => {
    setStep('connecting');
    
    const result = await authenticateWithDigiLocker(sessionToken);
    
    if (result) {
      setDocuments(result);
      setStep('success');
      toast({
        title: isHindi ? "सफल" : "Success",
        description: isHindi ? "डिजिलॉकर से दस्तावेज़ प्राप्त हुए" : "Documents fetched from DigiLocker",
      });
      
      // Auto proceed after 3 seconds
      setTimeout(() => {
        onComplete();
      }, 3000);
    } else {
      setStep('error');
      toast({
        title: isHindi ? "त्रुटि" : "Error",
        description: isHindi ? "डिजिलॉकर कनेक्शन विफल" : "DigiLocker connection failed",
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
            {isHindi ? "डिजिलॉकर प्राधिकरण" : "DigiLocker Authorization"}
          </h2>
          <p className="text-muted-foreground">
            {isHindi 
              ? "आपके दस्तावेज़ों को सुरक्षित रूप से एक्सेस करने के लिए अनुमति दें"
              : "Allow secure access to your documents"
            }
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="font-semibold">
              {isHindi ? "हम निम्नलिखित तक पहुंच का अनुरोध करते हैं:" : "We request access to:"}
            </h3>
            <ul className="space-y-2">
              {[
                { name: isHindi ? "आधार कार्ड" : "Aadhaar Card", required: true },
                { name: isHindi ? "पैन कार्ड" : "PAN Card", required: true },
                { name: isHindi ? "ड्राइविंग लाइसेंस" : "Driving License", required: false },
              ].map((doc, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{doc.name}</span>
                  </div>
                  <Badge variant={doc.required ? "default" : "outline"}>
                    {doc.required ? (isHindi ? "आवश्यक" : "Required") : (isHindi ? "वैकल्पिक" : "Optional")}
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
              {isHindi 
                ? "आपका डेटा एन्क्रिप्टेड और सुरक्षित है • सरकारी मान्यता प्राप्त"
                : "Your data is encrypted and secure • Government verified"
              }
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
              {isHindi ? "कनेक्ट हो रहा है..." : "Connecting..."}
            </>
          ) : (
            <>
              <Shield className="h-5 w-5 mr-2" />
              {isHindi ? "डिजिलॉकर से कनेक्ट करें" : "Connect with DigiLocker"}
            </>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          {isHindi 
            ? "डिजिलॉकर की आधिकारिक वेबसाइट पर रीडायरेक्ट किया जाएगा"
            : "You will be redirected to DigiLocker's official website"
          }
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
            {isHindi ? "डिजिलॉकर से कनेक्ट हो रहे हैं" : "Connecting to DigiLocker"}
          </h2>
          <p className="text-muted-foreground">
            {isHindi 
              ? "कृपया प्रतीक्षा करें जबकि हम आपके दस्तावेज़ प्राप्त कर रहे हैं..."
              : "Please wait while we fetch your documents..."
            }
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
            {isHindi ? "सफलतापूर्वक कनेक्ट हुआ!" : "Successfully Connected!"}
          </h2>
          <p className="text-muted-foreground">
            {isHindi 
              ? "आपके दस्तावेज़ सत्यापित हो गए हैं"
              : "Your documents have been verified"
            }
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
                        ? (isHindi ? "आधार कार्ड" : "Aadhaar Card")
                        : (isHindi ? "पैन कार्ड" : "PAN Card")
                      }
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {doc.data.number}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-success/10 text-success">
                  {isHindi ? "सत्यापित" : "Verified"}
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {isHindi 
              ? "फेस वेरिफिकेशन के लिए आगे बढ़ रहे हैं..."
              : "Proceeding to face verification..."
            }
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
          {isHindi ? "कनेक्शन विफल" : "Connection Failed"}
        </h2>
        <p className="text-muted-foreground">
          {isHindi 
            ? "डिजिलॉकर से कनेक्ट करने में समस्या हुई"
            : "There was a problem connecting to DigiLocker"
          }
        </p>
      </div>

      <Button
        variant="outline"
        size="xl"
        className="w-full"
        onClick={() => setStep('consent')}
      >
        {isHindi ? "पुनः प्रयास करें" : "Try Again"}
      </Button>
    </div>
  );
}