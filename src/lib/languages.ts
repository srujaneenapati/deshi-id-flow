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
    // Landing Page
    appTitle: "Digital KYC Bharat",
    appSubtitle: "Secure Identity Verification for Rural & Semi-Urban India",
    appDescription: "Complete your KYC verification in minutes with our lightweight, secure platform designed for all Indians",
    getStarted: "Get Started",
    learnMore: "Learn More",
    
    // Features
    featuresTitle: "Why Choose Digital KYC Bharat?",
    feature1Title: "Lightning Fast",
    feature1Desc: "Complete KYC in under 2 minutes",
    feature2Title: "100% Secure",
    feature2Desc: "Bank-grade encryption & security",
    feature3Title: "Works Offline",
    feature3Desc: "Low bandwidth, works on 2G/3G",
    feature4Title: "Multi-Language",
    feature4Desc: "Available in 15+ Indian languages",
    feature5Title: "DigiLocker Ready",
    feature5Desc: "Instant verification with government documents",
    feature6Title: "Voice Guided",
    feature6Desc: "Audio instructions in your language",
    
    // How it works
    howItWorksTitle: "How It Works",
    step1Title: "Choose Language",
    step1Desc: "Select your preferred language from 15+ options",
    step2Title: "Verify Documents",
    step2Desc: "Use DigiLocker or upload documents manually",
    step3Title: "Face Verification",
    step3Desc: "Quick face scan with liveness detection",
    step4Title: "Get Verified",
    step4Desc: "Receive instant verification certificate",
    
    // Trust indicators
    trustTitle: "Trusted by Millions",
    govApproved: "Government Approved",
    bankGrade: "Bank-Grade Security",
    dataProtected: "Data Protected",
    
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
    takeClearPhotosDesc: "Take clear photos of your documents",
    takePhoto: "Take Photo",
    uploadFile: "Upload File",
    retakePhoto: "Retake Photo",
    reuploadFile: "Reupload File",
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
    cameraPermission: "Camera Permission Required",
    cameraPermissionDesc: "Please allow camera access to take photos of your documents",
    allowCamera: "Allow Camera",
    
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
    cancel: "Cancel",
    confirm: "Confirm",
    next: "Next",
    previous: "Previous",
    close: "Close",
    save: "Save",
    loading: "Loading...",
    pleaseWait: "Please wait...",
    
    // Security
    secureConnection: "Secure Connection",
    encryptedData: "All data is encrypted",
    noDataStored: "No personal data stored permanently",
    gdprCompliant: "GDPR Compliant",
    
    // Errors
    networkError: "Network connection error. Please check your internet connection.",
    cameraError: "Unable to access camera. Please check permissions.",
    uploadError: "Upload failed. Please try again.",
    sessionExpired: "Session expired. Please start again.",
    invalidDocument: "Invalid document. Please upload a clear image.",
    faceNotDetected: "Face not detected. Please position your face properly.",
  },
  
  hi: {
    // Landing Page
    appTitle: "डिजिटल KYC भारत",
    appSubtitle: "ग्रामीण और अर्ध-शहरी भारत के लिए सुरक्षित पहचान सत्यापन",
    appDescription: "सभी भारतीयों के लिए डिज़ाइन किए गए हमारे हल्के, सुरक्षित प्लेटफॉर्म के साथ मिनटों में अपना KYC सत्यापन पूरा करें",
    getStarted: "शुरू करें",
    learnMore: "और जानें",
    
    // Features
    featuresTitle: "डिजिटल KYC भारत क्यों चुनें?",
    feature1Title: "बिजली की तेजी",
    feature1Desc: "2 मिनट से कम में KYC पूरा करें",
    feature2Title: "100% सुरक्षित",
    feature2Desc: "बैंक-ग्रेड एन्क्रिप्शन और सुरक्षा",
    feature3Title: "ऑफलाइन काम करता है",
    feature3Desc: "कम बैंडविड्थ, 2G/3G पर काम करता है",
    feature4Title: "बहुभाषी",
    feature4Desc: "15+ भारतीय भाषाओं में उपलब्ध",
    feature5Title: "डिजिलॉकर तैयार",
    feature5Desc: "सरकारी दस्तावेजों के साथ तत्काल सत्यापन",
    feature6Title: "आवाज़ निर्देशित",
    feature6Desc: "आपकी भाषा में ऑडियो निर्देश",
    
    // How it works
    howItWorksTitle: "यह कैसे काम करता है",
    step1Title: "भाषा चुनें",
    step1Desc: "15+ विकल्पों से अपनी पसंदीदा भाषा चुनें",
    step2Title: "दस्तावेज़ सत्यापित करें",
    step2Desc: "डिजिलॉकर का उपयोग करें या मैन्युअल रूप से दस्तावेज़ अपलोड करें",
    step3Title: "चेहरा सत्यापन",
    step3Desc: "लाइवनेस डिटेक्शन के साथ त्वरित फेस स्कैन",
    step4Title: "सत्यापित हो जाएं",
    step4Desc: "तत्काल सत्यापन प्रमाणपत्र प्राप्त करें",
    
    // Trust indicators
    trustTitle: "लाखों लोगों का भरोसा",
    govApproved: "सरकारी अनुमोदित",
    bankGrade: "बैंक-ग्रेड सुरक्षा",
    dataProtected: "डेटा सुरक्षित",
    
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
    takeClearPhotosDesc: "अपने दस्तावेज़ों की स्पष्ट तस्वीरें लें",
    takePhoto: "फोटो लें",
    uploadFile: "फाइल अपलोड करें",
    retakePhoto: "फिर से फोटो लें",
    reuploadFile: "फिर से अपलोड करें",
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
    cameraPermission: "कैमरा अनुमति आवश्यक",
    cameraPermissionDesc: "कृपया अपने दस्तावेज़ों की तस्वीरें लेने के लिए कैमरा एक्सेस की अनुमति दें",
    allowCamera: "कैमरा की अनुमति दें",
    
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
    cancel: "रद्द करें",
    confirm: "पुष्टि करें",
    next: "अगला",
    previous: "पिछला",
    close: "बंद करें",
    save: "सेव करें",
    loading: "लोड हो रहा है...",
    pleaseWait: "कृपया प्रतीक्षा करें...",
    
    // Security
    secureConnection: "सुरक्षित कनेक्शन",
    encryptedData: "सभी डेटा एन्क्रिप्टेड है",
    noDataStored: "कोई व्यक्तिगत डेटा स्थायी रूप से संग्रहीत नहीं",
    gdprCompliant: "GDPR अनुपालित",
    
    // Errors
    networkError: "नेटवर्क कनेक्शन त्रुटि। कृपया अपना इंटरनेट कनेक्शन जांचें।",
    cameraError: "कैमरा एक्सेस नहीं कर सकते। कृपया अनुमतियां जांचें।",
    uploadError: "अपलोड असफल। कृपया पुनः प्रयास करें।",
    sessionExpired: "सत्र समाप्त हो गया। कृपया फिर से शुरू करें।",
    invalidDocument: "अमान्य दस्तावेज़। कृपया एक स्पष्ट छवि अपलोड करें।",
    faceNotDetected: "चेहरा नहीं मिला। कृपया अपना चेहरा सही तरीके से रखें।",
  },
  
  // Add more languages with similar comprehensive translations
  bn: {
    appTitle: "ডিজিটাল KYC ভারত",
    appSubtitle: "গ্রামীণ ও আধা-শহুরে ভারতের জন্য নিরাপদ পরিচয় যাচাইকরণ",
    appDescription: "সকল ভারতীয়দের জন্য ডিজাইন করা আমাদের হালকা, নিরাপদ প্ল্যাটফর্মের সাথে মিনিটেই আপনার KYC যাচাইকরণ সম্পূর্ণ করুন",
    getStarted: "শুরু করুন",
    learnMore: "আরও জানুন",
    // ... add all other translations
  },
  
  // Add more languages as needed
};

export const getTranslation = (key: string, language: string = 'en'): string => {
  const langTranslations = translations[language as keyof typeof translations] || translations.en;
  return (langTranslations as any)[key] || (translations.en as any)[key] || key;
};