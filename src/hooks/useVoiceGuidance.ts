import { useState, useCallback } from 'react';

interface VoiceGuidanceConfig {
  language: string;
  enabled: boolean;
}

const voiceTexts = {
  en: {
    welcome: "Welcome to Digital KYC. Please follow the instructions to verify your identity quickly and securely.",
    languageSelected: "Language selected. Starting KYC verification process.",
    methodSelection: "Please choose your preferred verification method - DigiLocker for instant verification or manual document upload.",
    documentUpload: "Please upload clear photos of your documents. Make sure all text is readable.",
    faceVerification: "Position your face in the camera and follow the liveness instructions.",
    success: "Congratulations! Your KYC verification is complete."
  },
  hi: {
    welcome: "डिजिटल केवाईसी में आपका स्वागत है। अपनी पहचान को जल्दी और सुरक्षित रूप से सत्यापित करने के लिए निर्देशों का पालन करें।",
    languageSelected: "भाषा चुनी गई। केवाईसी सत्यापन प्रक्रिया शुरू की जा रही है।",
    methodSelection: "कृपया अपनी पसंदीदा सत्यापन विधि चुनें - तत्काल सत्यापन के लिए डिजिलॉकर या मैन्युअल दस्तावेज़ अपलोड।",
    documentUpload: "कृपया अपने दस्तावेज़ों की स्पष्ट तस्वीरें अपलोड करें। सुनिश्चित करें कि सभी पाठ पढ़ने योग्य है।",
    faceVerification: "अपना चेहरा कैमरे में रखें और लाइवनेस निर्देशों का पालन करें।",
    success: "बधाई हो! आपका केवाईसी सत्यापन पूरा हो गया है।"
  }
};

export const useVoiceGuidance = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [config, setConfig] = useState<VoiceGuidanceConfig>({
    language: 'en',
    enabled: true
  });

  const speak = useCallback((key: keyof typeof voiceTexts.en, language: string = config.language) => {
    if (!config.enabled || !('speechSynthesis' in window)) {
      console.log('Voice guidance disabled or not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const texts = voiceTexts[language as keyof typeof voiceTexts] || voiceTexts.en;
    const text = texts[key];

    if (!text) {
      console.warn(`Voice text not found for key: ${key}`);
      return;
    }

    setIsPlaying(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      console.error('Speech synthesis error');
    };

    window.speechSynthesis.speak(utterance);
  }, [config]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, []);

  const updateConfig = useCallback((newConfig: Partial<VoiceGuidanceConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  return {
    speak,
    stopSpeaking,
    isPlaying,
    config,
    updateConfig,
    isSupported: 'speechSynthesis' in window
  };
};