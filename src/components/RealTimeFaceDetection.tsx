import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Camera, CheckCircle, Eye, Smile, RotateCcw, AlertCircle } from "lucide-react";
import { useRealTimeFaceDetection } from "@/hooks/useRealTimeFaceDetection";
import { getTranslation } from "@/lib/languages";

interface RealTimeFaceDetectionProps {
  language: string;
  onComplete: (faceData: string) => void;
  onError: (error: string) => void;
}

export function RealTimeFaceDetection({ language, onComplete, onError }: RealTimeFaceDetectionProps) {
  const [currentInstruction, setCurrentInstruction] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const {
    isActive,
    faceDetected,
    livenessStatus,
    error,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    captureFrame,
    resetLivenessChecks,
    isSupported
  } = useRealTimeFaceDetection();

  const t = (key: string) => getTranslation(key, language);

  const instructions = [
    { 
      id: 'blink', 
      text: t('blinkTwice'), 
      icon: Eye, 
      check: () => livenessStatus.blink 
    },
    { 
      id: 'smile', 
      text: t('smileNaturally'), 
      icon: Smile, 
      check: () => livenessStatus.smile 
    },
    { 
      id: 'turn', 
      text: t('turnHead'), 
      icon: RotateCcw, 
      check: () => livenessStatus.headTurn 
    },
  ];

  // Monitor liveness progress
  useEffect(() => {
    const completedChecks = Object.values(livenessStatus).filter(Boolean).length;
    const newProgress = (completedChecks / Object.keys(livenessStatus).length) * 100;
    setProgress(newProgress);

    // Auto-advance instruction
    if (instructions[currentInstruction]?.check()) {
      if (currentInstruction < instructions.length - 1) {
        setTimeout(() => setCurrentInstruction(prev => prev + 1), 1000);
      } else if (completedChecks === Object.keys(livenessStatus).length) {
        // All checks completed
        setTimeout(() => {
          setIsProcessing(true);
          const faceData = captureFrame();
          if (faceData) {
            onComplete(faceData);
          } else {
            onError("Failed to capture face image");
          }
        }, 1000);
      }
    }
  }, [livenessStatus, currentInstruction, instructions, captureFrame, onComplete, onError]);

  // Handle errors
  useEffect(() => {
    if (error) {
      onError(error);
    }
  }, [error, onError]);

  const handleStartDetection = async () => {
    resetLivenessChecks();
    setCurrentInstruction(0);
    setProgress(0);
    await startCamera();
  };

  const handleRetry = () => {
    stopCamera();
    resetLivenessChecks();
    setCurrentInstruction(0);
    setProgress(0);
    setIsProcessing(false);
  };

  if (!isSupported) {
    return (
      <Card className="p-6 text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-error" />
        <h3 className="font-semibold mb-2">Camera Not Supported</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Your device doesn't support camera access required for face verification.
        </p>
        <Button variant="outline" onClick={() => onError("Camera not supported")}>
          Skip Face Verification
        </Button>
      </Card>
    );
  }

  if (!isActive) {
    return (
      <div className="space-y-6">
        <Card className="p-6 text-center">
          <div className="w-32 h-32 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
            <Camera className="h-16 w-16 text-white" />
          </div>
          <h3 className="font-semibold mb-2">{t('positionFace')}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('faceClearlyVisible')}
          </p>
          <Button 
            variant="hero" 
            size="xl" 
            className="w-full"
            onClick={handleStartDetection}
          >
            {t('startFaceVerification')}
          </Button>
        </Card>

        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium text-sm mb-2">For best results:</h4>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• Ensure good lighting on your face</li>
            <li>• Remove glasses or hats if possible</li>
            <li>• Look directly at the camera</li>
            <li>• Keep your device steady</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Camera Feed */}
      <Card className="p-4">
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full h-64 object-cover rounded-lg bg-black"
            autoPlay
            muted
            playsInline
          />
          <canvas
            ref={canvasRef}
            className="hidden"
          />
          
          {/* Face Detection Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-48 h-48 border-4 rounded-full transition-all duration-300 ${
              faceDetected 
                ? 'border-success shadow-lg shadow-success/20' 
                : 'border-warning border-dashed'
            }`}>
              {faceDetected && (
                <div className="w-full h-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
              )}
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className="absolute top-4 left-4">
            <Badge variant={faceDetected ? "secondary" : "outline"} className={
              faceDetected ? "bg-success/10 text-success border-success/20" : ""
            }>
              {faceDetected ? "Face Detected ✓" : "Position Your Face"}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Instructions */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold">{t('followInstructions')}</h3>
            <Progress value={progress} className="h-3 mt-2" />
          </div>
          
          <div className="space-y-3">
            {instructions.map((instruction, index) => {
              const IconComponent = instruction.icon;
              const isCompleted = instruction.check();
              const isCurrent = index === currentInstruction;
              
              return (
                <div
                  key={instruction.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isCurrent 
                      ? 'bg-primary/10 border-2 border-primary/20' 
                      : isCompleted 
                        ? 'bg-success/10' 
                        : 'bg-muted/50'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    isCompleted 
                      ? 'bg-success/10 text-success' 
                      : isCurrent
                        ? 'bg-primary/10 text-primary animate-pulse'
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <IconComponent className="h-5 w-5" />
                    )}
                  </div>
                  <span className={`font-medium flex-1 ${
                    isCompleted ? 'text-success' : isCurrent ? 'text-primary' : 'text-foreground'
                  }`}>
                    {instruction.text}
                  </span>
                  {isCompleted && (
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      ✓ {t('done')}
                    </Badge>
                  )}
                  {isCurrent && !isCompleted && (
                    <Badge variant="outline" className="border-primary text-primary animate-pulse">
                      Active
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Processing State */}
      {isProcessing && (
        <Card className="p-6 text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-success rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-white animate-pulse" />
          </div>
          <h3 className="font-semibold mb-2">{t('matchingFace')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('comparingPhoto')}
          </p>
        </Card>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleRetry}
          disabled={isProcessing}
        >
          {t('tryAgain')}
        </Button>
        <Button
          variant="outline"
          onClick={stopCamera}
          disabled={isProcessing}
        >
          Stop Camera
        </Button>
      </div>
    </div>
  );
}