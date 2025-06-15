
import React, { useCallback, useState } from 'react';
import { Upload, File, X, Image, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { VIPFile } from '@/types/vip';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileSelect: (file: VIPFile | null) => void;
  currentFile?: VIPFile | null;
  label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  currentFile, 
  label = "Comprovante de Pagamento"
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    const allowedTypes = ['image/png', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Erro",
        description: "Apenas arquivos PNG e PDF são permitidos.",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: "Erro",
        description: "O arquivo deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileSelect = async (file: File) => {
    if (!validateFile(file)) return;

    setIsProcessing(true);
    try {
      const base64Data = await convertToBase64(file);
      
      const vipFile: VIPFile = {
        name: file.name,
        type: file.type,
        size: file.size,
        data: base64Data
      };

      onFileSelect(vipFile);
      
      toast({
        title: "Arquivo carregado",
        description: `${file.name} foi carregado com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar o arquivo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeFile = () => {
    onFileSelect(null);
    toast({
      title: "Arquivo removido",
      description: "O comprovante foi removido.",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type === 'application/pdf') {
      return <FileText className="w-8 h-8 text-red-500" />;
    }
    if (type.startsWith('image/')) {
      return <Image className="w-8 h-8 text-blue-500" />;
    }
    return <File className="w-8 h-8 text-gray-500" />;
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      {currentFile ? (
        <div className="border rounded-lg p-4 bg-card/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFileIcon(currentFile.type)}
              <div>
                <p className="font-medium text-sm">{currentFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(currentFile.size)}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={removeFile}
              className="hover:bg-destructive/10 hover:text-destructive"
              disabled={isProcessing}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-sm font-medium mb-2">
            Arraste e solte um arquivo aqui, ou clique para selecionar
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            PNG ou PDF, máximo 5MB
          </p>
          <input
            type="file"
            accept=".png,.pdf"
            onChange={handleInputChange}
            className="hidden"
            id="file-upload"
            disabled={isProcessing}
          />
          <Button type="button" variant="outline" asChild disabled={isProcessing}>
            <label htmlFor="file-upload" className="cursor-pointer">
              {isProcessing ? "Processando..." : "Selecionar Arquivo"}
            </label>
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
