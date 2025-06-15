import React, { useCallback, useState } from 'react';
import { Upload, File, X, Image, FileText, CheckCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { VIPFile } from '@/types/vip';
import { useToast } from '@/hooks/use-toast';

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
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (file: File) => {
    console.log('Arquivo selecionado:', file.name, file.type, file.size);
    if (!validateFile(file)) return;

    try {
      const base64Data = await convertToBase64(file);
      const vipFile: VIPFile = {
        name: file.name,
        type: file.type,
        size: file.size,
        data: base64Data
      };

      console.log('Arquivo convertido para VIPFile:', vipFile.name);

      if (isEditMode && onAutoSave) {
        // Em modo de edição, auto-salvar
        setPendingFile(vipFile);
        toast({
          title: "Salvando comprovante...",
          description: "Aguarde enquanto o arquivo é salvo.",
        });
        
        try {
          await onAutoSave(vipFile);
          setPendingFile(null);
          onFileSelect(vipFile);
          toast({
            title: "Comprovante salvo!",
            description: `${file.name} foi salvo no banco de dados.`,
          });
        } catch (error) {
          console.error('Erro ao salvar automaticamente:', error);
          setPendingFile(null);
          toast({
            title: "Erro ao salvar",
            description: "Não foi possível salvar automaticamente. Use o botão Atualizar VIP.",
            variant: "destructive",
          });
          onFileSelect(vipFile);
        }
      } else {
        // Modo de criação, apenas selecionar
        onFileSelect(vipFile);
        toast({
          title: "Arquivo selecionado",
          description: `${file.name} foi selecionado. ${isEditMode ? 'Clique em "Atualizar VIP" para salvar.' : 'Clique em "Adicionar VIP" para salvar.'}`,
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
    
    if (isEditMode && onAutoRemove && currentFile) {
      // Em modo de edição, auto-remover do banco
      setIsRemoving(true);
      toast({
        title: "Removendo comprovante...",
        description: "Aguarde enquanto o arquivo é removido do banco.",
      });
      
      try {
        await onAutoRemove();
        setPendingFile(null);
        onFileSelect(null);
        toast({
          title: "Comprovante removido!",
          description: "O comprovante foi removido do banco de dados.",
        });
      } catch (error) {
        console.error('Erro ao remover automaticamente:', error);
        toast({
          title: "Erro ao remover",
          description: "Não foi possível remover automaticamente. Use o botão Atualizar VIP.",
          variant: "destructive",
        });
      } finally {
        setIsRemoving(false);
      }
    } else {
      // Modo de criação ou sem auto-remove, apenas remover localmente
      setPendingFile(null);
      onFileSelect(null);
      toast({
        title: "Arquivo removido",
        description: isEditMode ? "Use o botão 'Atualizar VIP' para salvar a remoção." : "O comprovante foi removido.",
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
  const isFileSaved = currentFile && !pendingFile;
  const isFilePending = pendingFile !== null;

  return (
    <div className="space-y-4">
      <Label className="flex items-center gap-2">
        {label}
        {isFileSaved && <CheckCircle className="w-4 h-4 text-green-500" />}
        {isFilePending && <Save className="w-4 h-4 text-blue-500 animate-pulse" />}
      </Label>
      
      {displayFile ? (
        <div className={`border rounded-lg p-4 ${
          isFileSaved ? 'border-green-200 bg-green-50/50' : 
          isFilePending ? 'border-blue-200 bg-blue-50/50' : 
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
                  {(isSaving || isRemoving) && <Save className="w-4 h-4 text-orange-500 animate-spin" />}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(displayFile.size)}
                  {isFileSaved && <span className="text-green-600 ml-2">• Salvo no banco</span>}
                  {isFilePending && <span className="text-blue-600 ml-2">• Salvando...</span>}
                  {isRemoving && <span className="text-orange-600 ml-2">• Removendo...</span>}
                  {!isFileSaved && !isFilePending && !isSaving && !isRemoving && (
                    <span className="text-amber-600 ml-2">• Não salvo</span>
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
              disabled={isSaving || isRemoving}
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
          />
          <Button type="button" variant="outline" asChild>
            <label htmlFor="file-upload" className="cursor-pointer">
              Selecionar Arquivo
            </label>
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
