
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useVIP } from "@/contexts/VIPContext";

const AddVIP = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addVIP } = useVIP();
  
  const [formData, setFormData] = useState({
    playerName: "",
    startDate: "",
    durationDays: "",
    amountPaid: "",
    paymentProof: null as File | null,
    observations: "",
    isPermanent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Arquivo inválido",
          description: "Por favor, selecione uma imagem (JPG, PNG, GIF) ou PDF.",
          variant: "destructive"
        });
        return;
      }
      
      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 5MB.",
          variant: "destructive"
        });
        return;
      }
      
      setFormData(prev => ({ ...prev, paymentProof: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validações
      if (!formData.playerName.trim()) {
        throw new Error("Nome do jogador é obrigatório");
      }
      
      if (!formData.startDate) {
        throw new Error("Data de início é obrigatória");
      }
      
      if (!formData.isPermanent && (!formData.durationDays || parseInt(formData.durationDays) <= 0)) {
        throw new Error("Duração em dias é obrigatória para VIPs temporários");
      }
      
      if (!formData.amountPaid || parseFloat(formData.amountPaid) <= 0) {
        throw new Error("Valor pago é obrigatório");
      }
      
      if (!formData.paymentProof) {
        throw new Error("Comprovante de pagamento é obrigatório");
      }

      // Calcular data final
      const startDate = new Date(formData.startDate);
      const durationDays = formData.isPermanent ? 0 : parseInt(formData.durationDays);
      const endDate = formData.isPermanent 
        ? new Date("2099-12-31") 
        : new Date(startDate.getTime() + (durationDays * 24 * 60 * 60 * 1000));

      // Criar objeto VIP
      const newVIP = {
        playerName: formData.playerName.trim(),
        startDate,
        durationDays,
        endDate,
        amountPaid: parseFloat(formData.amountPaid),
        paymentProof: formData.paymentProof.name, // Em um app real, faria upload do arquivo
        createdAt: new Date(),
        observations: formData.observations.trim(),
        isPermanent: formData.isPermanent
      };

      // Adicionar VIP usando o contexto
      addVIP(newVIP);

      toast({
        title: "VIP cadastrado com sucesso!",
        description: `${formData.playerName} foi adicionado à lista de VIPs.`,
      });

      navigate("/vips");
    } catch (error) {
      toast({
        title: "Erro ao cadastrar VIP",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate(-1)}
          className="hover:bg-muted/50"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Adicionar VIP</h1>
          <p className="text-muted-foreground">
            Cadastrar novo jogador VIP no servidor
          </p>
        </div>
      </div>

      {/* Formulário */}
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle>Dados do VIP</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome do jogador */}
              <div className="space-y-2">
                <Label htmlFor="playerName">Nome do Jogador *</Label>
                <Input
                  id="playerName"
                  placeholder="Ex: SnIpEr_BF4_PRO"
                  value={formData.playerName}
                  onChange={(e) => handleInputChange("playerName", e.target.value)}
                  className="bg-background/50"
                  required
                />
              </div>

              {/* Data de início */}
              <div className="space-y-2">
                <Label htmlFor="startDate">Data de Início *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  className="bg-background/50"
                  required
                />
              </div>

              {/* Duração em dias */}
              <div className="space-y-2">
                <Label htmlFor="durationDays">
                  Duração (dias) {!formData.isPermanent && "*"}
                </Label>
                <Input
                  id="durationDays"
                  type="number"
                  placeholder="Ex: 30"
                  value={formData.durationDays}
                  onChange={(e) => handleInputChange("durationDays", e.target.value)}
                  className="bg-background/50"
                  disabled={formData.isPermanent}
                  required={!formData.isPermanent}
                  min="1"
                />
              </div>

              {/* Valor pago */}
              <div className="space-y-2">
                <Label htmlFor="amountPaid">Valor Pago (R$) *</Label>
                <Input
                  id="amountPaid"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 25.00"
                  value={formData.amountPaid}
                  onChange={(e) => handleInputChange("amountPaid", e.target.value)}
                  className="bg-background/50"
                  required
                  min="0.01"
                />
              </div>
            </div>

            {/* VIP Permanente */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPermanent"
                checked={formData.isPermanent}
                onCheckedChange={(checked) => {
                  handleInputChange("isPermanent", checked);
                  if (checked) {
                    handleInputChange("durationDays", "");
                  }
                }}
              />
              <Label htmlFor="isPermanent" className="text-sm font-medium">
                VIP Permanente
              </Label>
            </div>

            {/* Upload do comprovante */}
            <div className="space-y-2">
              <Label htmlFor="paymentProof">Comprovante de Pagamento *</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 bg-background/30">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <div className="space-y-2">
                    <Label
                      htmlFor="paymentProof"
                      className="cursor-pointer text-primary hover:text-primary/80 font-medium"
                    >
                      Clique para fazer upload
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      PNG, JPG, GIF ou PDF até 5MB
                    </p>
                  </div>
                  <Input
                    id="paymentProof"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                </div>
                {formData.paymentProof && (
                  <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <p className="text-sm font-medium text-primary">
                      Arquivo selecionado: {formData.paymentProof.name}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Observações */}
            <div className="space-y-2">
              <Label htmlFor="observations">Observações</Label>
              <Textarea
                id="observations"
                placeholder="Informações adicionais sobre o VIP (opcional)"
                value={formData.observations}
                onChange={(e) => handleInputChange("observations", e.target.value)}
                className="bg-background/50 min-h-[100px]"
                rows={4}
              />
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Salvando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Salvar VIP
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddVIP;
