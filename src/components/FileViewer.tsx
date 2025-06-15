
import React from 'react';
import { Download, Eye, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { VIPFile } from '@/types/vip';
import { useToast } from '@/hooks/use-toast';

interface FileViewerProps {
  file: VIPFile;
  showInline?: boolean;
}

const FileViewer: React.FC<FileViewerProps> = ({ file, showInline = false }) => {
  const { toast } = useToast();

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = file.data;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível baixar o arquivo.",
        variant: "destructive",
      });
    }
  };

  const handleOpenPDF = () => {
    try {
      if (file.type === 'application/pdf') {
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(`
            <html>
              <head><title>${file.name}</title></head>
              <body style="margin:0; padding:0;">
                <iframe src="${file.data}" style="width:100%; height:100vh; border:none;"></iframe>
              </body>
            </html>
          `);
        } else {
          // Fallback se pop-up for bloqueado
          handleDownload();
          toast({
            title: "Pop-up bloqueado",
            description: "O arquivo foi baixado. Abra o PDF no seu computador.",
          });
        }
      }
    } catch (error) {
      console.error('Erro ao abrir PDF:', error);
      handleDownload();
      toast({
        title: "Erro ao visualizar",
        description: "O arquivo foi baixado. Abra o PDF no seu computador.",
      });
    }
  };

  const renderFileContent = () => {
    if (file.type === 'application/pdf') {
      return (
        <div className="p-8 text-center space-y-4">
          <div className="text-6xl">📄</div>
          <div>
            <h3 className="font-medium mb-2">{file.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Arquivo PDF - Clique para visualizar em nova aba
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleOpenPDF} className="gap-2">
                <ExternalLink className="w-4 h-4" />
                Abrir PDF
              </Button>
              <Button variant="outline" onClick={handleDownload} className="gap-2">
                <Download className="w-4 h-4" />
                Baixar
              </Button>
            </div>
          </div>
        </div>
      );
    }
    
    if (file.type.startsWith('image/')) {
      return (
        <img
          src={file.data}
          alt={file.name}
          className="max-w-full h-auto rounded-lg"
          onError={() => {
            toast({
              title: "Erro",
              description: "Não foi possível carregar a imagem.",
              variant: "destructive",
            });
          }}
        />
      );
    }

    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Prévia não disponível para este tipo de arquivo.</p>
        <Button variant="outline" onClick={handleDownload} className="gap-2 mt-4">
          <Download className="w-4 h-4" />
          Baixar
        </Button>
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
