
import { useState, useEffect } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { uploadVideo, deleteVideoFromStorage } from '@/services/videoService';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/sonner';

interface VideoUploadProps {
  onUploadComplete?: (file: File, fileUrl: string, filePath: string) => void;
}

const VideoUpload = ({ onUploadComplete }: VideoUploadProps) => {
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  // Clean up the preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length) {
      handleFiles(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];
    
    // Validate file is a video
    if (!file.type.startsWith('video/')) {
      setError('Please upload a video file');
      return;
    }
    
    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      setError('File size exceeds 50MB limit');
      return;
    }
    
    // Reset error state
    setError(null);
    
    // Create preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setUploadedFile(file);
    
    // Start actual upload
    uploadFileToSupabase(file);
  };

  const uploadFileToSupabase = async (file: File) => {
    if (!user) {
      setError('You must be logged in to upload videos');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Use an interval to simulate progress until the actual upload completes
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 5;
        });
      }, 300);
      
      // Upload to Supabase Storage
      const { filePath: path, publicUrl } = await uploadVideo(file, user.id);
      setFilePath(path);
      setFileUrl(publicUrl);
      
      // Complete the progress bar
      clearInterval(progressInterval);
      setUploadProgress(100);
      setIsUploading(false);
      
      // Call the onUploadComplete callback
      if (onUploadComplete) {
        onUploadComplete(file, publicUrl, path);
      }
      
      toast({
        title: "Upload successful",
        description: "Your video has been uploaded successfully."
      });
    } catch (error: any) {
      setError(error.message || 'Upload failed');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = async () => {
    // Remove from preview
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    // Delete from storage if uploaded
    if (filePath) {
      try {
        await deleteVideoFromStorage(filePath);
      } catch (error) {
        console.error('Error deleting file from storage:', error);
        // Continue anyway, we want to clear the UI
      }
    }
    
    // Reset state
    setUploadedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    setIsUploading(false);
    setError(null);
    setFilePath(null);
    setFileUrl(null);
  };

  return (
    <div className="w-full">
      <Toaster />
      {!uploadedFile ? (
        <div
          className={cn(
            "glass-panel w-full aspect-video flex flex-col items-center justify-center p-8 transition-all duration-300",
            isDragging ? "border-primary bg-primary/5" : "",
            error ? "border-destructive bg-destructive/5" : ""
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="video-upload"
            accept="video/*"
            className="sr-only"
            onChange={handleFileInput}
          />
          
          <Upload className={cn(
            "h-12 w-12 mb-5 transition-all duration-300",
            isDragging ? "text-primary scale-110" : "text-muted-foreground",
            error ? "text-destructive" : ""
          )} />
          
          <h3 className="text-xl font-medium mb-2">Upload your video</h3>
          <p className="text-center text-muted-foreground mb-6 max-w-sm">
            Drag and drop your video file here, or click to browse
          </p>
          
          {error && (
            <div className="flex items-center text-destructive mb-5">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          )}
          
          <label 
            htmlFor="video-upload"
            className="glass-button bg-primary text-white hover:bg-primary/90 cursor-pointer"
          >
            Select Video
          </label>
        </div>
      ) : (
        <div className="glass-panel w-full overflow-hidden transition-all duration-300 animate-scale-in">
          {previewUrl && (
            <div className="relative aspect-video bg-black rounded-t-xl overflow-hidden">
              <video
                src={previewUrl}
                className="absolute inset-0 w-full h-full object-contain"
                controls
              />
            </div>
          )}
          
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-medium text-lg truncate max-w-xs">
                  {uploadedFile.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              
              <button 
                onClick={removeFile}
                className="glass-button p-2 hover:bg-destructive/10"
                title="Remove video"
              >
                <Trash2 className="h-5 w-5 text-destructive" />
              </button>
            </div>
            
            {isUploading ? (
              <div className="space-y-2">
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-right text-muted-foreground">
                  {uploadProgress}% uploaded
                </p>
              </div>
            ) : uploadProgress === 100 ? (
              <div className="flex items-center text-primary">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Upload complete</span>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
