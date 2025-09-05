import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, Upload, CheckCircle, AlertCircle, FileText, X, RotateCcw } from "lucide-react";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import { useToast } from "@/hooks/use-toast";
import { getTranslation } from "@/lib/languages";

interface DocumentUploadProps {
  sessionToken: string;
  language: string;
  onComplete: () => void;
}

interface DocumentStatus {
  id: string;
  name: string;
  icon: any;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress?: number;
  required: boolean;
  uploadedFile?: File | null;
  capturedImage?: string | null;
}

export function DocumentUpload({ sessionToken, language, onComplete }: DocumentUploadProps) {
  const t = (key: string) => getTranslation(key, language);
  
  const [documents, setDocuments] = useState<DocumentStatus[]>([
    { id: 'aadhaar', name: t('aadhaarCard'), icon: FileText, status: 'pending', required: true },
    { id: 'pan', name: t('panCard'), icon: FileText, status: 'pending', required: true },
  ]);
  
  const [showCamera, setShowCamera] = useState(false);
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const { uploadDocument, uploading } = useDocumentUpload();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (docId: string, file: File) => {
    if (!sessionToken) {
      toast({
        title: t('error'),
        description: t('sessionExpired'),
        variant: "destructive",
      });
      return;
    }

    handleDocumentUpload(docId, file);
  };

  const handleDocumentUpload = async (docId: string, file: File) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, status: 'uploading', progress: 0, uploadedFile: file } : doc
    ));

    const result = await uploadDocument(sessionToken, docId, file);
    
    if (result) {
      setDocuments(prev => prev.map(doc => 
        doc.id === docId ? { ...doc, status: result.status === 'verified' ? 'success' : 'error', progress: 100 } : doc
      ));
      toast({
        title: t('success'),
        description: `${t(docId === 'aadhaar' ? 'aadhaarCard' : 'panCard')} ${t('verified')}`,
      });
    } else {
      setDocuments(prev => prev.map(doc => 
        doc.id === docId ? { ...doc, status: 'error', progress: 0 } : doc
      ));
      toast({
        title: t('error'),
        description: t('uploadError'),
        variant: "destructive",
      });
    }
  };

  const startCamera = async (docId: string) => {
    setCurrentDocId(docId);
    setCameraError(null);
    setCapturedImage(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera for documents
        }
      });
      
      setCameraStream(stream);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error: any) {
      setCameraError(t('cameraError'));
      toast({
        title: t('error'),
        description: t('cameraError'),
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
    setCurrentDocId(null);
    setCapturedImage(null);
    setCameraError(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageDataUrl);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const usePhoto = async () => {
    if (!capturedImage || !currentDocId) return;

    // Convert data URL to File
    const response = await fetch(capturedImage);
    const blob = await response.blob();
    const file = new File([blob], `${currentDocId}_${Date.now()}.jpg`, { type: 'image/jpeg' });

    stopCamera();
    handleDocumentUpload(currentDocId, file);
  };

  const triggerFileInput = (docId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileSelect(docId, file);
      }
    };
    input.click();
  };

  const retryUpload = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (doc?.uploadedFile) {
      handleDocumentUpload(docId, doc.uploadedFile);
    } else if (doc?.capturedImage) {
      // Retry with captured image
      fetch(doc.capturedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `${docId}_retry_${Date.now()}.jpg`, { type: 'image/jpeg' });
          handleDocumentUpload(docId, file);
        });
    } else {
      setDocuments(prev => prev.map(d => 
        d.id === docId ? { ...d, status: 'pending' } : d
      ));
    }
  };

  const allRequiredComplete = documents
    .filter(doc => doc.required)
    .every(doc => doc.status === 'success');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-success';
      case 'error': return 'text-error';
      case 'uploading': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (doc: DocumentStatus) => {
    switch (doc.status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-error" />;
      case 'uploading':
        return <div className="h-5 w-5 border-2 border-warning border-t-transparent rounded-full animate-spin" />;
      default:
        return <doc.icon className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">{t('uploadDocumentsTitle')}</h2>
        <p className="text-muted-foreground">{t('takeClearPhotosDesc')}</p>
      </div>

      <div className="space-y-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(doc)}
                  <div>
                    <h3 className="font-medium">{doc.name}</h3>
                    {doc.required && (
                      <Badge variant="outline" className="text-xs mt-1">{t('required')}</Badge>
                    )}
                  </div>
                </div>
                <span className={`text-sm font-medium ${getStatusColor(doc.status)}`}>
                  {doc.status === 'success' && `${t('verified')} ✓`}
                  {doc.status === 'error' && `${t('failed')} ✗`}
                  {doc.status === 'uploading' && `${t('uploading')}...`}
                  {doc.status === 'pending' && t('pending')}
                </span>
              </div>

              {doc.status === 'uploading' && (
                <Progress value={doc.progress || 0} className="h-2" />
              )}

              {doc.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => startCamera(doc.id)}
                    disabled={uploading}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {t('takePhoto')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => triggerFileInput(doc.id)}
                    disabled={uploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {t('uploadFile')}
                  </Button>
                </div>
              )}

              {doc.status === 'success' && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => startCamera(doc.id)}
                    disabled={uploading}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {t('retakePhoto')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => triggerFileInput(doc.id)}
                    disabled={uploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {t('reuploadFile')}
                  </Button>
                </div>
              )}

              {doc.status === 'error' && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-error border-error/50"
                    onClick={() => retryUpload(doc.id)}
                    disabled={uploading}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {t('retryUpload')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => startCamera(doc.id)}
                    disabled={uploading}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {t('retakePhoto')}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Camera Modal */}
      <Dialog open={showCamera} onOpenChange={stopCamera}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              {t('takePhoto')} - {currentDocId && t(currentDocId === 'aadhaar' ? 'aadhaarCard' : 'panCard')}
              <Button variant="ghost" size="sm" onClick={stopCamera}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {cameraError ? (
              <div className="text-center space-y-4">
                <AlertCircle className="h-12 w-12 mx-auto text-error" />
                <div>
                  <h3 className="font-semibold text-error">{t('cameraPermission')}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{t('cameraPermissionDesc')}</p>
                </div>
                <Button onClick={() => startCamera(currentDocId!)}>
                  {t('allowCamera')}
                </Button>
              </div>
            ) : capturedImage ? (
              <div className="space-y-4">
                <div className="relative">
                  <img 
                    src={capturedImage} 
                    alt="Captured document" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={retakePhoto}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {t('retakePhoto')}
                  </Button>
                  <Button
                    variant="hero"
                    className="flex-1"
                    onClick={usePhoto}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {t('confirm')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-64 object-cover rounded-lg bg-black"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Camera overlay guide */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="border-2 border-white border-dashed rounded-lg w-80 h-48 flex items-center justify-center">
                      <span className="text-white text-sm bg-black/50 px-2 py-1 rounded">
                        {t('positionFace')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={stopCamera}
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    variant="hero"
                    className="flex-1"
                    onClick={capturePhoto}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {t('takePhoto')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium text-sm mb-2">{t('tipsTitle')}</h4>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• {t('tip1')}</li>
            <li>• {t('tip2')}</li>
            <li>• {t('tip3')}</li>
            <li>• {t('tip4')}</li>
          </ul>
        </div>

        {allRequiredComplete && (
          <Button
            variant="success"
            size="xl"
            className="w-full"
            onClick={onComplete}
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            {t('continueToFace')}
          </Button>
        )}
      </div>
    </div>
  );
}