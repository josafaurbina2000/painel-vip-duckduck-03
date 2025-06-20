
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Calendar, DollarSign, FileText, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVIP } from "@/contexts/VIPContext";
import { useToast } from "@/hooks/use-toast";
import { VIPFile } from "@/types/vip";
import FileUpload from "@/components/FileUpload";

const AddVIP = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const { addVIP, updateVIP, getVIPById, isLoading: contextLoading } = useVIP();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    playerName: "",
    amountPaid: "",
    startDate: new Date().toISOString().split('T')[0],
    durationDays: "",
    paymentProof: null as VIPFile | null,
    observations: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  // Carregar dados para edição
  useEffect(() => {
    if (editId && !contextLoading) {
      const vip = getVIPById(editId);
      if (vip) {
        console.log('Carregando VIP para edição:', vip);
        setFormData({
          playerName: vip.playerName,
          amountPaid: vip.amountPaid.toString(),
          startDate: new Date(vip.startDate).toISOString().split('T')[0],
          durationDays: vip.durationDays.toString(),
          paymentProof: vip.paymentProof || null,
          observations: vip.observations || ""
        });
      }
    }
  }, [editId, getVIPById, contextLoading]);

  const handleInputChange = (field: string, value: string | VIPFile | null) => {
    console.log('Campo alterado:', field, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Dados do formulário antes da validação:', formData);

      // Validações básicas com mensagens mais claras
      if (!formData.playerName.trim()) {
        throw new Error("Nome do jogador é obrigatório.");
      }

      const amountPaid = parseFloat(formData.amountPaid);
      if (!formData.amountPaid || isNaN(amountPaid) || amountPaid <= 0) {
        throw new Error("Valor pago deve ser maior que zero.");
      }

      const durationDays = parseInt(formData.durationDays);
      if (!formData.durationDays || isNaN(durationDays) || durationDays <= 0) {
        throw new Error("Duração em dias é obrigatória e deve ser maior que zero.");
      }

      const startDate = new Date(formData.startDate);
      if (isNaN(startDate.getTime())) {
        throw new Error("Data de início inválida.");
      }

      const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

      const vipData = {
        playerName: formData.playerName.trim(),
        amountPaid: amountPaid,
        startDate,
        endDate,
        durationDays: durationDays,
        paymentProof: formData.paymentProof,
        observations: formData.observations.trim(),
        createdAt: editId ? getVIPById(editId)?.createdAt || new Date() : new Date()
      };

      console.log('Dados que serão salvos:', vipData);

      if (editId) {
        console.log('Atualizando VIP existente:', editId);
        await updateVIP(editId, vipData);
      } else {
        console.log('Criando novo VIP');
        await addVIP(vipData);
      }

      navigate("/vips");
    } catch (error) {
      console.error('Erro ao salvar VIP:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao salvar VIP';
      toast({
        title: "Erro ao salvar",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
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
          <h1 className="text-3xl font-bold">
            {editId ? 'Editar VIP' : 'Adicionar Novo VIP'}
          </h1>
          <p className="text-muted-foreground">
            {editId ? 'Atualize as informações do VIP' : 'Preencha as informações do novo VIP'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações do Jogador */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações do Jogador
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="playerName">Nome do Jogador *</Label>
                  <Input
                    id="playerName"
                    value={formData.playerName}
                    onChange={(e) => handleInputChange("playerName", e.target.value)}
                    placeholder="Digite o nome do jogador"
                    className="bg-background/50"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Configurações do VIP
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
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

                  <div>
                    <Label htmlFor="durationDays">Duração (dias) *</Label>
                    <Input
                      id="durationDays"
                      type="number"
                      min="1"
                      value={formData.durationDays}
                      onChange={(e) => handleInputChange("durationDays", e.target.value)}
                      placeholder="Ex: 30"
                      className="bg-background/50"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações de Pagamento */}
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Informações de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="amountPaid">Valor Pago (R$) *</Label>
                  <Input
                    id="amountPaid"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amountPaid}
                    onChange={(e) => handleInputChange("amountPaid", e.target.value)}
                    placeholder="0,00"
                    className="bg-background/50"
                    required
                  />
                </div>

                <FileUpload
                  onFileSelect={(file) => handleInputChange("paymentProof", file)}
                  currentFile={formData.paymentProof}
                />
              </CardContent>
            </Card>

            {/* Observações */}
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="observations">Observações Adicionais</Label>
                  <Textarea
                    id="observations"
                    value={formData.observations}
                    onChange={(e) => handleInputChange("observations", e.target.value)}
                    placeholder="Adicione observações sobre este VIP..."
                    className="bg-background/50"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumo */}
          <div className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="text-lg">Resumo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Jogador</span>
                    <span className="font-medium">{formData.playerName || "—"}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Valor</span>
                    <span className="font-medium">
                      {formData.amountPaid ? `R$ ${parseFloat(formData.amountPaid).toFixed(2)}` : "—"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duração</span>
                    <span className="font-medium">
                      {formData.durationDays ? `${formData.durationDays} dias` : "—"}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Comprovante</span>
                    <span className="font-medium">
                      {formData.paymentProof ? (
                        <span className="text-green-600">✅ Anexado</span>
                      ) : (
                        <span className="text-gray-500">❌ Não anexado</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isLoading || contextLoading}
                  >
                    {isLoading ? "Salvando..." : editId ? "Atualizar VIP" : "Adicionar VIP"}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/vips")}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddVIP;
