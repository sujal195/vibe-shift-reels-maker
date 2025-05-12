
import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BlueTickBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  tooltip?: string;
}

const BlueTickBadge = ({ 
  size = 'md', 
  className,
  tooltip = "Verified user"
}: BlueTickBadgeProps) => {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn("inline-flex text-primary", className)}>
            <BadgeCheck className={cn(sizeClasses[size])} />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BlueTickBadge;
