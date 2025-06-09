
import { Badge } from "@/components/ui/badge";

interface VIPBadgeProps {
  status: 'active' | 'expired';
  className?: string;
}

const VIPBadge = ({ status, className }: VIPBadgeProps) => {
  const variants = {
    active: {
      className: "bg-success/10 text-success border-success/20 hover:bg-success/20",
      label: "Ativo"
    },
    expired: {
      className: "bg-danger/10 text-danger border-danger/20 hover:bg-danger/20",
      label: "Expirado"
    }
  };

  const variant = variants[status];

  return (
    <Badge 
      className={`${variant.className} ${className}`}
      variant="outline"
    >
      {variant.label}
    </Badge>
  );
};

export default VIPBadge;
