
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface StorageFile {
  name: string;
  type: string;
  size: number;
  url: string;
  path: string;
}

export const useStorageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File): Promise<StorageFile | null> => {
    try {
      setIsUploading(true);
      
      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `payment-proofs/${fileName}`;

      console.log('Fazendo upload do arquivo:', fileName);

      // Upload para o Supabase Storage
      const { data, error } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Erro no upload:', error);
        throw error;
      }

      console.log('Upload concluído:', data);

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(filePath);

      const storageFile: StorageFile = {
        name: file.name,
        type: file.type,
        size: file.size,
        url: urlData.publicUrl,
        path: filePath
      };

      return storageFile;
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível fazer upload do arquivo. Tente novamente.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (filePath: string): Promise<boolean> => {
    try {
      console.log('Deletando arquivo:', filePath);

      const { error } = await supabase.storage
        .from('payment-proofs')
        .remove([filePath]);

      if (error) {
        console.error('Erro ao deletar arquivo:', error);
        throw error;
      }

      console.log('Arquivo deletado com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      toast({
        title: "Erro ao deletar",
        description: "Não foi possível deletar o arquivo. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    uploadFile,
    deleteFile,
    isUploading
  };
};
