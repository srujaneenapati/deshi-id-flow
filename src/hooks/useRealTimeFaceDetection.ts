import { useState, useRef, useCallback, useEffect } from 'react';

export interface FaceDetectionResult {
  isDetected: boolean;
  confidence: number;
  landmarks?: any[];
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface LivenessDetection {
  blink: boolean;
  smile: boolean;
  headTurn: boolean;
  eyeMovement: boolean;
}

export const useRealTimeFaceDetection = () => {
  const [isActive, setIsActive] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [livenessStatus, setLivenessStatus] = useState<LivenessDetection>({
    blink: false,
    smile: false,
    headTurn: false,
    eyeMovement: false
  });
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Face detection state
  const previousFaceDataRef = useRef<any>(null);
  const blinkCountRef = useRef(0);
  const smileDetectedRef = useRef(false);
  const headTurnDetectedRef = useRef(false);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setIsActive(true);
      startFaceDetection();
    } catch (err: any) {
      setError(`Camera access failed: ${err.message}`);
      console.error('Camera access error:', err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    
    setIsActive(false);
    setFaceDetected(false);
  }, []);

  const startFaceDetection = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    detectionIntervalRef.current = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        detectFaceAndLiveness(video, canvas, ctx);
      }
    }, 100); // Check every 100ms for real-time detection
  }, []);

  const detectFaceAndLiveness = useCallback((
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) => {
    // Draw current frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image data for analysis
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Simple face detection using brightness and color analysis
    const faceDetectionResult = performSimpleFaceDetection(imageData);
    
    setFaceDetected(faceDetectionResult.isDetected);
    
    if (faceDetectionResult.isDetected) {
      // Perform liveness checks
      const livenessResult = performLivenessChecks(imageData, previousFaceDataRef.current);
      
      setLivenessStatus(prev => ({
        blink: prev.blink || livenessResult.blink,
        smile: prev.smile || livenessResult.smile,
        headTurn: prev.headTurn || livenessResult.headTurn,
        eyeMovement: prev.eyeMovement || livenessResult.eyeMovement
      }));
      
      previousFaceDataRef.current = {
        timestamp: Date.now(),
        brightness: calculateAverageBrightness(imageData),
        centerRegion: getCenterRegionData(imageData)
      };
    }
  }, []);

  const performSimpleFaceDetection = (imageData: ImageData): FaceDetectionResult => {
    const { data, width, height } = imageData;
    
    // Simple skin tone detection in center region
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const regionSize = 100;
    
    let skinPixels = 0;
    let totalPixels = 0;
    
    for (let y = centerY - regionSize; y < centerY + regionSize; y++) {
      for (let x = centerX - regionSize; x < centerX + regionSize; x++) {
        if (x >= 0 && x < width && y >= 0 && y < height) {
          const index = (y * width + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          
          // Simple skin tone detection
          if (isSkinTone(r, g, b)) {
            skinPixels++;
          }
          totalPixels++;
        }
      }
    }
    
    const skinRatio = skinPixels / totalPixels;
    const isDetected = skinRatio > 0.3; // At least 30% skin tone in center
    
    return {
      isDetected,
      confidence: skinRatio,
      boundingBox: isDetected ? {
        x: centerX - regionSize,
        y: centerY - regionSize,
        width: regionSize * 2,
        height: regionSize * 2
      } : undefined
    };
  };

  const performLivenessChecks = (imageData: ImageData, previousData: any) => {
    const currentBrightness = calculateAverageBrightness(imageData);
    const currentTime = Date.now();
    
    let blink = false;
    let smile = false;
    let headTurn = false;
    let eyeMovement = false;
    
    if (previousData) {
      const timeDiff = currentTime - previousData.timestamp;
      const brightnessDiff = Math.abs(currentBrightness - previousData.brightness);
      
      // Detect blink (sudden brightness change in eye region)
      if (brightnessDiff > 10 && timeDiff < 500) {
        blinkCountRef.current++;
        if (blinkCountRef.current >= 2) {
          blink = true;
        }
      }
      
      // Detect smile (brightness increase in lower face region)
      const lowerFaceData = getLowerFaceRegionData(imageData);
      if (lowerFaceData.brightness > previousData.centerRegion?.brightness * 1.1) {
        smile = true;
        smileDetectedRef.current = true;
      }
      
      // Detect head movement (significant change in face position)
      const positionChange = calculatePositionChange(imageData, previousData.centerRegion);
      if (positionChange > 20) {
        headTurn = true;
        headTurnDetectedRef.current = true;
      }
      
      // Eye movement detection (subtle brightness changes in eye regions)
      eyeMovement = detectEyeMovement(imageData, previousData);
    }
    
    return { blink, smile, headTurn, eyeMovement };
  };

  // Helper functions
  const isSkinTone = (r: number, g: number, b: number): boolean => {
    // Simple skin tone detection algorithm
    return (
      r > 95 && g > 40 && b > 20 &&
      Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
      Math.abs(r - g) > 15 && r > g && r > b
    );
  };

  const calculateAverageBrightness = (imageData: ImageData): number => {
    const { data } = imageData;
    let total = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      total += brightness;
    }
    
    return total / (data.length / 4);
  };

  const getCenterRegionData = (imageData: ImageData) => {
    const { width, height } = imageData;
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    
    return {
      x: centerX,
      y: centerY,
      brightness: calculateRegionBrightness(imageData, centerX - 50, centerY - 50, 100, 100)
    };
  };

  const getLowerFaceRegionData = (imageData: ImageData) => {
    const { width, height } = imageData;
    const centerX = Math.floor(width / 2);
    const lowerY = Math.floor(height * 0.6);
    
    return {
      brightness: calculateRegionBrightness(imageData, centerX - 50, lowerY, 100, 50)
    };
  };

  const calculateRegionBrightness = (
    imageData: ImageData,
    startX: number,
    startY: number,
    regionWidth: number,
    regionHeight: number
  ): number => {
    const { data, width } = imageData;
    let total = 0;
    let count = 0;
    
    for (let y = startY; y < startY + regionHeight; y++) {
      for (let x = startX; x < startX + regionWidth; x++) {
        if (x >= 0 && x < width && y >= 0 && y < imageData.height) {
          const index = (y * width + x) * 4;
          const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;
          total += brightness;
          count++;
        }
      }
    }
    
    return count > 0 ? total / count : 0;
  };

  const calculatePositionChange = (imageData: ImageData, previousCenter: any): number => {
    if (!previousCenter) return 0;
    
    const currentCenter = getCenterRegionData(imageData);
    const dx = currentCenter.x - previousCenter.x;
    const dy = currentCenter.y - previousCenter.y;
    
    return Math.sqrt(dx * dx + dy * dy);
  };

  const detectEyeMovement = (imageData: ImageData, previousData: any): boolean => {
    // Simplified eye movement detection
    const { width, height } = imageData;
    const leftEyeRegion = calculateRegionBrightness(imageData, width * 0.3, height * 0.4, 30, 20);
    const rightEyeRegion = calculateRegionBrightness(imageData, width * 0.7, height * 0.4, 30, 20);
    
    if (previousData.eyeRegions) {
      const leftChange = Math.abs(leftEyeRegion - previousData.eyeRegions.left);
      const rightChange = Math.abs(rightEyeRegion - previousData.eyeRegions.right);
      
      return leftChange > 5 || rightChange > 5;
    }
    
    return false;
  };

  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  const resetLivenessChecks = useCallback(() => {
    setLivenessStatus({
      blink: false,
      smile: false,
      headTurn: false,
      eyeMovement: false
    });
    blinkCountRef.current = 0;
    smileDetectedRef.current = false;
    headTurnDetectedRef.current = false;
    previousFaceDataRef.current = null;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
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
    isSupported: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  };
};