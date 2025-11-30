import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingState({ message = "Loading...", className, size = "md" }: LoadingStateProps) {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const paddingClasses = {
    sm: "py-6",
    md: "py-12",
    lg: "py-16",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", paddingClasses[size], className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {message && <p className="mt-3 text-muted-foreground text-sm">{message}</p>}
    </div>
  );
}
