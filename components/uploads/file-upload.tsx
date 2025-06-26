'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, X, Check, AlertCircle, CloudUpload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  url?: string;
}

export function FileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  console.log('FileUpload: Component rendered with files:', files.length);

  const handleFiles = (fileList: FileList) => {
    console.log('FileUpload: Processing files:', fileList.length);
    
    const newFiles: UploadedFile[] = Array.from(fileList).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate file uploads
    newFiles.forEach(file => {
      simulateUpload(file.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    console.log('FileUpload: Starting upload simulation for:', fileId);
    
    const interval = setInterval(() => {
      setFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          const newProgress = Math.min(file.progress + Math.random() * 20, 100);
          const isComplete = newProgress >= 100;
          
          if (isComplete) {
            clearInterval(interval);
            console.log('FileUpload: Upload completed for:', fileId);
            toast.success(`File "${file.name}" uploaded successfully!`);
            
            return {
              ...file,
              progress: 100,
              status: Math.random() > 0.1 ? 'completed' : 'error',
              url: `https://s3.amazonaws.com/bucket/${file.name}`
            };
          }
          
          return { ...file, progress: newProgress };
        }
        return file;
      }));
    }, 200);
  };

  const removeFile = (fileId: string) => {
    console.log('FileUpload: Removing file:', fileId);
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('text')) return '📝';
    if (type.includes('video')) return '🎥';
    if (type.includes('audio')) return '🎵';
    return '📁';
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center text-text-primary">
              <CloudUpload className="w-5 h-5 mr-2 text-primary-blue" />
              File Upload Center
            </CardTitle>
            <CardDescription className="text-text-secondary">
              Upload assessment files, reports, and documents for analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                dragActive 
                  ? 'border-primary-blue bg-primary-blue/10' 
                  : 'border-dark-border hover:border-primary-blue/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <motion.div
                animate={{ 
                  scale: dragActive ? 1.1 : 1,
                  rotate: dragActive ? 5 : 0 
                }}
                transition={{ duration: 0.2 }}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-text-secondary" />
              </motion.div>
              
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Drop files here or click to browse
              </h3>
              <p className="text-text-secondary mb-4">
                Supports: PDF, Images, CSV, JSON, TXT files up to 10MB
              </p>
              
              <Button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.multiple = true;
                  input.accept = '.pdf,.png,.jpg,.jpeg,.csv,.json,.txt';
                  input.onchange = (e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.files) {
                      handleFiles(target.files);
                    }
                  };
                  input.click();
                }}
                className="bg-primary-blue hover:bg-primary-blue/90"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* File List */}
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-text-primary">
                Upload Progress ({files.length} files)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {files.map((file, index) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 glass-card rounded-lg"
                  >
                    <div className="text-2xl">
                      {getFileIcon(file.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {file.name}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            file.status === 'completed' ? 'default' :
                            file.status === 'error' ? 'destructive' : 'secondary'
                          }>
                            {file.status === 'completed' && <Check className="w-3 h-3 mr-1" />}
                            {file.status === 'error' && <AlertCircle className="w-3 h-3 mr-1" />}
                            {file.status === 'uploading' && <Upload className="w-3 h-3 mr-1" />}
                            {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            className="text-text-secondary hover:text-error-red"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
                        <span>{formatFileSize(file.size)}</span>
                        <span>{Math.round(file.progress)}%</span>
                      </div>
                      
                      <Progress value={file.progress} className="h-2" />
                      
                      {file.url && file.status === 'completed' && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-success-green mt-2"
                        >
                          Uploaded to: {file.url}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Upload Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success-green">
              {files.filter(f => f.status === 'completed').length}
            </div>
            <div className="text-sm text-text-secondary">Completed</div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning-amber">
              {files.filter(f => f.status === 'uploading').length}
            </div>
            <div className="text-sm text-text-secondary">In Progress</div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-error-red">
              {files.filter(f => f.status === 'error').length}
            </div>
            <div className="text-sm text-text-secondary">Failed</div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}