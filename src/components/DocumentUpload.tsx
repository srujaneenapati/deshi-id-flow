import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Camera, Upload, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploadProps {
  sessionToken: string;
  onComplete: () => void;
}

interface DocumentStatus {
  id: string;
  name: string;
  icon: any;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress?: number;
  required: boolean;
}

export function DocumentUpload({ sessionToken, onComplete }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<DocumentStatus[]>([
    { id: 'aadhaar', name: 'Aadhaar Card', icon: FileText, status: 'pending', required: true },
    { id: 'pan', name: 'PAN Card', icon: FileText, status: 'pending', required: true },
  ]);
  const { uploadDocument, uploading } = useDocumentUpload();
  const { toast } = useToast();
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileSelect = (docId: string, file: File) => {
    if (!sessionToken) {
      toast({
        title: "Error",
        description: "No active session found. Please restart KYC.",
        variant: "destructive",
      });
      return;
    }

    handleDocumentUpload(docId, file);
  };

  const handleDocumentUpload = async (docId: string, file: File) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, status: 'uploading', progress: 0 } : doc
    ));

    const result = await uploadDocument(sessionToken, docId, file);
    
    if (result) {
      setDocuments(prev => prev.map(doc => 
        doc.id === docId ? { ...doc, status: result.status === 'verified' ? 'success' : 'error', progress: 100 } : doc
      ));
      toast({
        title: "Upload Successful",
        description: `${docId.toUpperCase()} document verified successfully`,
      });
    } else {
      setDocuments(prev => prev.map(doc => 
        doc.id === docId ? { ...doc, status: 'error', progress: 0 } : doc
      ));
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    }
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
        <h2 className="text-2xl font-bold text-foreground">Upload Documents</h2>
        <p className="text-muted-foreground">Take clear photos of your documents</p>
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
                      <Badge variant="outline" className="text-xs mt-1">Required</Badge>
                    )}
                  </div>
                </div>
                <span className={`text-sm font-medium ${getStatusColor(doc.status)}`}>
                  {doc.status === 'success' && 'Verified ✓'}
                  {doc.status === 'error' && 'Failed ✗'}
                  {doc.status === 'uploading' && 'Uploading...'}
                  {doc.status === 'pending' && 'Pending'}
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
                    onClick={() => triggerFileInput(doc.id)}
                    disabled={uploading}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => triggerFileInput(doc.id)}
                    disabled={uploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                </div>
              )}

              {doc.status === 'error' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-error border-error/50"
                  onClick={() => triggerFileInput(doc.id)}
                  disabled={uploading}
                >
                  Retry Upload
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium text-sm mb-2">Tips for better verification:</h4>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• Ensure good lighting and clear image</li>
            <li>• Keep documents flat and avoid glare</li>
            <li>• Make sure all text is readable</li>
            <li>• Use landscape orientation for better quality</li>
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
            Continue to Face Verification
          </Button>
        )}
      </div>
    </div>
  );
}