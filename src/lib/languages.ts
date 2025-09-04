export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

export const supportedLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇮🇳', rtl: true },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', flag: '🇱🇰' },
];

export const translations = {
  en: {
    // Welcome Screen
    welcomeTitle: "Digital KYC",
    welcomeSubtitle: "Secure Identity Verification",
    welcomeDescription: "Verify your identity quickly and securely",
    listenAudio: "Listen to Audio Guide",
    startKYC: "Start KYC Verification",
    quickEasy: "Quick & Easy",
    completeIn2Min: "Complete in 2 minutes",
    secure: "100% Secure",
    bankGradeSecurity: "Bank-grade security",
    instantVerification: "Instant Verification",
    realTimeApproval: "Real-time approval",
    dataSecure: "Your data is encrypted and secure",
    govRecognized: "Government Recognized • DigiLocker Supported",
    
    // Method Selection
    completeKYC: "Complete Your KYC",
    chooseMethod: "Choose your preferred verification method",
    digilockerKYC: "DigiLocker KYC",
    instantSecure: "Instant & Secure",
    autoFetch: "Auto-fetch from DigiLocker",
    govVerified: "Government verified documents",
    fastestVerification: "Fastest verification",
    continueDigilocker: "Continue with DigiLocker",
    uploadDocuments: "Upload Documents",
    manualVerification: "Manual Verification",
    uploadAadhaarPan: "Upload Aadhaar, PAN, etc.",
    takeClearPhotos: "Take clear photos",
    worksWithoutDigilocker: "Works without DigiLocker",
    
    // DigiLocker Auth
    digilockerAuth: "DigiLocker Authorization",
    allowSecureAccess: "Allow secure access to your documents",
    requestAccess: "We request access to:",
    aadhaarCard: "Aadhaar Card",
    panCard: "PAN Card",
    drivingLicense: "Driving License",
    required: "Required",
    optional: "Optional",
    connectDigilocker: "Connect with DigiLocker",
    redirectNotice: "You will be redirected to DigiLocker's official website",
    
    // Document Upload
    uploadDocumentsTitle: "Upload Documents",
    takeClearPhotos: "Take clear photos of your documents",
    takePhoto: "Take Photo",
    uploadFile: "Upload File",
    retryUpload: "Retry Upload",
    verified: "Verified",
    failed: "Failed",
    uploading: "Uploading...",
    pending: "Pending",
    tipsTitle: "Tips for better verification:",
    tip1: "Ensure good lighting and clear image",
    tip2: "Keep documents flat and avoid glare",
    tip3: "Make sure all text is readable",
    tip4: "Use landscape orientation for better quality",
    continueToFace: "Continue to Face Verification",
    
    // Face Authentication
    faceVerification: "Face Verification",
    verifyIdentity: "We'll verify your identity with a quick face scan",
    positionFace: "Position Your Face",
    faceClearlyVisible: "Make sure your face is clearly visible and well-lit",
    startFaceVerification: "Start Face Verification",
    followInstructions: "Follow the Instructions",
    blinkTwice: "Blink twice slowly",
    smileNaturally: "Smile naturally",
    turnHead: "Turn head left and right",
    matchingFace: "Matching Your Face",
    comparingPhoto: "Comparing with your document photo...",
    
    // Success Screen
    kycSuccessful: "KYC Successful!",
    kycCompleted: "Your KYC has been completed successfully",
    voiceConfirmation: "Voice Confirmation",
    audioConfirmation: "Audio confirmation completed",
    verificationSummary: "Verification Summary",
    kycId: "KYC ID",
    faceMatch: "Face Match",
    completed: "Completed",
    continueToApp: "Continue to App",
    downloadReport: "Download Report",
    shareKYC: "Share KYC",
    dataSecureNotice: "Your Data is Secure",
    dataProtectionNotice: "All documents are encrypted and stored securely. We comply with data protection regulations.",
    
    // Common
    connecting: "Connecting...",
    success: "Success",
    error: "Error",
    tryAgain: "Try Again",
    done: "Done",
    complete: "Complete",
    minutes: "min",
    playing: "Playing...",
    replay: "Replay",
  },
  
  hi: {
    // Welcome Screen
    welcomeTitle: "डिजिटल KYC",
    welcomeSubtitle: "सुरक्षित पहचान सत्यापन",
    welcomeDescription: "अपनी पहचान को जल्दी और सुरक्षित रूप से सत्यापित करें",
    listenAudio: "ऑडियो गाइड सुनें",
    startKYC: "KYC सत्यापन शुरू करें",
    quickEasy: "त्वरित और आसान",
    completeIn2Min: "2 मिनट में पूरा करें",
    secure: "100% सुरक्षित",
    bankGradeSecurity: "बैंक-ग्रेड सुरक्षा",
    instantVerification: "तत्काल सत्यापन",
    realTimeApproval: "रियल-टाइम अप्रूवल",
    dataSecure: "आपका डेटा एन्क्रिप्टेड और सुरक्षित है",
    govRecognized: "सरकारी मान्यता प्राप्त • डिजिलॉकर समर्थित",
    
    // Method Selection
    completeKYC: "अपना KYC पूरा करें",
    chooseMethod: "अपनी पसंदीदा सत्यापन विधि चुनें",
    digilockerKYC: "डिजिलॉकर KYC",
    instantSecure: "तत्काल और सुरक्षित",
    autoFetch: "डिजिलॉकर से ऑटो-फेच",
    govVerified: "सरकारी सत्यापित दस्तावेज़",
    fastestVerification: "सबसे तेज़ सत्यापन",
    continueDigilocker: "डिजिलॉकर के साथ जारी रखें",
    uploadDocuments: "दस्तावेज़ अपलोड करें",
    manualVerification: "मैन्युअल सत्यापन",
    uploadAadhaarPan: "आधार, पैन आदि अपलोड करें",
    takeClearPhotos: "स्पष्ट तस्वीरें लें",
    worksWithoutDigilocker: "डिजिलॉकर के बिना काम करता है",
    
    // DigiLocker Auth
    digilockerAuth: "डिजिलॉकर प्राधिकरण",
    allowSecureAccess: "अपने दस्तावेज़ों तक सुरक्षित पहुंच की अनुमति दें",
    requestAccess: "हम निम्नलिखित तक पहुंच का अनुरोध करते हैं:",
    aadhaarCard: "आधार कार्ड",
    panCard: "पैन कार्ड",
    drivingLicense: "ड्राइविंग लाइसेंस",
    required: "आवश्यक",
    optional: "वैकल्पिक",
    connectDigilocker: "डिजिलॉकर से कनेक्ट करें",
    redirectNotice: "आपको डिजिलॉकर की आधिकारिक वेबसाइट पर रीडायरेक्ट किया जाएगा",
    
    // Document Upload
    uploadDocumentsTitle: "दस्तावेज़ अपलोड करें",
    takeClearPhotos: "अपने दस्तावेज़ों की स्पष्ट तस्वीरें लें",
    takePhoto: "फोटो लें",
    uploadFile: "फाइल अपलोड करें",
    retryUpload: "पुनः अपलोड करें",
    verified: "सत्यापित",
    failed: "असफल",
    uploading: "अपलोड हो रहा है...",
    pending: "लंबित",
    tipsTitle: "बेहतर सत्यापन के लिए सुझाव:",
    tip1: "अच्छी रोशनी और स्पष्ट छवि सुनिश्चित करें",
    tip2: "दस्तावेज़ों को सपाट रखें और चकाचौंध से बचें",
    tip3: "सुनिश्चित करें कि सभी टेक्स्ट पढ़ने योग्य है",
    tip4: "बेहतर गुणवत्ता के लिए लैंडस्केप ओरिएंटेशन का उपयोग करें",
    continueToFace: "फेस वेरिफिकेशन के लिए जारी रखें",
    
    // Face Authentication
    faceVerification: "फेस वेरिफिकेशन",
    verifyIdentity: "हम एक त्वरित फेस स्कैन के साथ आपकी पहचान सत्यापित करेंगे",
    positionFace: "अपना चेहरा स्थिति में रखें",
    faceClearlyVisible: "सुनिश्चित करें कि आपका चेहरा स्पष्ट रूप से दिखाई दे और अच्छी तरह से रोशन हो",
    startFaceVerification: "फेस वेरिफिकेशन शुरू करें",
    followInstructions: "निर्देशों का पालन करें",
    blinkTwice: "धीरे-धीरे दो बार पलक झपकाएं",
    smileNaturally: "प्राकृतिक रूप से मुस्कुराएं",
    turnHead: "सिर को बाएं और दाएं घुमाएं",
    matchingFace: "आपके चेहरे का मिलान",
    comparingPhoto: "आपके दस्तावेज़ की तस्वीर से तुलना कर रहे हैं...",
    
    // Success Screen
    kycSuccessful: "KYC सफल!",
    kycCompleted: "आपका KYC सफलतापूर्वक पूरा हो गया है",
    voiceConfirmation: "आवाज़ पुष्टि",
    audioConfirmation: "ऑडियो पुष्टि पूरी हुई",
    verificationSummary: "सत्यापन सारांश",
    kycId: "KYC ID",
    faceMatch: "फेस मैच",
    completed: "पूर्ण",
    continueToApp: "ऐप में जारी रखें",
    downloadReport: "रिपोर्ट डाउनलोड करें",
    shareKYC: "KYC साझा करें",
    dataSecureNotice: "आपका डेटा सुरक्षित है",
    dataProtectionNotice: "सभी दस्तावेज़ एन्क्रिप्टेड हैं और सुरक्षित रूप से संग्रहीत हैं। हम डेटा सुरक्षा नियमों का पालन करते हैं।",
    
    // Common
    connecting: "कनेक्ट हो रहा है...",
    success: "सफल",
    error: "त्रुटि",
    tryAgain: "पुनः प्रयास करें",
    done: "पूर्ण",
    complete: "पूरा",
    minutes: "मिनट",
    playing: "चल रहा है...",
    replay: "पुनः चलाएं",
  },
  
  // Add more languages with similar structure
  bn: {
    welcomeTitle: "ডিজিটাল KYC",
    welcomeSubtitle: "নিরাপদ পরিচয় যাচাইকরণ",
    welcomeDescription: "দ্রুত এবং নিরাপদে আপনার পরিচয় যাচাই করুন",
    startKYC: "KYC যাচাইকরণ শুরু করুন",
    // ... add all other translations
  },
  
  te: {
    welcomeTitle: "డిజిటల్ KYC",
    welcomeSubtitle: "సురక్షిత గుర్తింపు ధృవీకరణ",
    welcomeDescription: "మీ గుర్తింపును త్వరగా మరియు సురక్షితంగా ధృవీకరించండి",
    startKYC: "KYC ధృవీకరణను ప్రారంభించండి",
    // ... add all other translations
  },
  
  // Add more languages as needed
};

export const getTranslation = (key: string, language: string = 'en'): string => {
  const langTranslations = translations[language as keyof typeof translations] || translations.en;
  return (langTranslations as any)[key] || (translations.en as any)[key] || key;
};