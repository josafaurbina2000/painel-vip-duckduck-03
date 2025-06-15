
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VIP, VIPFile } from '@/types/vip';
import { calculateVIPStatus } from '@/utils/vipUtils';
import { useToast } from '@/hooks/use-toast';

export const useVIPs = () => {
  const [vips, setVips] = useState<VIP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  // Check authentication state
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (event === 'SIGNED_IN') {
          setTimeout(() => {
            fetchVIPs();
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setVips([]);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Função para converter dados do Supabase para o tipo VIP
  const convertSupabaseToVIP = (data: any): VIP => {
    const vip: VIP = {
      id: data.id,
      playerName: data.player_name,
      startDate: new Date(data.start_date),
      endDate: new Date(data.end_date),
      durationDays: data.duration_days,
      amountPaid: data.amount_paid,
      observations: data.observations || '',
      createdAt: new Date(data.created_at),
      status: calculateVIPStatus({
        startDate: new Date(data.start_date),
        endDate: new Date(data.end_date)
      } as VIP)
    };

    // Adicionar arquivo se existir
    if (data.payment_proof_name && data.payment_proof_data) {
      vip.paymentProof = {
        name: data.payment_proof_name,
        type: data.payment_proof_type,
        size: data.payment_proof_size,
        data: data.payment_proof_data
      };
    }

    return vip;
  };

  // Carregar VIPs do Supabase
  const fetchVIPs = async () => {
    try {
      if (!user) {
        setVips([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const { data, error } = await supabase
        .from('vips')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const convertedVIPs = data.map(convertSupabaseToVIP);
      setVips(convertedVIPs);
    } catch (error) {
      console.error('Erro ao carregar VIPs:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os VIPs do banco de dados.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Adicionar novo VIP
  const addVIP = async (newVipData: Omit<VIP, 'id' | 'status'>) => {
    try {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const insertData = {
        user_id: user.id,
        player_name: newVipData.playerName,
        start_date: newVipData.startDate.toISOString(),
        end_date: newVipData.endDate.toISOString(),
        duration_days: newVipData.durationDays,
        amount_paid: newVipData.amountPaid,
        observations: newVipData.observations || null,
        status: calculateVIPStatus(newVipData as VIP),
        payment_proof_name: newVipData.paymentProof?.name || null,
        payment_proof_type: newVipData.paymentProof?.type || null,
        payment_proof_size: newVipData.paymentProof?.size || null,
        payment_proof_data: newVipData.paymentProof?.data || null
      };

      const { data, error } = await supabase
        .from('vips')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;

      const newVIP = convertSupabaseToVIP(data);
      setVips(prev => [newVIP, ...prev]);

      toast({
        title: "VIP adicionado!",
        description: `O VIP de ${newVipData.playerName} foi salvo no banco de dados.`,
      });

      return newVIP;
    } catch (error) {
      console.error('Erro ao adicionar VIP:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o VIP no banco de dados.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Atualizar VIP
  const updateVIP = async (id: string, updates: Partial<VIP>) => {
    try {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      console.log('Atualizando VIP:', id, 'com dados:', updates);
      
      // Validar se o VIP existe
      const currentVIP = vips.find(v => v.id === id);
      if (!currentVIP) {
        throw new Error('VIP não encontrado');
      }
      
      const updateData: any = {};
      
      // Mapear os campos corretamente
      if (updates.playerName !== undefined) updateData.player_name = updates.playerName.trim();
      if (updates.startDate !== undefined) updateData.start_date = updates.startDate.toISOString();
      if (updates.endDate !== undefined) updateData.end_date = updates.endDate.toISOString();
      if (updates.durationDays !== undefined) updateData.duration_days = Number(updates.durationDays);
      if (updates.amountPaid !== undefined) updateData.amount_paid = Number(updates.amountPaid);
      if (updates.observations !== undefined) updateData.observations = updates.observations?.trim() || null;
      
      // Tratar comprovante de pagamento
      if (updates.hasOwnProperty('paymentProof')) {
        console.log('Atualizando comprovante de pagamento:', updates.paymentProof);
        if (updates.paymentProof) {
          // Adicionando ou atualizando comprovante
          updateData.payment_proof_name = updates.paymentProof.name;
          updateData.payment_proof_type = updates.paymentProof.type;
          updateData.payment_proof_size = updates.paymentProof.size;
          updateData.payment_proof_data = updates.paymentProof.data;
        } else {
          // Removendo comprovante
          updateData.payment_proof_name = null;
          updateData.payment_proof_type = null;
          updateData.payment_proof_size = null;
          updateData.payment_proof_data = null;
        }
      }

      // Recalcular status se necessário
      if (updates.startDate || updates.endDate) {
        const updatedVIP = { ...currentVIP, ...updates };
        updateData.status = calculateVIPStatus(updatedVIP);
      }

      // Validar dados antes de enviar
      if (updateData.player_name !== undefined && !updateData.player_name) {
        throw new Error('Nome do jogador é obrigatório');
      }
      if (updateData.amount_paid !== undefined && (isNaN(updateData.amount_paid) || updateData.amount_paid <= 0)) {
        throw new Error('Valor pago deve ser um número maior que zero');
      }
      if (updateData.duration_days !== undefined && (isNaN(updateData.duration_days) || updateData.duration_days <= 0)) {
        throw new Error('Duração deve ser um número maior que zero');
      }

      console.log('Dados que serão enviados para o Supabase:', updateData);

      const { data, error } = await supabase
        .from('vips')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro do Supabase ao atualizar:', error);
        throw new Error(`Erro do banco de dados: ${error.message}`);
      }

      if (!data) {
        throw new Error('Nenhum dado retornado após atualização');
      }

      console.log('VIP atualizado no Supabase:', data);

      const updatedVIP = convertSupabaseToVIP(data);
      setVips(prev => prev.map(vip => vip.id === id ? updatedVIP : vip));

      toast({
        title: "VIP atualizado!",
        description: "As alterações foram salvas no banco de dados.",
      });

      return updatedVIP;
    } catch (error) {
      console.error('Erro ao atualizar VIP:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: "Erro ao atualizar",
        description: `Não foi possível atualizar o VIP: ${errorMessage}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Deletar VIP
  const deleteVIP = async (id: string) => {
    try {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { error } = await supabase
        .from('vips')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setVips(prev => prev.filter(vip => vip.id !== id));

      toast({
        title: "VIP removido",
        description: "O VIP foi removido do banco de dados.",
      });
    } catch (error) {
      console.error('Erro ao deletar VIP:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o VIP do banco de dados.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Buscar VIP por ID
  const getVIPById = (id: string) => {
    return vips.find(vip => vip.id === id);
  };

  // Limpar todos os dados
  const clearAllData = async () => {
    try {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { error } = await supabase
        .from('vips')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) throw error;

      setVips([]);
      
      toast({
        title: "Dados limpos",
        description: "Todos os VIPs foram removidos do banco de dados.",
      });
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      toast({
        title: "Erro",
        description: "Não foi possível limpar os dados do banco de dados.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchVIPs();
    }
  }, [user]);

  return {
    vips,
    isLoading,
    user,
    addVIP,
    updateVIP,
    deleteVIP,
    getVIPById,
    clearAllData,
    refetch: fetchVIPs
  };
};
