import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Shield, Download, Share2, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";

interface SuccessScreenProps {
  onComplete: () => void;
}

export function SuccessScreen({ onComplete }: SuccessScreenProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Simulate voice confirmation
  const playVoiceConfirmation = () => {
    setIsPlayingAudio(true);
    // In real app, this would play actual audio
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 3000);
  };

  useEffect(() => {
    // Auto-play voice confirmation
    playVoiceConfirmation();
  }, []);

  const kycDetails = {
    name: "आपका नाम / Your Name",
    aadhaar: "XXXX XXXX 1234",
    pan: "ABCDE1234F",
    status: "Verified",
    timestamp: new Date().toLocaleString(),
    kycId: "KYC" + Math.random().toString(36).substr(2, 8).toUpperCase()
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 mx-auto bg-gradient-success rounded-full flex items-center justify-center animate-pulse">
          <CheckCircle className="h-12 w-12 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-success">KYC Successful!</h2>
          <p className="text-muted-foreground">आपका KYC सफलतापूर्वक पूरा हो गया</p>
        </div>
      </div>

      {/* Voice Confirmation Indicator */}
      <Card className="p-4 bg-success/5 border-success/20">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full bg-success/10 ${isPlayingAudio ? 'animate-pulse' : ''}`}>
            <Volume2 className={`h-5 w-5 text-success ${isPlayingAudio ? 'animate-bounce' : ''}`} />
          </div>
          <div className="flex-1">
            <p className="font-medium text-success">Voice Confirmation</p>
            <p className="text-sm text-muted-foreground">
              {isPlayingAudio ? "Playing audio confirmation..." : "Audio confirmation completed"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={playVoiceConfirmation}
            disabled={isPlayingAudio}
          >
            🔊 Replay
          </Button>
        </div>
      </Card>

      {/* KYC Summary */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Verification Summary</h3>
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
              <Shield className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">KYC ID</span>
              <span className="font-mono font-medium">{kycDetails.kycId}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Aadhaar</span>
              <span className="font-mono">{kycDetails.aadhaar}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">PAN</span>
              <span className="font-mono">{kycDetails.pan}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Face Match</span>
              <span className="text-success font-medium">98.7% ✓</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Completed</span>
              <span className="text-sm">{kycDetails.timestamp}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          variant="hero"
          size="xl"
          className="w-full"
          onClick={onComplete}
        >
          Continue to App
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="lg" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button variant="outline" size="lg" className="flex-1">
            <Share2 className="h-4 w-4 mr-2" />
            Share KYC
          </Button>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-muted/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-trust mt-0.5" />
          <div>
            <h4 className="font-medium text-sm">Your Data is Secure</h4>
            <p className="text-xs text-muted-foreground mt-1">
              All documents are encrypted and stored securely. We comply with data protection regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}