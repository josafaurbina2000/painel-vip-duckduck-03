
import React from 'react';
import { Download, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { VIPFile } from '@/types/vip';

interface FileViewerProps {
  file: VIPFile;
  showInline?: boolean;
}

const FileViewer: React.FC<FileViewerProps> = ({ file, showInline = false }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    // Usar URL do storage se disponível, senão usar data base64
    link.href = file.url || file.data || '';
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderFileContent = () => {
    // Usar URL do storage se disponível
    const fileSource = file.url || file.data;
    
    if (!fileSource) {
      return (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Arquivo não disponível.</p>
        </div>
      );
    }

    if (file.type === 'application/pdf') {
      return (
        <iframe
          src={fileSource}
          className="w-full h-96 border rounded-lg"
          title={file.name}
        />
      );
    }
    
    if (file.type.startsWith('image/')) {
      return (
        <img
          src={fileSource}
          alt={file.name}
          className="max-w-full h-auto rounded-lg"
        />
      );
    }

    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Prévia não disponível para este tipo de arquivo.</p>
      </div>
    );
  };

  if (showInline) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Comprovante de Pagamento</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Baixar
          </Button>
        </div>
        {renderFileContent()}
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Eye className="w-4 h-4" />
          Visualizar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{file.name}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Baixar
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {renderFileContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileViewer;
