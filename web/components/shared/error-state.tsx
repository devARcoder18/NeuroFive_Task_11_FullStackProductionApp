import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-coral/20 bg-coral/5 py-12 text-center">
      <AlertTriangle className="mb-3 h-5 w-5 text-coral" />
      <p className="text-sm text-ink">{message ?? "Something went wrong."}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
