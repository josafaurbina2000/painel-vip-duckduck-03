import React, { useCallback, useState } from 'react';
import { Upload, File, X, Image, FileText, CheckCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { VIPFile } from '@/types/vip';
import { useToast } from '@/hooks/use-toast';
import { useStorageUpload } from '@/hooks/useStorageUpload';

interface FileUploadProps {
  onFileSelect: (file: VIPFile | null) => void;
  currentFile?: VIPFile | null;
  label?: string;
  isEditMode?: boolean;
  onAutoSave?: (file: VIPFile) => Promise<void>;
  onAutoRemove?: () => Promise<void>;
  isSaving?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  currentFile, 
  label = "Comprovante de Pagamento",
  isEditMode = false,
  onAutoSave,
  onAutoRemove,
  isSaving = false
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [pendingFile, setPendingFile] = useState<VIPFile | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [autoSaveFailed, setAutoSaveFailed] = useState(false);
  const { toast } = useToast();
  const { uploadFile, deleteFile, isUploading } = useStorageUpload();

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

  const handleFileSelect = async (file: File) => {
    console.log('Arquivo selecionado:', file.name, file.type, file.size);
    if (!validateFile(file)) return;

    setAutoSaveFailed(false);

    try {
      // Upload para o Supabase Storage
      const storageFile = await uploadFile(file);
      if (!storageFile) return;

      const vipFile: VIPFile = {
        name: storageFile.name,
        type: storageFile.type,
        size: storageFile.size,
        url: storageFile.url,
        path: storageFile.path
      };

      console.log('Arquivo carregado para storage:', vipFile);

      if (isEditMode && onAutoSave) {
        // Em modo de edição, tentar auto-salvar
        setPendingFile(vipFile);
        
        try {
          await onAutoSave(vipFile);
          setPendingFile(null);
          onFileSelect(vipFile);
          toast({
            title: "Comprovante salvo!",
            description: `${file.name} foi salvo automaticamente.`,
          });
        } catch (error) {
          console.error('Erro ao salvar automaticamente:', error);
          setAutoSaveFailed(true);
          setPendingFile(null);
          
          // Manter o arquivo carregado mesmo se o auto-save falhar
          onFileSelect(vipFile);
          
          toast({
            title: "Arquivo carregado",
            description: "O arquivo foi carregado com sucesso. Para salvar definitivamente, clique em 'Atualizar VIP'.",
            variant: "default",
          });
        }
      } else {
        // Modo de criação, apenas selecionar
        onFileSelect(vipFile);
        toast({
          title: "Arquivo carregado",
          description: `${file.name} foi carregado. Clique em "Adicionar VIP" para salvar.`,
        });
      }
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar o arquivo. Tente novamente.",
        variant: "destructive",
      });
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

  const removeFile = async () => {
    console.log('Removendo arquivo');
    setAutoSaveFailed(false);
    
    if (isEditMode && onAutoRemove && currentFile) {
      // Em modo de edição, tentar auto-remover do banco
      setIsRemoving(true);
      
      try {
        await onAutoRemove();
        
        // Remover do storage se tiver path
        if (currentFile.path) {
          await deleteFile(currentFile.path);
        }
        
        setPendingFile(null);
        onFileSelect(null);
        toast({
          title: "Comprovante removido!",
          description: "O comprovante foi removido automaticamente.",
        });
      } catch (error) {
        console.error('Erro ao remover automaticamente:', error);
        setAutoSaveFailed(true);
        
        // Mesmo com erro no auto-remove, permitir remoção local
        onFileSelect(null);
        
        toast({
          title: "Arquivo removido localmente",
          description: "Para confirmar a remoção, clique em 'Atualizar VIP'.",
          variant: "default",
        });
      } finally {
        setIsRemoving(false);
      }
    } else {
      // Modo de criação ou sem auto-remove, apenas remover localmente
      const fileToRemove = pendingFile || currentFile;
      
      // Se o arquivo tem path, remover do storage
      if (fileToRemove?.path) {
        await deleteFile(fileToRemove.path);
      }
      
      setPendingFile(null);
      onFileSelect(null);
      toast({
        title: "Arquivo removido",
        description: isEditMode ? "Clique em 'Atualizar VIP' para salvar a remoção." : "O comprovante foi removido.",
      });
    }
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

  const displayFile = pendingFile || currentFile;
  const isFileSaved = currentFile && !pendingFile && !autoSaveFailed;
  const isFilePending = pendingFile !== null;
  const isProcessing = isUploading || isSaving || isRemoving;

  return (
    <div className="space-y-4">
      <Label className="flex items-center gap-2">
        {label}
        {isFileSaved && <CheckCircle className="w-4 h-4 text-green-500" />}
        {isFilePending && <Save className="w-4 h-4 text-blue-500 animate-pulse" />}
        {autoSaveFailed && <X className="w-4 h-4 text-red-500" />}
      </Label>
      
      {displayFile ? (
        <div className={`border rounded-lg p-4 ${
          isFileSaved ? 'border-green-200 bg-green-50/50' : 
          isFilePending ? 'border-blue-200 bg-blue-50/50' : 
          autoSaveFailed ? 'border-yellow-200 bg-yellow-50/50' :
          'border-border bg-card/50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFileIcon(displayFile.type)}
              <div>
                <p className="font-medium text-sm flex items-center gap-2">
                  {displayFile.name}
                  {isFileSaved && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {isFilePending && <Save className="w-4 h-4 text-blue-500 animate-pulse" />}
                  {isProcessing && <Save className="w-4 h-4 text-orange-500 animate-spin" />}
                  {autoSaveFailed && <X className="w-4 h-4 text-amber-500" />}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(displayFile.size)}
                  {isFileSaved && <span className="text-green-600 ml-2">• Salvo no banco</span>}
                  {isFilePending && <span className="text-blue-600 ml-2">• Salvando...</span>}
                  {isRemoving && <span className="text-orange-600 ml-2">• Removendo...</span>}
                  {isUploading && <span className="text-blue-600 ml-2">• Carregando...</span>}
                  {autoSaveFailed && <span className="text-amber-600 ml-2">• Clique em 'Atualizar VIP'</span>}
                  {!isFileSaved && !isFilePending && !isProcessing && !autoSaveFailed && (
                    <span className="text-amber-600 ml-2">• Aguardando salvamento</span>
                  )}
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
            disabled={isUploading}
          />
          <Button type="button" variant="outline" asChild disabled={isUploading}>
            <label htmlFor="file-upload" className="cursor-pointer">
              {isUploading ? "Carregando..." : "Selecionar Arquivo"}
            </label>
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
