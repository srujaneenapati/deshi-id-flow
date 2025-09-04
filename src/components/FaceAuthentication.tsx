import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Camera, CheckCircle, RotateCcw, Eye, Smile } from "lucide-react";
import { useFaceVerification } from "@/hooks/useFaceVerification";
import { useToast } from "@/hooks/use-toast";

interface FaceAuthenticationProps {
  sessionToken: string;
  onComplete: () => void;
}

interface LivenessCheck {
  id: string;
  instruction: string;
  icon: any;
  completed: boolean;
}

export function FaceAuthentication({ sessionToken, onComplete }: FaceAuthenticationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [livenessChecks, setLivenessChecks] = useState<LivenessCheck[]>([
    { id: 'blink', instruction: 'Blink twice slowly', icon: Eye, completed: false },
    { id: 'smile', instruction: 'Smile naturally', icon: Smile, completed: false },
    { id: 'turn', instruction: 'Turn head left and right', icon: RotateCcw, completed: false },
  ]);

  const [faceMatchProgress, setFaceMatchProgress] = useState(0);
  const { verifyFace, verifying } = useFaceVerification();
  const { toast } = useToast();

  useEffect(() => {
    if (currentStep === 1) {
      // Simulate liveness detection
      const interval = setInterval(() => {
        setLivenessChecks(prev => {
          const updated = [...prev];
          const incompleteIndex = updated.findIndex(check => !check.completed);
          if (incompleteIndex !== -1) {
            updated[incompleteIndex].completed = true;
            setProgress(((incompleteIndex + 1) / updated.length) * 100);
          }
          return updated;
        });
      }, 2000);

      // Auto proceed after all checks
      setTimeout(async () => {
        clearInterval(interval);
        setCurrentStep(2);
        
        // Perform face verification
        const livenessData = livenessChecks.reduce((acc, check) => {
          acc[check.id] = check.completed;
          return acc;
        }, {} as Record<string, boolean>);

        const result = await verifyFace(sessionToken, livenessData);
        
        if (result && result.sessionCompleted) {
          setTimeout(() => {
            toast({
              title: "Face Verification Successful",
              description: "KYC completed successfully!",
            });
            onComplete();
          }, 2000);
        } else {
          toast({
            title: "Face Verification Failed", 
            description: "Please try again.",
            variant: "destructive",
          });
        }
      }, 7000);

      return () => clearInterval(interval);
    }
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 2) {
      // Simulate face matching
      const interval = setInterval(() => {
        setFaceMatchProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            setIsProcessing(false);
            setTimeout(onComplete, 1000);
          }
          return newProgress;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [currentStep, onComplete]);

  const startFaceVerification = () => {
    setCurrentStep(1);
    setIsProcessing(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Face Verification</h2>
        <p className="text-muted-foreground">
          We'll verify your identity with a quick face scan
        </p>
      </div>

      {currentStep === 0 && (
        <div className="space-y-6">
          <Card className="p-6 text-center">
            <div className="w-32 h-32 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
              <Camera className="h-16 w-16 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Position Your Face</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Make sure your face is clearly visible and well-lit
            </p>
            <Button 
              variant="hero" 
              size="xl" 
              className="w-full"
              onClick={startFaceVerification}
            >
              Start Face Verification
            </Button>
          </Card>

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-sm mb-2">For best results:</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Ensure good lighting on your face</li>
              <li>• Remove glasses or hats if possible</li>
              <li>• Look directly at the camera</li>
              <li>• Keep your phone steady</li>
            </ul>
          </div>
        </div>
      )}

      {currentStep === 1 && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-full flex items-center justify-center animate-pulse">
                <Camera className="h-12 w-12 text-white" />
              </div>
              <h3 className="font-semibold">Follow the Instructions</h3>
              <Progress value={progress} className="h-3" />
            </div>
          </Card>

          <div className="space-y-3">
            {livenessChecks.map((check, index) => {
              const IconComponent = check.icon;
              return (
                <Card key={check.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        check.completed 
                          ? 'bg-success/10 text-success' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {check.completed ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <IconComponent className="h-5 w-5" />
                        )}
                      </div>
                      <span className={`font-medium ${
                        check.completed ? 'text-success' : 'text-foreground'
                      }`}>
                        {check.instruction}
                      </span>
                    </div>
                    {check.completed && (
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        ✓ Done
                      </Badge>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          <Card className="p-6 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-success rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Matching Your Face</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Comparing with your document photo...
            </p>
            <Progress value={faceMatchProgress} className="h-3" />
            <p className="text-xs text-muted-foreground mt-2">
              {faceMatchProgress}% Complete
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}