import { useState, useCallback } from 'react';

interface VoiceGuidanceConfig {
  language: string;
  enabled: boolean;
}

import { getTranslation } from '@/lib/languages';

const voiceTexts: Record<string, Record<string, string>> = {
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
  },
  // Add more languages
  bn: {
    welcome: "ডিজিটাল KYC-তে স্বাগতম। দ্রুত এবং নিরাপদে আপনার পরিচয় যাচাই করতে নির্দেশাবলী অনুসরণ করুন।",
    languageSelected: "ভাষা নির্বাচিত। KYC যাচাইকরণ প্রক্রিয়া শুরু করা হচ্ছে।",
    methodSelection: "অনুগ্রহ করে আপনার পছন্দের যাচাইকরণ পদ্ধতি বেছে নিন - তাৎক্ষণিক যাচাইকরণের জন্য DigiLocker বা ম্যানুয়াল ডকুমেন্ট আপলোড।",
    documentUpload: "অনুগ্রহ করে আপনার ডকুমেন্টের স্পষ্ট ছবি আপলোড করুন। নিশ্চিত করুন যে সমস্ত টেক্সট পড়া যায়।",
    faceVerification: "ক্যামেরায় আপনার মুখ রাখুন এবং লাইভনেস নির্দেশাবলী অনুসরণ করুন।",
    success: "অভিনন্দন! আপনার KYC যাচাইকরণ সম্পূর্ণ হয়েছে।"
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
      // Fallback to translation system
      const fallbackText = getTranslation(key, language);
      if (fallbackText === key) {
        console.warn(`Voice text not found for key: ${key}`);
        return;
      }
      speak(fallbackText, language);
      return;
    }

    setIsPlaying(true);

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set appropriate language code for speech synthesis
    const speechLangMap: Record<string, string> = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'bn': 'bn-IN',
      'te': 'te-IN',
      'mr': 'mr-IN',
      'ta': 'ta-IN',
      'gu': 'gu-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'pa': 'pa-IN',
      'or': 'or-IN',
      'as': 'as-IN',
      'ur': 'ur-IN',
      'ne': 'ne-NP',
      'si': 'si-LK'
    };
    
    utterance.lang = speechLangMap[language] || 'en-IN';
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